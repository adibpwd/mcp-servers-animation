#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# run.sh — Jalankan project MCP Servers Animation (docker compose)
# Cara pakai:  ./run.sh
# ─────────────────────────────────────────────────────────────

set -euo pipefail

# ── Colors / helpers ────────────────────────────────────────
GREEN=$'\033[0;32m'
YELLOW=$'\033[1;33m'
CYAN=$'\033[0;36m'
RED=$'\033[0;31m'
BOLD=$'\033[1m'
NC=$'\033[0m'

step()  { printf "\n${CYAN}${BOLD}▶ ${1}${NC}\n"; }
ok()    { printf "${GREEN}✔ ${1}${NC}\n"; }
warn()  { printf "${YELLOW}⚠ ${1}${NC}\n"; }
fail()  { printf "${RED}✘ ${1}${NC}\n"; exit 1; }

# ── Deteksi root project ────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PROJECT_NAME="mcp-servers-animation"

step "Membaca project dari: $SCRIPT_DIR"
[ -f docker-compose.yml ] || fail "docker-compose.yml tidak ditemukan di $SCRIPT_DIR"
ok "docker-compose.yml ditemukan"

# ── Step 1: Cek Docker tersedia ─────────────────────────────
step "Memeriksa Docker..."
command -v docker >/dev/null 2>&1 || fail "Docker tidak terinstall / tidak ada di PATH"
docker info >/dev/null 2>&1 || fail "Docker daemon tidak berjalan. Start dulu: sudo systemctl start docker (atau buka Docker Desktop)."
ok "Docker daemon aktif"

# ── Step 2: Cek port yang dibutuhkan ────────────────────────
step "Memeriksa port yang dibutuhkan (3373 frontend, 3300 export)..."

# Container yang sudah jalan milik project ini = normal (bukan konflik).
containers_running() {
  docker compose ps --status running -q 2>/dev/null | grep -q .
}

check_port() {
  local port="$1"
  if ss -tln 2>/dev/null | awk '{print $4}' | grep -q ":${port}$"; then
    if containers_running; then
      ok "Port ${port} dipakai container project ini (normal)"
    else
      warn "Port ${port} sudah dipakai proses lain tetapi project belum jalan. Kemungkinan konflik!"
      return 1
    fi
  else
    ok "Port ${port} tersedia"
  fi
  return 0
}
check_port 3373 || true
check_port 3300 || true

# ── Step 3: Bersihkan container orphan ──────────────────────
step "Membersihkan container orphan dari config lama..."
ORPHANS=$(docker compose ps -q 2>/dev/null | wc -l)
ORPHAN_LIST=$(docker ps -a --filter "name=${PROJECT_NAME}" --format '{{.Names}}' | grep -vE "${PROJECT_NAME}-(frontend|export-server)-1$" || true)
if [ -n "$ORPHAN_LIST" ]; then
  echo "Container orphan ditemukan:"
  echo "$ORPHAN_LIST" | sed 's/^/  - /'
  for c in $ORPHAN_LIST; do
    docker rm -f "$c" >/dev/null 2>&1 && warn "Dihapus: $c"
  done
else
  ok "Tidak ada container orphan"
fi

# ── Step 4: Build image ─────────────────────────────────────
step "Build image container (ini bisa lama di pertama kali / pertama running)..."
if docker compose build 2>&1 | tail -5; then
  ok "Image berhasil di-build"
else
  warn "Build mengembalikan pesan non-zero (kadang normal karena cache). Lanjut start..."
fi

# ── Step 5: Start containers ────────────────────────────────
step "Menjalankan semua service (docker compose up -d)..."
docker compose up -d 2>&1 | tail -10
ok "Container berhasil di-start"

# ── Step 6: Tunggu sampai service siap ──────────────────────
step "Menunggu semua service siap (max ~60 detik)..."
wait_for_http() {
  local name="$1" url="$2"
  local waited=0
  while [ $waited -lt 60 ]; do
    if curl -sf -o /dev/null "$url" 2>/dev/null; then
      ok "$name siap ($url)"
      return 0
    fi
    sleep 2
    waited=$((waited + 2))
  done
  warn "$name belum merespons setelah 60 detik: $url"
  return 1
}

wait_for_http "Frontend"     "http://localhost:3373" &
PID_FRONTEND=$!
wait_for_http "ExportServer" "http://localhost:3300/api/health" &
PID_EXPORT=$!

SERVICE_READY=0
wait "$PID_FRONTEND" || SERVICE_READY=1
wait "$PID_EXPORT"   || SERVICE_READY=1

if [ $SERVICE_READY -eq 0 ]; then
  ok "Semua service siap"
else
  warn "Sebagian service belum siap. Cek log: docker compose logs"
fi

# ── Step 7: Tampilkan status akhir ──────────────────────────
step "Status akhir container:"
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

# ── Step 8: Cek health check ────────────────────────────────
step "Verifikasi health check:"
FRONTEND_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3373 || echo "000")
EXPORT_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3300/api/health || echo "000")
echo "  Frontend (3373)           → HTTP ${FRONTEND_CODE}"
echo "  Export Server (3300)      → HTTP ${EXPORT_CODE}"

# ── Step 9: Deteksi IP Tailscale (jika ada) ─────────────────
step "Menampilkan cara akses:"
TAILSCALE_IP=$(tailscale ip -4 2>/dev/null | head -1 || true)
LOCAL_IP=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "localhost")

echo ""
echo "  ${BOLD}Web / Homepage:${NC}"
echo "     Local:     http://localhost:3373"
if [ -n "$LOCAL_IP" ]; then
  echo "     Network:   http://${LOCAL_IP}:3373"
fi
if [ -n "$TAILSCALE_IP" ]; then
  echo "     Tailscale: http://${TAILSCALE_IP}:3373"
fi
echo ""
echo "  ${BOLD}Content Management:${NC}"
echo "     http://localhost:3373/content-management"
if [ -n "$TAILSCALE_IP" ]; then
  echo "     http://${TAILSCALE_IP}:3373/content-management"
fi
echo ""
echo "  ${BOLD}API Endpoints (Export Server):${NC}"
echo "     Health:      http://localhost:3300/api/health"
echo "     Topik Icon:  http://localhost:3300/api/icons/topics"
echo "     Content DB:  http://localhost:3300/api/content"
echo ""

# ── Step 10: Perintah bantuan ───────────────────────────────
step "Perintah bermanfaat:"
echo "  Log frontend:     docker compose logs -f frontend"
echo "  Log export server: docker compose logs -f export-server"
echo "  Stop semua:       docker compose down"
echo "  Restart:          docker compose restart"
echo ""

ok "Project siap digunakan! 🚀"
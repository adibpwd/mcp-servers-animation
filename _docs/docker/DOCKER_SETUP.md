# MCP Servers Animation - Docker Setup

## Quick Start with Docker Compose

### Prerequisites
- Docker installed
- Docker Compose installed

### Start Services

```bash
cd mcp-servers-animation

# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### Access

- **Frontend:** http://localhost:5173
- **Export Server:** http://localhost:3000

### Stop Services

```bash
# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   Frontend      │◄────────┤  Export Server   │
│   (Vite:5173)   │  CORS   │  (Node:3000)     │
│                 │  ✓      │                  │
│  - React UI     │         │  - Video Export  │
│  - Animation    │         │  - FFmpeg        │
│  - Preview      │         │  - Puppeteer     │
└─────────────────┘         └──────────────────┘
         │                           │
         └───────────────┬───────────┘
                         │
                   Docker Network
                   (mcp-network)
```

## Features

- ✅ **No CORS issues** - Services communicate via internal Docker network
- ✅ **Hot reload** - Frontend auto-reloads on code changes
- ✅ **Audio export** - 44 SFX events for virtual-memory topic
- ✅ **Floating progress** - Non-intrusive bottom-right indicator
- ✅ **Timeline hiding** - PREV/NEXT buttons hidden during export

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :5173
lsof -i :3000

# Kill the process or change ports in docker-compose.yml
```

### Rebuild After Changes

```bash
# Rebuild specific service
docker-compose build frontend
docker-compose build export-server

# Restart
docker-compose up -d
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f export-server
docker-compose logs -f frontend
```

## Development Workflow

1. **Make code changes** (files are mounted as volumes)
2. **Frontend auto-reloads** (Vite HMR)
3. **Export-server:** Restart container if needed
   ```bash
   docker-compose restart export-server
   ```

## Environment Variables

Edit `.env.docker` to customize:

```env
VITE_EXPORT_SERVER_URL=http://export-server:3000
NODE_ENV=development
```

## Export Video

1. Access frontend: http://localhost:5173
2. Select "Virtual Memory" topic
3. Click "Export MP4"
4. Choose duration (30s, 40s, or 45s)
5. Watch progress indicator (bottom-right)
6. Download completed video

**Expected log output:**
```
Sound effects: 44 scheduled
[Audio] Copied 34 audio files...
Captured 1200 frames successfully
Encoding complete
```

## Manual Setup (Without Docker)

If you prefer manual setup:

### Terminal 1: Export Server
```bash
cd mcp-servers-animation
npm run export-server
```

### Terminal 2: Frontend
```bash
cd mcp-servers-animation
npm run dev
```

**Note:** Manual setup requires updating `PlayerShell.jsx` with correct server URL.

## Production Deployment

For production, use:

```bash
# Build frontend
npm run build

# Serve static files + export server
docker-compose -f docker-compose.prod.yml up -d
```

## Support

Issues? Check:
- Docker logs: `docker-compose logs`
- Browser console for frontend errors
- Server logs for export issues

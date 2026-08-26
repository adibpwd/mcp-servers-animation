#!/bin/bash
# Script to download free SFX from various sources

echo "Downloading playful SFX for Virtual Memory Animation..."

# Create a temp directory
mkdir -p /tmp/sfx_download

# Function to download with retry
download_file() {
    local url="$1"
    local output="$2"
    echo "Downloading: $output"
    wget -q --timeout=10 --tries=3 -O "$output" "$url" 2>/dev/null || curl -sL --max-time 10 --retry 3 -o "$output" "$url" 2>/dev/null
    if [ $? -eq 0 ] && [ -f "$output" ] && [ -s "$output" ]; then
        echo "✓ Downloaded: $output"
        return 0
    else
        echo "✗ Failed: $output"
        return 1
    fi
}

# UI Sounds
echo ""
echo "=== UI SOUNDS ==="
download_file "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" "ui/pop.wav"
download_file "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3" "ui/bounce.wav"
download_file "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3" "ui/chime.wav"
download_file "https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3" "ui/beep.wav"
download_file "https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3" "ui/plink.wav"

# Transitions
echo ""
echo "=== TRANSITION SOUNDS ==="
download_file "https://assets.mixkit.co/active_storage/sfx/2364/2364-preview.mp3" "transitions/slide-in.wav"
download_file "https://assets.mixkit.co/active_storage/sfx/2365/2365-preview.mp3" "transitions/swoosh.wav"
download_file "https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3" "transitions/teleport.wav"
download_file "https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3" "transitions/glitch.wav"

# Impacts
echo ""
echo "=== IMPACT SOUNDS ==="
download_file "https://assets.mixkit.co/active_storage/sfx/2575/2575-preview.mp3" "impacts/impact.wav"
download_file "https://assets.mixkit.co/active_storage/sfx/2576/2576-preview.mp3" "impacts/lock.wav"
download_file "https://assets.mixkit.co/active_storage/sfx/2577/2577-preview.mp3" "impacts/unlock.wav"
download_file "https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3" "impacts/swap.wav"

# Warnings
echo ""
echo "=== WARNING SOUNDS ==="
download_file "https://assets.mixkit.co/active_storage/sfx/2579/2579-preview.mp3" "warnings/alert-pulse.wav"
download_file "https://assets.mixkit.co/active_storage/sfx/2580/2580-preview.mp3" "warnings/critical-alert.wav"
download_file "https://assets.mixkit.co/active_storage/sfx/2581/2581-preview.mp3" "warnings/error-beep.wav"
download_file "https://assets.mixkit.co/active_storage/sfx/2582/2582-preview.mp3" "warnings/page-fault.wav"

# Success
echo ""
echo "=== SUCCESS SOUNDS ==="
download_file "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3" "success/victory.wav"
download_file "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3" "success/confirm.wav"
download_file "https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3" "success/complete.wav"
download_file "https://assets.mixkit.co/active_storage/sfx/2021/2021-preview.mp3" "success/charge.wav"

echo ""
echo "Download complete! Note: Files may be in MP3 format and need conversion to WAV."


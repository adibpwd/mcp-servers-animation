import wave, array, math, sys

def analyze(fn):
    w = wave.open(fn, 'rb')
    n = w.getnframes(); sr = w.getframerate(); ch = w.getnchannels(); sw = w.getsampwidth()
    dur = n / sr
    data = w.readframes(n)
    if sw != 2:
        print(fn, 'unsupported sampwidth', sw)
        return
    arr = array.array('h')
    arr.frombytes(data)
    if ch == 2:
        mono = [(arr[i] + arr[i+1]) // 2 for i in range(0, len(arr), 2)]
    else:
        mono = list(arr)
    absmono = [abs(x) for x in mono]
    peak = max(absmono)
    peak_idx = absmono.index(peak)
    peak_time = peak_idx / sr
    rms = math.sqrt(sum(x*x for x in mono) / len(mono))
    # early-window (first 30ms) peak vs overall peak
    early_n = int(sr * 0.03)
    early_peak = max(absmono[:early_n]) if early_n < len(absmono) else peak
    print(fn)
    print('  dur=%.3fs sr=%d ch=%d peak_time=%.3fs peak_amp=%d/32767 rms=%.1f early30ms_peak=%d' % (
        dur, sr, ch, peak_time, peak, rms, early_peak))

for f in [
    '/home/adb/Projects/Personal/mcp-servers-animation/mcp-servers-animation/public/audio/sfx/typing.wav',
    '/home/adb/Projects/Personal/mcp-servers-animation/mcp-servers-animation/public/audio/sfx/typing.wav.backup',
]:
    try:
        analyze(f)
    except Exception as e:
        print(f, 'ERROR', e)

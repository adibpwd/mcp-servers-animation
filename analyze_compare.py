import wave, array, math

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
    rms = math.sqrt(sum(x*x for x in mono) / len(mono))
    print('%-70s dur=%.3fs peak=%5d/32767 (%.0f%%) rms=%6.0f (%.0f%%)' % (
        fn.split('/')[-1], dur, peak, 100*peak/32767, rms, 100*rms/32767))

base = '/home/adb/Projects/Personal/mcp-servers-animation/mcp-servers-animation/public/audio'
for f in [
    f'{base}/sfx/typing.wav',
    f'{base}/sfx/click.wav',
    f'{base}/ui/pop.wav',
    f'{base}/ui/chime.wav',
    f'{base}/ui/tick.wav',
    f'{base}/ui/plink.wav',
    f'{base}/ui/beep.wav',
    f'{base}/sfx/scan.wav',
]:
    try:
        analyze(f)
    except Exception as e:
        print(f, 'ERROR', e)

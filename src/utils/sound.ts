// Multi-sensory feedback: Web Audio API synthesis, haptic vibration, and speech synthesis

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export type SoundEffect = 'digit' | 'clear' | 'pay' | 'error' | 'success' | 'miss';

export function playAudioFeedback(type: SoundEffect) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (type) {
      case 'digit': {
        // Calm warm wooden click (sine wave with short decay)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }
      case 'clear': {
        // Distinct soft undo knock
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.07);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.start(now);
        osc.stop(now + 0.07);
        break;
      }
      case 'pay': {
        // Upbeat confirmation sweep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }
      case 'error': {
        // Calm, non-punitive two-tone hum (not a harsh buzzer)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
        break;
      }
      case 'success': {
        // Uplifting major triad arpeggio (C5 - E5 - G5)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
          const noteOsc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          noteOsc.connect(noteGain);
          noteGain.connect(ctx.destination);

          const start = now + idx * 0.07;
          noteOsc.type = 'sine';
          noteOsc.frequency.setValueAtTime(freq, start);
          noteGain.gain.setValueAtTime(0.12, start);
          noteGain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
          noteOsc.start(start);
          noteOsc.stop(start + 0.25);
        });
        break;
      }
      case 'miss': {
        // Subtle haptic tick for tapping blank space
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
        break;
      }
    }
  } catch {
    // Graceful fallback if audio is not permitted by user gesture
  }
}

export function triggerVibration(pattern: number | number[]) {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration error on unsupported hardware
    }
  }
}

export function speakAmount(amount: string, vendor: string = 'Vegetable Stall') {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const text = `Paying ${amount} to ${vendor}. Enter your 4-digit PIN. You can clear any digit before paying.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // slightly slower, very clear
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

export function speakCalmMessage(text: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

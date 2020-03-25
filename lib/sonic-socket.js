import SonicCoder from "./sonic-coder";

/**
 * Encodes text as audio streams.
 *
 * 1. Receives a string of text.
 * 2. Creates an oscillator.
 * 3. Converts characters into frequencies.
 * 4. Transmits frequencies, waiting in between appropriately.
 */
class SonicSocket {
  constructor(params) {
    if (!window.audioContext) {
      window.audioContext =
        new window.AudioContext() || new webkitAudioContext();
    }
    params = params || {};
    this.coder = params.coder || new SonicCoder();
    this.charDuration = params.charDuration || 0.2;
    this.coder = params.coder || new SonicCoder(params);
    this.rampDuration = params.rampDuration || 0.001;
  }

  send(input, opt_callback) {
    // Surround the word with start and end characters.
    input = this.coder.startChar + input + this.coder.endChar;
    // Use WAAPI to schedule the frequencies.
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const freq = this.coder.charToFreq(char);
      const time = audioContext.currentTime + this.charDuration * i;
      this.scheduleToneAt(freq, time, this.charDuration);
    }

    // If specified, callback after roughly the amount of time it would have
    // taken to transmit the token.
    if (opt_callback) {
      const totalTime = this.charDuration * input.length;
      setTimeout(opt_callback, totalTime * 1000);
    }
  }

  scheduleToneAt(freq, startTime, duration) {
    const gainNode = audioContext.createGain();
    // Gain => Merger
    gainNode.gain.value = 0;

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(1, startTime + this.rampDuration);
    gainNode.gain.setValueAtTime(1, startTime + duration - this.rampDuration);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    gainNode.connect(audioContext.destination);

    const osc = audioContext.createOscillator();
    osc.frequency.value = freq;
    osc.connect(gainNode);

    osc.start(startTime);
  }
}

export default SonicSocket;

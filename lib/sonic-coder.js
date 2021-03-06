/**
 * A simple sonic encoder/decoder for [a-z0-9] => frequency (and back).
 * A way of representing characters with frequency.
 */
const ALPHABET = "\n abcdefghijklmnopqrstuvwxyz0123456789,.!?@*";

class SonicCoder {
  constructor(params) {
    params = params || {};
    this.freqMin = params.freqMin || 18500;
    this.freqMax = params.freqMax || 19500;
    this.freqError = params.freqError || 50;
    this.alphabetString = params.alphabet || ALPHABET;
    this.startChar = params.startChar || "^";
    this.endChar = params.endChar || "$";
    // Make sure that the alphabet has the start and end chars.
    this.alphabet = this.startChar + this.alphabetString + this.endChar;
  }

  /**
   * Given a character, convert to the corresponding frequency.
   */
  charToFreq(char) {
    // Get the index of the character.
    let index = this.alphabet.indexOf(char);
    if (index == -1) {
      // If this character isn't in the alphabet, error out.
      console.error(char, "is an invalid character.");
      index = this.alphabet.length - 1;
    }
    // Convert from index to frequency.
    const freqRange = this.freqMax - this.freqMin;
    const percent = index / this.alphabet.length;
    const freqOffset = Math.round(freqRange * percent);
    return this.freqMin + freqOffset;
  }

  /**
   * Given a frequency, convert to the corresponding character.
   */
  freqToChar(freq) {
    // If the frequency is out of the range.
    if (!(this.freqMin < freq && freq < this.freqMax)) {
      // If it's close enough to the min, clamp it (and same for max).
      if (this.freqMin - freq < this.freqError) {
        freq = this.freqMin;
      } else if (freq - this.freqMax < this.freqError) {
        freq = this.freqMax;
      } else {
        // Otherwise, report error.
        console.error(freq, "is out of range.");
        return null;
      }
    }
    // Convert frequency to index to char.
    const freqRange = this.freqMax - this.freqMin;
    const percent = (freq - this.freqMin) / freqRange;
    const index = Math.round(this.alphabet.length * percent);
    return this.alphabet[index];
  }
}

export default SonicCoder;

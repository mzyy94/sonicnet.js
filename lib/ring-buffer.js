class RingBuffer {
  constructor(maxLength) {
    this.array = [];
    this.maxLength = maxLength;
  }

  get(index) {
    if (index >= this.array.length) {
      return null;
    }
    return this.array[index];
  }

  last() {
    if (this.array.length == 0) {
      return null;
    }
    return this.array[this.array.length - 1];
  }

  add(value) {
    // Append to the end, remove from the front.
    this.array.push(value);
    if (this.array.length >= this.maxLength) {
      this.array.splice(0, 1);
    }
  }

  length() {
    // Return the actual size of the array.
    return this.array.length;
  }

  clear() {
    this.array = [];
  }

  copy() {
    // Returns a copy of the ring buffer.
    var out = new RingBuffer(this.maxLength);
    out.array = this.array.slice(0);
    return out;
  }

  remove(index, length) {
    //console.log('Removing', index, 'through', index+length);
    this.array.splice(index, length);
  }
}

module.exports = RingBuffer;

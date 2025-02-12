class Memory {
  constructor(initialMemory) {
    this.left = [];
    this.right = [];
    this.pointer = 0;

    if (typeof initialMemory === 'undefined' || initialMemory === null) return;
    if (typeof initialMemory === 'string') {
      initialMemory
        .split('')
        .forEach((value, index) => this.set(index, value.charCodeAt(0)));
      return;
    }
    if (Array.isArray(initialMemory)) {
      initialMemory.forEach((value, index) => this.set(index, value));
      return;
    }

    if (typeof initialMemory === 'object') {
      const keys = Object.keys(initialMemory);
      if (
        keys.includes('left') &&
        keys.includes('right') &&
        keys.includes('pointer')
      ) {
        this.left = [...memory.left];
        this.right = [...memory.right];
        this.pointer = memory.pointer;
        return;
      }
    }
  }

  get(index) {
    if (index >= 0) return this.#getRight(index);
    return this.#getLeft(-index - 1);
  }

  set(index, value) {
    if (index >= 0) this.#setRight(index, value);
    else this.#setLeft(-index - 1, value);
  }

  toString() {
    const leftLength = this.left.length;
    const memory = [...this.left, ...this.right]
      .map((v, i) => {
        const value = v || 0;
        const pointer = i < leftLength ? -leftLength + i : i - leftLength;
        const characterMap = value => {
          if (value === 9) return '\\t';
          if (value === 10) return '\\n';
          if (value === 13) return '\\r';
          if (value < 32) return null;
          if (value > 126) return null;
          return String.fromCharCode(value);
        };
        const string = characterMap(value);
        return `${pointer}: ${value}${string ? ` (${string})` : ''}`;
      })
      .join(', ');

    return `[${memory}]`;
  }

  movePointer(offset) {
    this.pointer += offset;
  }

  #getLeft(index) {
    if (this.left[index] === undefined) this.left[index] = 0;
    return this.left[index];
  }

  #setLeft(index, value) {
    this.left[index] = Math.min(Math.max(value, 0), 255);
  }

  #getRight(index) {
    if (this.right[index] === undefined) this.right[index] = 0;
    return this.right[index];
  }

  #setRight(index, value) {
    this.right[index] = Math.min(Math.max(value, 0), 255);
  }
}

export default Memory;

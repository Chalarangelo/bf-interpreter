class Memory {
  constructor() {
    this.left = [];
    this.right = [];
    this.pointer = 0;
  }

  get(index) {
    if (index >= 0) return this.#getRight(index);
    return this.#getLeft(-index - 1);
  }

  set(index, value) {
    if (index >= 0) this.right[index] = value % 256;
    else this.left[-index - 1] = value % 256;
  }

  movePointer(offset) {
    this.pointer += offset;
  }

  #getLeft(index) {
    if (this.left[index] === undefined) this.left[index] = 0;
    return this.left[index];
  }

  #getRight(index) {
    if (this.right[index] === undefined) this.right[index] = 0;
    return this.right[index];
  }
}

export default Memory;

import ASTNode from '../astNode.js';

class IncrementValueNode extends ASTNode {
  constructor(value) {
    super();
    this.value = value;
  }

  execute(memory, stdin, stdout) {
    memory.set(memory.pointer, memory.get(memory.pointer) + this.value);
  }
}

export default IncrementValueNode;

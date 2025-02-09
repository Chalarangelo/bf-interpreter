import ASTNode from '../astNode.js';

class IncrementPointerNode extends ASTNode {
  constructor(offset) {
    super();
    this.offset = offset;
  }

  execute(memory, stdin, stdout) {
    memory.movePointer(this.offset);
  }
}

export default IncrementPointerNode;

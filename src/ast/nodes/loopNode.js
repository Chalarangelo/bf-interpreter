import ASTNode from '../astNode.js';

class LoopNode extends ASTNode {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  execute(memory, stdin, stdout) {
    while (memory.get(memory.pointer) !== 0) {
      this.ast.execute(memory, stdin, stdout);
    }
  }
}

export default LoopNode;

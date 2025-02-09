import ASTNode from '../astNode.js';

class PrintValueNode extends ASTNode {
  execute(memory, stdin, stdout) {
    stdout.write(String.fromCharCode(memory.get(memory.pointer)));
  }
}

export default PrintValueNode;

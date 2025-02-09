import ASTNode from '../astNode.js';

class ReadValueNode extends ASTNode {
  execute(memory, stdin, stdout) {
    const value = stdin.read(1)?.charCodeAt(0) ?? 0;
    memory.set(memory.pointer, value);
  }
}

export default ReadValueNode;

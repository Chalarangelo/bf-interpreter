import IncrementPointerNode from './nodes/incrementPointerNode.js';
import IncrementValueNode from './nodes/incrementValueNode.js';
import PrintValueNode from './nodes/printValueNode.js';
import ReadValueNode from './nodes/readValueNode.js';
import LoopNode from './nodes/loopNode.js';

class AST {
  constructor() {
    this.nodes = [];
  }

  addNode(node) {
    this.nodes.push(node);
  }

  execute(memory, stdin, stdout) {
    for (let node of this.nodes) {
      node.execute(memory, stdin, stdout);
    }
  }
}

export {
  AST,
  IncrementPointerNode,
  IncrementValueNode,
  PrintValueNode,
  ReadValueNode,
  LoopNode,
};

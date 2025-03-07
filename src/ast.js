import util from 'util';

import ASTNode from './astNode.js';

const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');

class AST {
  constructor() {
    this.nodes = [];
  }

  addNode(node) {
    this.nodes.push(node);
  }

  execute(runner) {
    for (let node of this.nodes) {
      runner.runInstruction(node.instruction);
    }
  }

  [customInspectSymbol]() {
    return this.toString();
  }

  static fromJSON(json) {
    const ast = new AST();
    json.nodes.forEach(node => ast.addNode(ASTNode.fromJSON(node)));
    return ast;
  }

  toString(options = { indentation: 0 }) {
    const nodesString = this.nodes
      .map(node => node.toString(options))
      .join('\n');
    if (options.indentation !== 0) return nodesString;
    const lines = nodesString.split('\n');
    const maxLineNumberDigits = lines.length.toString().length;
    return lines
      .map(
        (line, index) =>
          `${(index + 1).toString().padStart(maxLineNumberDigits)}: ${line}`
      )
      .join('\n');
  }
}

export default AST;

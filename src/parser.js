import {
  AST,
  IncrementPointerNode,
  IncrementValueNode,
  PrintValueNode,
  ReadValueNode,
  LoopNode,
} from './ast/ast.js';

class Parser {
  constructor() {
    this.ast = new AST();
  }

  parse(tokens) {
    this.#parseTokens(tokens, 0);
    return this.ast;
  }

  #parseTokens(tokens, index) {
    while (index < tokens.length) {
      switch (tokens[index]) {
        case '>':
          this.ast.addNode(new IncrementPointerNode(1));
          break;
        case '<':
          this.ast.addNode(new IncrementPointerNode(-1));
          break;
        case '+':
          this.ast.addNode(new IncrementValueNode(1));
          break;
        case '-':
          this.ast.addNode(new IncrementValueNode(-1));
          break;
        case '.':
          this.ast.addNode(new PrintValueNode());
          break;
        case ',':
          this.ast.addNode(new ReadValueNode());
          break;
        case '[':
          const loopParser = new Parser();
          index = loopParser.#parseTokens(tokens, index + 1);
          this.ast.addNode(new LoopNode(loopParser.ast));
          break;
        case ']':
          return index;
      }
      index++;
    }
    return index;
  }
}

export default Parser;

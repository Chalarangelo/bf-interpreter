import AST from './ast.js';
import ASTNode from './astNode.js';

class Parser {
  static parse(code, debug = false) {
    if (debug) console.log('Parsing code:', code);
    const tokens = this.splitTokens(code);
    if (debug) console.log('Tokens:', tokens);
    const mergedTokens = this.mergeConsecutiveTokens(tokens);
    if (debug) console.log('Merged tokens:', mergedTokens);

    let ast = new AST();
    let stack = [];

    for (let token of mergedTokens) {
      if (Array.isArray(token)) {
        const [type, count] = token;
        if (type === '>')
          ast.addNode(new ASTNode('movePointer', { offset: count }));
        else if (type === '+')
          ast.addNode(new ASTNode('updateCell', { diff: count }));
      } else {
        switch (token) {
          case '>':
            ast.addNode(new ASTNode('movePointer', { offset: 1 }));
            break;
          case '<':
            ast.addNode(new ASTNode('movePointer', { offset: -1 }));
            break;
          case '+':
            ast.addNode(new ASTNode('updateCell', { diff: 1 }));
            break;
          case '-':
            ast.addNode(new ASTNode('updateCell', { diff: -1 }));
            break;
          case '.':
            ast.addNode(new ASTNode('printValue'));
            break;
          case ',':
            ast.addNode(new ASTNode('readValue'));
            break;
          case '0':
            ast.addNode(new ASTNode('clearCell'));
            break;
          case '[':
            stack.push(ast);
            ast = new AST();
            break;
          case ']':
            const loop = new ASTNode('loop', { nodes: ast });
            ast = stack.pop();
            ast.addNode(loop);
            break;
          default:
            throw new Error(`Invalid token: ${token}`);
        }
      }
    }

    if (stack.length) throw new Error('Unmatched loop start');

    return ast;
  }

  static splitTokens(code) {
    return code.replace(/[^><+\-,.[\]]/gm, '').split('');
  }

  static mergeConsecutiveTokens(tokens) {
    let mergedTokens = [];
    let lastGroup = null;

    for (let token of tokens) {
      if (lastGroup) {
        const [tokens, count] = lastGroup;
        if (tokens.includes(token)) {
          lastGroup[1] += token === tokens[0] ? 1 : -1;
          continue;
        } else if (
          token === ']' &&
          tokens === '+-' &&
          count === -1 &&
          mergedTokens[mergedTokens.length - 1] === '['
        ) {
          mergedTokens.pop();
          lastGroup = null;
          mergedTokens.push('0');
          continue;
        } else {
          if (count) mergedTokens.push([tokens[0], count]);
          lastGroup = null;
        }
      }

      if (token === '>') lastGroup = ['><', 1];
      else if (token === '<') lastGroup = ['><', -1];
      else if (token === '+') lastGroup = ['+-', 1];
      else if (token === '-') lastGroup = ['+-', -1];
      else mergedTokens.push(token);
    }

    if (lastGroup) {
      const [tokens, count] = lastGroup;
      if (count) mergedTokens.push([tokens[0], count]);
    }

    return mergedTokens;
  }
}

export default Parser;

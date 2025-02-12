import AST from './ast.js';

const nodeTypes = {
  movePointer: {
    params: {
      offset: 0,
    },
    stringify(node, options = { indentation: 0 }) {
      const { offset } = node;
      const indentationString = ' '.repeat(options.indentation);
      const sign = offset > 0 ? '>' : '';
      return `${indentationString}move_pointer: ${sign}${Math.abs(offset)}`;
    },
    createInstruction(node) {
      const { offset } = node;
      return runner => {
        const { memory } = runner;
        memory.movePointer(offset);
      };
    },
  },
  updateCell: {
    params: {
      diff: 0,
    },
    stringify(node, options = { indentation: 0 }) {
      const { diff } = node;
      const indentationString = ' '.repeat(options.indentation);
      const sign = diff > 0 ? '+' : '';
      return `${indentationString}update_cell: ${sign}${diff}`;
    },
    createInstruction(node) {
      const { diff } = node;
      return runner => {
        const { memory } = runner;
        memory.set(memory.pointer, memory.get(memory.pointer) + diff);
      };
    },
  },
  clearCell: {
    params: {},
    stringify(node, options = { indentation: 0 }) {
      const indentationString = ' '.repeat(options.indentation);
      return `${indentationString}clear_cell`;
    },
    createInstruction() {
      return runner => {
        const { memory } = runner;
        memory.set(memory.pointer, 0);
      };
    },
  },
  printValue: {
    params: {},
    stringify(node, options = { indentation: 0 }) {
      const indentationString = ' '.repeat(options.indentation);
      return `${indentationString}print_value`;
    },
    createInstruction() {
      return runner => {
        const { memory, stdout } = runner;
        stdout.write(String.fromCharCode(memory.get(memory.pointer)));
      };
    },
  },
  readValue: {
    params: {},
    stringify(node, options = { indentation: 0 }) {
      const indentationString = ' '.repeat(options.indentation);
      return `${indentationString}read_value`;
    },
    createInstruction() {
      return runner => {
        const { memory, stdin } = runner;
        const value = stdin.read(1)?.charCodeAt(0) ?? 0;
        memory.set(memory.pointer, value);
      };
    },
  },
  loop: {
    params: {
      nodes: null,
    },
    stringify(node, options = { indentation: 0 }) {
      const { nodes } = node;
      const indentationString = ' '.repeat(options.indentation);
      const loopOpen = `${indentationString} loop {`;
      const loopClose = `${indentationString}}`;
      options.indentation += 2;
      const nodesString = nodes.toString(options);
      options.indentation -= 2;
      return [loopOpen, nodesString, loopClose].join('\n');
    },
    createInstruction(node) {
      const { nodes } = node;
      return runner => {
        const { memory } = runner;
        while (memory.get(memory.pointer) !== 0) nodes.execute(runner);
      };
    },
  },
};

const typeNames = Object.keys(nodeTypes);

class ASTNode {
  constructor(type, params = {}) {
    if (!typeNames.includes(type)) {
      throw new Error(`Invalid node type: ${type}`);
    } else {
      this.type = type;
      const { params: paramsWithDefaults } = nodeTypes[type];

      Object.entries(paramsWithDefaults).forEach(([key, defaultValue]) => {
        this[key] = params[key] || defaultValue;
      });

      this.instruction = nodeTypes[type].createInstruction(this);
    }
  }

  toString(options = { indentation: 0 }) {
    return nodeTypes[this.type].stringify(this, options);
  }

  static fromJSON(json) {
    const { type, ...params } = json;
    if (type === 'loop') {
      return new ASTNode(type, { nodes: AST.fromJSON(params.nodes) });
    } else {
      return new ASTNode(type, params);
    }
  }
}

export default ASTNode;

import { Readable } from 'stream';
import Memory from './memory.js';

class Runner {
  constructor(ast, stdin = process.stdin, stdout = process.stdout) {
    this.ast = ast;
    this.stdin = typeof stdin === 'string' ? this.#toInStream(stdin) : stdin;
    this.stdout = stdout;
    this.memory = new Memory();
  }

  run() {
    this.ast.execute(this.memory, this.stdin, this.stdout);
  }

  #toInStream(string) {
    const stream = new Readable();
    stream.setEncoding('ascii');
    stream.push(string);
    stream.push(null);
    return stream;
  }
}

export default Runner;

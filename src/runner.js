import { Readable, Writable } from 'stream';
import Memory from './memory.js';

const MAX_INSTRUCTIONS = 10_000;

class Runner {
  #hasTerminated = false;

  constructor(
    ast,
    {
      stdin = process.stdin,
      stdout = process.stdout,
      memory,
      maxInstructionCount = MAX_INSTRUCTIONS,
      debug = false,
    } = {}
  ) {
    this.ast = ast;
    this.stdin = typeof stdin === 'string' ? this.#toInStream(stdin) : stdin;
    this.stdout = debug ? this.#toDebugWriteStream(stdout) : stdout;
    this.memory = new Memory(memory);
    this.maxInstructionCount = maxInstructionCount ?? MAX_INSTRUCTIONS;
    this.debug = debug;
  }

  run() {
    this.instructionCounter = 0;
    this.ast.execute(this);
    this.#hasTerminated = true;
    this.#terminate();
  }

  runInstruction(instruction) {
    if (this.hasExceededInstructionCount) {
      this.#terminate('Instruction count exceeded');
    } else if (this.hasTerminated) {
      this.#terminate('Terminated unexpectedly');
    }

    instruction(this);
    this.instructionCounter++;
  }

  get hasTerminated() {
    return this.#hasTerminated;
  }

  get hasExceededInstructionCount() {
    return this.instructionCounter > this.maxInstructionCount;
  }

  stop() {
    this.#terminate('Stopped');
  }

  #terminate(error = null) {
    this.#hasTerminated = true;

    const status = error ? 1 : 0;
    const message = error ?? 'Success';

    if (this.debug) {
      const output = this.output;

      process.stdout.write('\n');
      process.stdout.write(`Status: ${message} (Code: ${status})\n`);
      process.stdout.write(`Memory: ${this.memory.toString()}\n`);
      process.stdout.write(`Instruction count: ${this.instructionCounter}\n`);

      if (output)
        process.stdout.write(
          `Output: [${output.split('\n').filter(Boolean).join(', ')}]\n`
        );
    }
    process.exit(status);
  }

  #toInStream(string) {
    const stream = new Readable();
    stream.setEncoding('ascii');
    stream.push(string);
    stream.push(null);
    return stream;
  }

  #toDebugWriteStream(stream) {
    this.output = '';

    return new Writable({
      write: (chunk, encoding, callback) => {
        this.output += chunk.toString();
        callback();
      },
    });
  }
}

export default Runner;

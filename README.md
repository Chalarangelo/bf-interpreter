# BF interpreter

A simple Brainf*ck interpreter written in JavaScript.

## Usage

**Note:** You may need to run `chmod` for the executables.

```sh
chmod +x ./bin/execute
chmod +x ./bin/parse
```

### Parsing

Parsing only supports text input at this time.

```sh
./bin/parse <bf_code>
```

It produces a JSON output (AST) that can be used for execution.

### Execution

The executing script can be run with an AST file as input.

```sh
./bin/execute <ast_file>
```

You can also use parse mode with the `-p` or `--parse` flag:

```sh
./bin/execute -p='<bf_code>'
```

You can also use parse mode with a `.b` file, using the `-b` or `--bf` flag:

```sh
./bin/execute -b='<bf_file>'
```

You may enter debug mode with the `-d` or `--debug` flag:

```sh
./bin/execute -d <ast_file>
```

You may provide input with the `-i` or `--input` flag:

```sh
./bin/execute -i='<input>' <ast_file>
```

You may provide a starting memory configuration with the `-m` or `--memory` flag:

```sh
./bin/execute -m='<memory>' <ast_file>
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

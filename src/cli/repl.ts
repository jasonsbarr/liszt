import vm from "vm";
import os from "os";
import readlineSync from "readline-sync";
import chalk from "chalk";
import { compile } from "./compile";

const READ = () => readlineSync.question("liszt> ");
const EVAL = (input: string) => {
  const code = compile(input);
  return vm.runInThisContext(code);
};
const PRINT = console.log;

export const repl = () => {
  let input = "";

  while (true) {
    input += READ();

    if (input === "") {
      break;
    }

    try {
      PRINT(EVAL(input));
      input = "";
    } catch (e: any) {
      if (
        (e.message as string).includes(
          "Unrecognized token (type: EOFToken, name: EOF)"
        )
      ) {
        input += os.EOL;
        continue;
      } else {
        input = "";
        console.log(chalk.redBright(e.stack));
      }
    }
  }
};

import vm from "vm";
import os from "os";
import readlineSync from "readline-sync";
import chalk from "chalk";
import { compile } from "./compile";

const READ = (prompt: string) => readlineSync.question(prompt);
const EVAL = (input: string) => {
  const code = compile(input);
  return vm.runInThisContext(code);
};
const PRINT = console.log;

export const repl = () => {
  let input = "";
  let prompt = "liszt> ";

  while (true) {
    input += READ(prompt);

    if (input === "") {
      break;
    }

    try {
      let value: any = EVAL(input);

      if (value == null) PRINT(chalk.gray("nil"));
      else PRINT(value);
      input = "";
      prompt = "liszt> ";
    } catch (e: any) {
      if (
        (e.message as string).includes(
          "Unrecognized token (type: EOFToken, name: EOF)"
        ) ||
        (e.message as string).includes("No type annotation for token EOF")
      ) {
        input += os.EOL;
        prompt = ".....  ";
        continue;
      } else {
        input = "";
        prompt = "liszt> ";
        console.log(chalk.redBright(e.stack));
      }
    }
  }
};

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
  let multiline = false;
  let prompt = "liszt> ";

  while (true) {
    try {
      let newInput = READ(prompt);
      let value: any;
      input += newInput;

      if (multiline) {
        if (newInput === "") {
          value = EVAL(input);
        } else {
          input += os.EOL;
          // advance cursor to next line
          console.log();
        }
      } else {
        if (newInput === "") {
          break;
        }

        value = EVAL(input);
      }

      prompt = "liszt> ";

      if (value == null) PRINT(chalk.gray("nil"));
      else PRINT(value);
      input = "";
    } catch (e: any) {
      if (
        (e.message as string).includes(
          "Unrecognized token (type: EOFToken, name: EOF)"
        )
      ) {
        input += os.EOL;
        multiline = true;
        prompt = "....  ";
        continue;
      } else {
        input = "";
        console.log(chalk.redBright(e.stack));
      }
    }
  }
};

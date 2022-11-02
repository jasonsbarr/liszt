import vm from "vm";
import readlineSync from "readline-sync";
import { compile } from "./compile";

const READ = () => readlineSync.question("liszt> ");
const EVAL = (input: string) => vm.runInThisContext(compile(input));
const PRINT = console.log;

while (true) {
  try {
    let input = READ();
    PRINT(EVAL(input));

    if (input === "") {
      break;
    }
  } catch (e: any) {
    console.log(e.message);
  }
}

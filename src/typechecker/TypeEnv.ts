import { Env } from "../utils/Env";
import { Type } from "./Type";

module TypeEnv {
  export class TypeEnv extends Env<Type> {}
  export const globals = new TypeEnv("global");
}

type TypeEnv = TypeEnv.TypeEnv;

export { TypeEnv };

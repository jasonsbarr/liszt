import { Type, IntegerType } from "./Type";

export const isInteger = (t: Type): t is IntegerType => t.name === "Integer";

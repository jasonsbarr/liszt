import { Type, IntegerType } from "./Types";

export const isInteger = (t: Type): t is IntegerType => t.name === "Integer";

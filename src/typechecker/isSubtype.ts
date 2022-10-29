import { Type } from "./Type";

export const isSubtype = (t1: Type, t2: Type) => {
  if (Type.isInteger(t1) && Type.isInteger(t2)) return true;
  else return false;
};

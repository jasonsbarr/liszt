import { Type } from "./Type";

export const isSubtype = (t1: Type, t2: Type) => {
  if (Type.isNumber(t1) && Type.isNumber(t2)) return true;
  else if (Type.isString(t1) && Type.isString(t2)) return true;
  else if (Type.isBoolean(t1) && Type.isBoolean(t2)) return true;
  else if (Type.isNil(t1) && Type.isNil(t2)) return true;
  else return false;
};

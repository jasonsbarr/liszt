import { propType } from "./propType";
import { Type } from "./Type";

export const isSubtype = (t1: Type, t2: Type): boolean => {
  if (Type.isNumber(t1) && Type.isNumber(t2)) return true;
  else if (Type.isString(t1) && Type.isString(t2)) return true;
  else if (Type.isBoolean(t1) && Type.isBoolean(t2)) return true;
  else if (Type.isSymbol(t1) && Type.isSymbol(t2)) return true;
  else if (Type.isNil(t1) && Type.isNil(t2)) return true;
  else if (Type.isUNDEFINED(t1) && Type.isUNDEFINED(t2)) return true;
  else if (Type.isObject(t1) && Type.isObject(t2)) {
    return t2.properties.every(({ name: bName, type: bType }): boolean => {
      const aType = propType(t1, bName);

      if (!aType) return false;
      return isSubtype(aType, bType);
    });
  } else if (Type.isFunction(t1) && Type.isFunction(t2)) {
    return (
      t1.args.length <= t2.args.length &&
      t1.args.every((a, i) => isSubtype(t2.args[i], a)) &&
      isSubtype(t1.ret, t2.ret)
    );
  } else if (Type.isSingleton(t1)) {
    if (Type.isSingleton(t2)) {
      return t1.value === t2.value;
    } else {
      // hack because I can't get TS to let me use classes as values
      // in the Type constructor if I cast this as Type.Singleton,
      // even if I use typeof [TypeName] for my constructor arguments
      return isSubtype((t1 as any).base, t2);
    }
  } else if (Type.isAny(t1)) {
    return true;
  } else {
    return false;
  }
};

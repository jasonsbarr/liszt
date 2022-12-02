import * as Types from "./Types";
import { propType } from "./propType";
import * as Type from "./validators";
import { Type } from "./Type";

export const isSubtype = (a: Types.Type, b: Types.Type): boolean => {
  if (Type.isAny(a) || Type.isAny(b)) return true;
  if (Type.isNever(a)) return true;
  if (Type.isUnknown(b)) return true;

  if (Type.isTypeVariable(a)) {
    return true;
  }

  if (Type.isUnion(a))
    return (a as Types.UnionType).types.every((a) => isSubtype(a, b));
  if (Type.isUnion(b))
    return (b as Types.UnionType).types.some((b) => isSubtype(a, b));

  if (Type.isIntersection(a))
    return (a as Types.IntersectionType).types.some((a) => isSubtype(a, b));

  if (Type.isIntersection(b))
    return (b as Types.IntersectionType).types.every((b) => isSubtype(a, b));

  if (Type.isNil(a) && Type.isNil(b)) return true;
  if (Type.isBoolean(a) && Type.isBoolean(b)) return true;
  if (Type.isNumber(a) && Type.isNumber(b)) return true;
  if (Type.isString(a) && Type.isString(b)) return true;
  // A type should only be undefined on the first pass through the checker
  if (Type.isUNDEFINED(a) || Type.isUNDEFINED(b)) return true;

  if (Type.isObject(a) && Type.isObject(b)) {
    return (b as Types.ObjectType).properties.every(
      ({ name: bName, type: bType }) => {
        const aType = propType(a, bName);
        if (!aType) return false;
        else return isSubtype(aType, bType);
      }
    );
  }

  if (Type.isFunction(a) && Type.isFunction(b)) {
    return (
      (a as Types.FunctionType).args.length ===
        (b as Types.FunctionType).args.length &&
      (a as Types.FunctionType).args.every((a, i) =>
        isSubtype((b as Types.FunctionType).args[i], a)
      ) &&
      isSubtype((a as Types.FunctionType).ret, (b as Types.FunctionType).ret)
    );
  }

  if (Type.isSingleton(a)) {
    if (Type.isSingleton(b))
      return (
        (a as Types.SingletonType).value === (b as Types.SingletonType).value
      );
    else return isSubtype((a as Types.SingletonType).base, b);
  }

  if (Type.isTypeAlias(a)) {
    if (Type.isTypeAlias(b)) {
      return isSubtype(
        (a as Types.TypeAlias).base,
        (b as Types.TypeAlias).base
      );
    }
    return isSubtype((a as Types.TypeAlias).base, b);
  }
  if (Type.isTypeAlias(b)) {
    return isSubtype(a, (b as Types.TypeAlias).base);
  }

  if (Type.isTuple(a) && Type.isTuple(b)) {
    return (
      (a as Types.TupleType).types.length ===
        (b as Types.TupleType).types.length &&
      (a as Types.TupleType).types.every((t, i) =>
        isSubtype(t, (b as Types.TupleType).types[i])
      )
    );
  }

  if (Type.isList(a) && Type.isList(b)) {
    return isSubtype((a as Types.ListType).type, (b as Types.ListType).type);
  }

  return false;
};

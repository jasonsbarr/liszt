import { SrcLoc } from "../syntax/lexer/SrcLoc";
import { Type } from "../typechecker/Type";

// Need this for forward references with call expressions
export const UNDEFINED_FUNCTION = (args: Type[], location: SrcLoc) =>
  Type.functionType(args, Type.undefinedType(location));

export const isUndefinedFunction = (funcType: Type) => {
  if (!Type.isFunction(funcType)) {
    return false;
  }
  return Type.isUNDEFINED(funcType.ret);
};

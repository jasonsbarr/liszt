import { SrcLoc } from "../syntax/lexer/SrcLoc";
import { Type } from "../typechecker/Type";

// Need this for forward references with call expressions
export const UNDEFINED_FUNCTION = (location: SrcLoc) =>
  Type.functionType(
    [Type.undefinedType(location)],
    Type.undefinedType(location)
  );
export const isUndefinedFunction = (funcType: Type.Function) =>
  Type.isUNDEFINED(funcType.ret);

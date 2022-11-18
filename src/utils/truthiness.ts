import { Type } from "../typechecker/Type";

export const isTruthy = (type: Type) => {
  switch (type.name) {
    case "Object":
      return true;
    case "Function":
      return true;
    case "Singleton":
      return (type as Type.Singleton).value !== false;
    case "Number":
      return true;
    case "Integer":
      return true;
    case "Float":
      return true;
    case "String":
      return true;
    case "Symbol":
      return true;
    default:
      return false;
  }
};

export const isFalsy = (type: Type) => {
  switch (type.name) {
    case "Nil":
      return true;
    case "Singleton":
      return (type as Type.Singleton).value === false;
    default:
      return false;
  }
};

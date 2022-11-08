import { Type } from "./Type";

export const propType = (ty: Type.Object, name: string) => {
  const prop = ty.properties.find(({ name: propName }) => propName === name);

  if (prop) return prop.type;
};

import { Type } from "./Type";

const widenNots = (type: Type): Type => {
  switch (type.name) {
    case "Not":
      return Type.unknown();

    case "Union":
      return Type.union(...(type as Type.Union).types.map(widenNots));

    case "Intersection":
      return Type.intersection(
        ...(type as Type.Intersection).types.map(widenNots)
      );

    case "Object":
      return Type.object(
        (type as Type.Object).properties.map(({ name, type }) => ({
          name,
          type: widenNots(type),
        }))
      );

    default:
      return type;
  }
};

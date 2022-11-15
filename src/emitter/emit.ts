import { BoundTree } from "../typechecker/bound/BoundTree";
import { Emitter } from "./Emitter";

export const emit = (tree: BoundTree) => {
  const emitter = Emitter.new(tree);

  return emitter.emit();
};

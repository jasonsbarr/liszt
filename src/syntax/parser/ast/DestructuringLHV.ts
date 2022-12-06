import { Identifier } from "./Identifier";
import { SpreadOperation } from "./SpreadOperation";
import { TuplePattern } from "./TuplePattern";

export type DestructuringLHV = Identifier | SpreadOperation | TuplePattern;

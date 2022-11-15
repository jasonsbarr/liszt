import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundBlock } from "./BoundBlock";
import { BoundNodes } from "./BoundNodes";
import { BoundParameter } from "./BoundParameter";

export class BoundFunctionDeclaration extends BoundASTNode {
  constructor(
    public parameters: BoundParameter[],
    public body: BoundBlock,
    public returnType: Type,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(BoundNodes.BoundFunctionDeclaration, start, end);
  }

  public static new(
    parameters: BoundParameter[],
    body: BoundBlock,
    returnType: Type,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new BoundFunctionDeclaration(
      parameters,
      body,
      returnType,
      start,
      end
    );
  }

  public get children() {
    return [this.parameters, this.body];
  }
}

import { AsExpression } from "../syntax/parser/ast/AsExpression";
import { AssignmentExpression } from "../syntax/parser/ast/AssignmentExpression";
import { ASTNode } from "../syntax/parser/ast/ASTNode";
import { BooleanLiteral } from "../syntax/parser/ast/BooleanLiteral";
import { CallExpression } from "../syntax/parser/ast/CallExpression";
import { FloatLiteral } from "../syntax/parser/ast/FloatLiteral";
import { Identifier } from "../syntax/parser/ast/Identifier";
import { IntegerLiteral } from "../syntax/parser/ast/IntegerLiteral";
import { LambdaExpression } from "../syntax/parser/ast/LambdaExpression";
import { MemberExpression } from "../syntax/parser/ast/MemberExpression";
import { ObjectLiteral } from "../syntax/parser/ast/ObjectLiteral";
import { ObjectProperty } from "../syntax/parser/ast/ObjectProperty";
import { ParenthesizedExpression } from "../syntax/parser/ast/ParenthesizedExpression";
import { StringLiteral } from "../syntax/parser/ast/StringLiteral";
import { SyntaxNodes } from "../syntax/parser/ast/SyntaxNodes";
import { VariableDeclaration } from "../syntax/parser/ast/VariableDeclaration";
import { isSubtype } from "./isSubtype";
import { propType } from "./propType";
import { synth } from "./synth";
import { BoundAssignmentExpression } from "./bound/BoundAssignmentExpression";
import { BoundASTNode } from "./bound/BoundASTNode";
import { BoundBooleanLiteral } from "./bound/BoundBooleanLiteral";
import { BoundCallExpression } from "./bound/BoundCallExpression";
import { BoundFloatLiteral } from "./bound/BoundFloatLiteral";
import { BoundIdentifier } from "./bound/BoundIdentifier";
import { BoundIntegerLiteral } from "./bound/BoundIntegerLiteral";
import { BoundLambdaExpression } from "./bound/BoundLambdaExpression";
import { BoundMemberExpression } from "./bound/BoundMemberExpression";
import { BoundObjectLiteral } from "./bound/BoundObjectLiteral";
import { BoundObjectProperty } from "./bound/BoundObjectProperty";
import { BoundParenthesizedExpression } from "./bound/BoundParenthesizedExpression";
import { BoundStringLiteral } from "./bound/BoundStringLiteral";
import { BoundVariableDeclaration } from "./bound/BoundVariableDeclaration";
import { Type } from "./Type";
import { TypeEnv } from "./TypeEnv";
import { ObjectType } from "./Types";
import { FunctionDeclaration } from "../syntax/parser/ast/FunctionDeclaration";
import { BoundFunctionDeclaration } from "./bound/BoundFunctionDeclaration";
import { BoundParameter } from "./bound/BoundParameter";
import { BoundBlock } from "./bound/BoundBlock";
import { Block } from "../syntax/parser/ast/Block";
import { BoundReturnStatement } from "./bound/BoundReturnStatement";
import { ReturnStatement } from "../syntax/parser/ast/ReturnStatement";
import { BoundBinaryOperation } from "./bound/BoundBinaryOperation";
import { BinaryOperation } from "../syntax/parser/ast/BinaryOperation";
import { LogicalOperation } from "../syntax/parser/ast/LogicalOperation";
import { BoundLogicalOperation } from "./bound/BoundLogicalOperation";
import { UnaryOperation } from "../syntax/parser/ast/UnaryOperation";
import { BoundUnaryOperation } from "./bound/BoundUnaryOperation";
import { BoundSymbolLiteral } from "./bound/BoundSymbolLiteral";
import { SymbolLiteral } from "../syntax/parser/ast/SymbolLiteral";
import { IfExpression } from "../syntax/parser/ast/IfExpression";
import { BoundIfExpression } from "./bound/BoundIfExpression";
import { BoundNilLiteral } from "./bound/BoundNilLiteral";
import { NilLiteral } from "../syntax/parser/ast/NilLiteral";
import { getType } from "./getType";
import { Parameter } from "../syntax/parser/ast/Parameter";
import { getAliasBase } from "./getAliasBase";
import { Tuple } from "../syntax/parser/ast/Tuple";
import { BoundTuple } from "./bound/BoundTuple";

export const bind = (node: ASTNode, env: TypeEnv, ty?: Type): BoundASTNode => {
  let key, value, synthType;
  switch (node.kind) {
    default:
      throw new Error(`Cannot bind node of kind ${node.kind}`);

    case SyntaxNodes.Tuple:
      if (node instanceof Tuple) {
        if (!ty) {
          ty = synth(node, env) as Type.Tuple;
        }

        if (Type.isTypeAlias(ty)) {
          ty = getAliasBase(ty);
        }

        const values = node.values.map((v, i) =>
          bind(v, env, (ty as Type.Tuple).types[i])
        );

        return BoundTuple.new(values, ty as Type.Tuple, node.start, node.end);
      }

      throw new Error("WTF?");
  }
};

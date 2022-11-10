import { Type } from "./Type";
import { SyntaxNodes } from "../syntax/parser/ast/SyntaxNodes";
import { ASTNode } from "../syntax/parser/ast/ASTNode";
import { ObjectLiteral } from "../syntax/parser/ast/ObjectLiteral";
import { Property } from "./Types";
import { MemberExpression } from "../syntax/parser/ast/MemberExpression";
import { propType } from "./propType";
import { Identifier } from "../syntax/parser/ast/Identifier";
import { AsExpression } from "../syntax/parser/ast/AsExpression";
import { fromAnnotation } from "./fromAnnotation";
import { check } from "./check";
import { LambdaExpression } from "../syntax/parser/ast/LambdaExpression";
import { TypeEnv } from "./TypeEnv";

export const synth = (ast: ASTNode, env: TypeEnv) => {
  switch (ast.kind) {
    case SyntaxNodes.IntegerLiteral:
      return synthInteger();
    case SyntaxNodes.FloatLiteral:
      return synthFloat();
    case SyntaxNodes.StringLiteral:
      return synthString();
    case SyntaxNodes.BooleanLiteral:
      return synthBoolean();
    case SyntaxNodes.NilLiteral:
      return synthNil();
    case SyntaxNodes.ObjectLiteral:
      return synthObject(ast as ObjectLiteral, env);
    case SyntaxNodes.MemberExpression:
      return synthMember(ast as MemberExpression, env);
    case SyntaxNodes.AsExpression:
      return synthAs(ast as AsExpression, env);
    case SyntaxNodes.Identifier:
      return synthIdentifier(ast as Identifier, env);
    case SyntaxNodes.LambdaExpression:
      return synthLambda(ast as LambdaExpression, env);
    default:
      throw new Error(`Unknown type for expression type ${ast.kind}`);
  }
};

const synthInteger = () => Type.integer;
const synthFloat = () => Type.float;
const synthString = () => Type.string;
const synthBoolean = () => Type.boolean;
const synthNil = () => Type.nil;

const synthObject = (obj: ObjectLiteral, env: TypeEnv) => {
  const props: Property[] = obj.properties.map((prop) => ({
    name: prop.key.name,
    type: synth(prop.value, env),
  }));
  return Type.object(props);
};

const synthMember = (ast: MemberExpression, env: TypeEnv) => {
  const prop = ast.property;

  if (!(prop instanceof Identifier)) {
    throw new Error(
      `Only valid identifiers may be object property names; ${
        (prop as ASTNode).kind
      } given`
    );
  }

  const object = synth(ast.object, env);

  if (!Type.isObject(object)) {
    throw new Error(`MemberExpression expects an object; ${object} given`);
  }

  const type = propType(object, prop.name);

  if (!type) {
    throw new Error(`No such property ${prop.name} on object`);
  }

  return type;
};

const synthAs = (node: AsExpression, _env: TypeEnv) => {
  const type = fromAnnotation(node.type.type);
  check(node.expression, type);
  return type;
};

const synthIdentifier = (node: Identifier, env: TypeEnv) => {};

const synthLambda = (node: LambdaExpression, env: TypeEnv) => {};

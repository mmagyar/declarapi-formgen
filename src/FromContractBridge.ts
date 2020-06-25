import { ObjectType, Validation, ValueType,
  isArray, isEnum, isObj, isMap, isString, isNumber } from "yaschva";
import { str, select, multiSelect, percentageRange } from "./FieldHelpers";
import { Field } from "./FormTypes";


const containsOptional = (input: Validation) =>
  Array.isArray(input) && input.some(y => y === "?") ||
   input === "?";

const allOptional = (input: Validation) =>
  Object.values(input).every(containsOptional);
// eslint-disable-next-line complexity
const contractToTsType = (input: ValueType | ValueType[],

  key: string, optional?: boolean, outerName?: string): {key: string; field: Field}[] => {
  const name = outerName || key;
  if (Array.isArray(input)) {
    const opt = input.some(x => x === "?");
    if (input.length <= 2)
      return contractToTsType(input.find(x => x !== "?") || [], key, opt);

    //Fall back to text field when multiple types are specified
    const fallbackName: string = input.map((x: any) => x && x.name).find(x => x) || name;
    return [{ key, field: str(fallbackName, { constraintType: "text", isOptional: opt }) }];

  }

  if (typeof input === "string")
    switch (input) {
    case "string":
      return [
        { key, field:
        { name, constraint: { constraintType: "text", isOptional: optional } } }
      ];
    case "number":
      return [
        { key, field:
        { name, constraint: { constraintType: "number", isOptional: optional } } }
      ];
    case "integer":
      return [
        { key, field:
        { name, constraint: { constraintType: "number", isOptional: optional, stepSize: 1 } } }
      ];
    case "boolean":
      return [
        { key, field:
        { name, constraint: { constraintType: "checkbox", isOptional: optional } } }
      ];

    case "?":
      return [];
    default: throw new Error("Unhandled");
    }

  // if (isArray(input))
  // return `${contractToTsType(input.$array)}[]`;

  if (isEnum(input))
    return [
      { key, field: { name: input.name || name,
        constraint: { constraintType: "select",
          constraint: input.$enum.map(x => ({ key: x, name: x })) } } }
    ];

  // if (isObj(input)) {
  //   const optionalPostfix = (value: Validation) => containsOptional(value) ? "?" : "";

  //   const obj = Object.entries(input)
  //     .map(([key, value]) => `${key}${optionalPostfix(value)} : ${contractToTsType(value)}`)
  //     .join(";");
  //   if (allOptional(input))
  //     return `{${obj}} | undefined | null`;

  //   return `{${obj}}`;
  // }

  if (isString(input))
  //This may have a select declared
    return [
      { key, field:
      { name: input.name || name,
        description: input.description,
        constraint: { constraintType: "text", isOptional: optional, regex: input.$string.regex } } }
    ];


  // if (isMap(input))
  // return contractToTsType(input.$object);

  if (isNumber(input))
    return [
      { key, field:
    { name: input.name || name,
      description: input.description,
      postfix: input.postfix, constraint:
      { constraintType: "number", isOptional: optional,
        stepSize: input.$number.step, max: input.$number.max, min: input.$number.min } } }
    ];

  throw new Error(`UNSUPPORTED ${JSON.stringify(input, undefined, 2)}`);
};

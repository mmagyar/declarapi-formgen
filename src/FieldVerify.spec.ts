import { verifyDataForFieldType } from "./FieldVerify";
import { Field, ConstraintTypes } from "./FormTypes";

const fielder = (key: string, constraint: ConstraintTypes, value? : any): Field =>
  ({ name: key.toUpperCase(), constraint, value });
describe("verifyDataForFieldType", () => {

  describe("string validation", () => {
    it("returns error when non optional field's value is undefined", () => {
      expect(verifyDataForFieldType("testField", fielder("testField", { constraintType: "text" })))
        .toStrictEqual({ key: "testField", name: "TESTFIELD", type: "missing" });
    });

    it("returns error when non optional string field's value is empty string", () => {
      expect(verifyDataForFieldType("testField",
        fielder("testField", { constraintType: "text" }, "")))
        .toStrictEqual({ key: "testField", name: "TESTFIELD", type: "missing" });
    });

    it("returns error when  string field's value is not a string", () => {
      expect(verifyDataForFieldType("testField",
        fielder("testField", { constraintType: "text" }, {})))
        .toStrictEqual({ key: "testField", name: "TESTFIELD",
          message: "Must be a string.", type: "wrongFormat" });
    });

    it("returns true, no error when optional string field's value is empty string", () => {
      expect(verifyDataForFieldType(
        "testField", fielder("testField", { constraintType: "text", isOptional: true }, "")))
        .toStrictEqual(true);
    });

    it("returns true, no error when field's value is a non empty string", () => {
      expect(verifyDataForFieldType(
        "testField", fielder("testField", { constraintType: "text" }, "hello")))
        .toStrictEqual(true);
    });

    it("returns error when string does not confirm to set regex value", () => {
      expect(verifyDataForFieldType(
        "testField", fielder("testField", { constraintType: "text", regex: "abc" }, "hello")))
        .toStrictEqual({ key: "testField", message: "Does not confirm to regex: abc",
          name: "TESTFIELD", type: "wrongFormat" });

      expect(verifyDataForFieldType(
        "testField", fielder("testField",
          { constraintType: "text", regex: "abc", regexErrorMessage: "oh no" }, "hello")))
        .toStrictEqual({ key: "testField", message: "oh no",
          name: "TESTFIELD", type: "wrongFormat" });
    });

    it("returns true, no error when value matches regex", () => {
      expect(verifyDataForFieldType(
        "testField", fielder("testField", { constraintType: "text", regex: "abc.$" }, "abcd")))
        .toStrictEqual(true);

    });
  });

  describe("checkbox validation", () => {
    it("returns true, no error when the input value's type is boolean", () => {
      expect(verifyDataForFieldType("testField",
        fielder("testField", { constraintType: "checkbox" }, true)))
        .toStrictEqual(true);
    });

    it("returns error when the input value's type is not boolean", () => {
      expect(verifyDataForFieldType("testField", fielder("testField",
        { constraintType: "checkbox" }, {})))
        .toStrictEqual({ key: "testField", name: "TESTFIELD",
          message: "Must be a boolean.", type: "wrongFormat" });
    });
    it("returns error when the input is not true, but mustBeTrue constraint is checked", () => {
      expect(verifyDataForFieldType(
        "testField", fielder("testField", { constraintType: "checkbox", mustBeTrue: true }, false)))
        .toStrictEqual({ key: "testField", name: "TESTFIELD",
          message: "Must be checked.", type: "wrongFormat" });
    });
  });

  describe("number validation", () => {
    it("returns true for correct values", () => {
      const values = [-1, 0, +1, 1.1];
      values.forEach(x => expect(verifyDataForFieldType(
        "testField", fielder("testField", { constraintType: "number" }, x))).toStrictEqual(true));

      const empties = [undefined, null, "", ...values];
      empties.forEach(x =>
        expect(verifyDataForFieldType(
          "testField", fielder("testField", { constraintType: "number", isOptional: true }, x)))
          .toStrictEqual(true));

      expect(verifyDataForFieldType(
        "testField", fielder("testField", { constraintType: "number", min: 2, max: 4 }, 3)))
        .toStrictEqual(true);
    });

    it("returns error object for incorrect values", () => {
      type partialType = {isOptional?: boolean;min?: number; max?: number; stepSize?: number}
      const test = (c: partialType, x: any) => expect(verifyDataForFieldType("testField",
        fielder("testField", { constraintType: "number", ...c }, x))).toHaveProperty("type");

      const empties = [undefined, null, ""];
      empties.forEach(x => test({ isOptional: false }, x));

      test({ stepSize: 1 }, 1.1);
      test({ stepSize: 1 }, "1.1");
      test({ max: 2 }, 3);
      test({ min: 4 }, 3);
    });
  });
});

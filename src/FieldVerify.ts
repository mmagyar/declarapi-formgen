import {
  Field, ConstraintString, SelectField, MultiSelectField, NumberField, CheckboxField
} from "./FormTypes";
export type FieldErrorMissingValue = {
  type: "missing";
  key: string;
  name: string;
}
export type FieldErrorWrongFormat = {
  type: "wrongFormat";
  key: string;
  name: string;
  message: string;

}
export type FieldError = FieldErrorMissingValue | FieldErrorWrongFormat

export const errorMessage = (error: FieldError): string =>
  error.type === "wrongFormat" ? error.message : "Value is required";

export const checkIsOptionalError = (key: string, field: Field): FieldError | true | false => {

  if (!field.constraint.isOptional && (field.value === undefined || field.value === null))
    return { key, name: field.name, type: "missing" };
  else if (field.constraint.isOptional && (field.value === undefined || field.value === null))
    return true;

  return false;
};

const errorWF = (key: string, name: string, message: string): FieldErrorWrongFormat =>
  ({ type: "wrongFormat", key, name, message });


const validateFile = (key: string, field: Field): FieldError| true => {
  if (typeof field.value !== "string")
    return { key, name: field.name,
      message: "Must be a string in BASE64 encoding.", type: "wrongFormat" };

  if (field.value === "" && !field.constraint.isOptional)
    return { key, name: field.name, type: "missing" };

  return true;
};

const validateMultiSelect = (key: string, field: Field): FieldError| true => {
  if (!Array.isArray(field.value) || !field.value.every(x => typeof x === "string"))
    return { key, name: field.name,
      message: "Must be an array of string.", type: "wrongFormat" };

  // Make sure that the selected options actually exit
  if (!field.value.every(x => Boolean((field as MultiSelectField)
    .constraint.constraint.find(y => y.key === x) || false)))
    return { type: "wrongFormat", key, name: field.name,
      message: "Value is not on the list of accepted inputs." };


  if (!field.constraint.isOptional && field.value.length === 0)
    return { type: "wrongFormat", key, name: field.name,
      message: "Is required, at least one option needs to be selected." };

  return true;

};

const validateNumber = (key: string, field: Field): FieldError| true => {
  const error = (message: string): FieldErrorWrongFormat => errorWF(key, field.name, message);

  const isEmpty = field.value === "" || field.value === undefined || field.value === null;
  if (isEmpty && !field.constraint.isOptional)
    return { key, name: field.name, type: "missing" };
  else if (isEmpty)
    return true; // Exit with the validation if it's empty and not needed, nothing to validate


  if (typeof field.value !== "number")
    return error("Must be a number.");

  const numFld = field as NumberField;
  if (numFld.constraint.max !== undefined && field.value > numFld.constraint.max)
    return error(`Must be smaller than ${numFld.constraint.max}.`);


  if (numFld.constraint.min !== undefined && field.value < numFld.constraint.min)
    return error(`Must be bigger than ${numFld.constraint.min}.`);

  if (
    numFld.constraint.stepSize &&
      Number.isSafeInteger(numFld.constraint.stepSize) &&
      !Number.isSafeInteger(field.value)
  )
    return error("Needs to be an integer, whole number.");

  return true;
};
const validateSelect = (key: string, field: Field): FieldError| true => {
  const error = (message: string): FieldErrorWrongFormat => errorWF(key, field.name, message);

  if (typeof field.value !== "string")
    return error("Select key must be a string.");


  if (field.value === "" && !field.constraint.isOptional)
    return { key, name: field.name, type: "missing" };


  if (!((field as SelectField).constraint.constraint.find(y => y.key === field.value) || false))
    return error("Value is not on the list of accepted inputs.");


  return true;
};

const validateText = (key: string, field: Field): FieldError| true => {
  const error = (message: string): FieldErrorWrongFormat => errorWF(key, field.name, message);

  if (typeof field.value !== "string")
    return error("Must be a string.");

  if (field.value === "" && !field.constraint.isOptional)
    return { key, name: field.name, type: "missing" };


  const strConstraint = field.constraint as ConstraintString;
  if (strConstraint.regex) {
    const regex = RegExp(strConstraint.regex, "u");
    if (!regex.test(field.value)) {
      const expErrorMsg = strConstraint.regexErrorMessage
        ? strConstraint.regexErrorMessage
        : `Does not confirm to regex: ${strConstraint.regex}`;

      return error(expErrorMsg);
    }
  }
  return true;
};

const validateCheckbox = (key: string, field: Field): FieldError| true => {
  const error = (message: string): FieldErrorWrongFormat => errorWF(key, field.name, message);

  if (typeof field.value !== "boolean")
    return error("Must be a boolean.");


  if (field.value === false && (field as CheckboxField).constraint.mustBeTrue)
    return error("Must be checked.");

  return true;
};

// eslint-disable-next-line complexity
export const verifyDataForFieldType = (key: string, field: Field): FieldError | true => {

  const reqMet = checkIsOptionalError(key, field);
  if (reqMet !== false) return reqMet;


  switch (field.constraint.constraintType) {
  case "file": return validateFile(key, field);
  case "multiSelect": return validateMultiSelect(key, field);
  case "number": return validateNumber(key, field);
  case "select": return validateSelect(key, field);
  case "text": return validateText(key, field);
  case "checkbox": return validateCheckbox(key, field);
  default:
    throw new Error("This should not happen");
  }

};

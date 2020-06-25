import { verifyDataForFieldType, FieldError } from "./FieldVerify";
import { Field, StringField } from "./FormTypes";
import { deepCopy } from "microtil";

export interface FormFields {
  [s: string]: Field;
}

export interface Form {
  readonly formName: string;
  readonly formKey: string;
  readonly fields: FormFields;
}


export type IdForm = Form & {
  readonly fields: { id: StringField; [s: string]: Field};
}

export interface FormList<T extends IdForm> {
  prototype: T;
  instances: T[];
}


export const dataToForm = (formProto: Form, data: {[s: string]: any}) => {
  const form = deepCopy(formProto);
  const formKeys = Object.keys(form.fields);
  formKeys.forEach(x => {
    if (data[x] === undefined && !form.fields[x].constraint.isOptional) {
      //Error, needed field is not in data
    }
  });
  for (const [key, value] of Object.entries(data)) {
    if (form.fields[key] !== undefined) {
      //Error data contains fields that are not in the form
    }
    form.fields[key].value = value;
  }
  //Validate form?
  return form;

};
export const formToData = (form: Form) => {
  const result: {[s: string]: any} = {};
  for (const [key, value] of Object.entries(form.fields))
    result[key] = value.value;

  return result;
};
export const checkFormValueValidity = (form: Form): FieldError[] => {
  const keys = Object.keys(form.fields);
  const errors: FieldError[] = [];
  keys.forEach(value => {
    const result = verifyDataForFieldType(value, form.fields[value]);
    if (result !== true) errors.push(result);
  });
  return errors;
};

// export const readData = (data: Map<string, string | string[] | number>) => {
//   // @todo create simplified form submit with key value pairs to reduce bandwidth usage
//   throw new Error("not implemented");
// };

export const isTheSameForm = (formA: Form, formB: Form): Error[] => {
  const thisKeys = Object.keys(formA.fields);
  const thatKeys = Object.keys(formB.fields);
  const result = [];

  if (formB.formKey !== formA.formKey)
    result.push(new Error(
      `Submitted form has a different key, required: ${formA.formKey}, submitted: ${formB.formKey}`
    ));


  if (thisKeys.length !== thatKeys.length)
    result.push(new Error("Submitted form has a different number of fields"));


  if (!thisKeys.every(value => formA.fields[value].constraint.constraintType ===
    formB.fields[value].constraint.constraintType))
    result.push(new Error("Submitted forms fields have different types"));

  // @note in the future we may want to check constraints as well,
  // it's not needed now since we override those with server side values,
  // so we would know when someone wants to circumvent validation, and flag it as a malicious user

  return result;
};

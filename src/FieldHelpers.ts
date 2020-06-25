/* eslint-disable max-lines */
import { IDate, Time } from "microtil";
import {
  Field, ConstraintString, ConstraintCheckBox, ConstraintTime, ConstraintDateTime,
  ConstraintDate, ConstraintNumber, ConstraintSelect, ConstraintFile, FieldTypes,
  ConstraintTypes, SelectField, StringField, SelectOption, MultiSelectField, FileField,
  NumberField, CheckboxField, NumericRangeField, MultiTextField, ListField, ConstraintList
} from "./FormTypes";

export const checkboxConstraint = (isOptional = false): ConstraintCheckBox =>
  ({ constraintType: "checkbox", isOptional, mustBeTrue: false });

export const hide = <T extends Field>(input: T): T => {
  input.hidden = true;
  return input;
};

export const timeConstraint = (
  excluding: { min: Time; max: Time }[] = [],
  isOptional = false
): ConstraintTime => ({
  constraintType: "time",
  isOptional,
  excluding
});

export const dateTimeConstraint = (
  excluding: { min: IDate; max: IDate }[] = [],
  isOptional = false,
  excludingTimeEveryDay: { min: Time; max: Time }[] = [],
  excludingHours: { minDate: IDate; maxDate: IDate; min: Time; max: Time }[] = []
): ConstraintDateTime => ({
  constraintType: "dateTime",
  isOptional,
  excluding,
  excludingTimeEveryDay,
  excludingHours
});

export const dateConstraint = (
  excluding: { min: IDate; max: IDate }[] = [],
  isOptional = false
): ConstraintDate => ({
  constraintType: "date",
  isOptional,
  excluding
});

export const stringConstraint = (
  size: "small" | "medium" | "large" = "small",
  isOptional = false,
  sensitive = false
): ConstraintString => ({ constraintType: "text", isOptional, size, sensitive });

export const numberConstraint = (isOptional = false): ConstraintNumber =>
  ({ constraintType: "number", isOptional });

export const selectConstraint =
(options: SelectOption[], isOptional = false, multi = false): ConstraintSelect =>
  ({ isOptional, constraint: options, constraintType: multi ? "multiSelect" : "select" });

export const fileConstraint = (isOptional = false): ConstraintFile =>
  ({ isOptional, constraintType: "file", maxSizeMegaBytes: 25, fileType: "picture" });

export const id = (
  value?: string
): StringField => ({
  name: "Id",
  value: value ? value : "",
  constraint: stringConstraint(),
  description: "Identifier for the record",
  hidden: true
});

export const str = (
  name: string,
  constraint?: ConstraintString,
  value?: string
): StringField => ({
  name,
  value: value ? value : "",
  constraint: constraint ? constraint : stringConstraint(),
  description: ""
});

export const email = (
  name: string,
  value?: string,
  isOptional = false
): StringField => ({
  name,
  value: value ? value : "",
  constraint: {
    constraintType: "text",
    isOptional,
    size: "small",
    regexErrorMessage: "must be an email address",
    // regex:             `/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/`,
    regex: "\\S+@\\S+"
  },
  description: ""
});

export const checkbox = (
  name: string,
  constraint?: ConstraintCheckBox,
  value = false
): CheckboxField => ({
  name,
  value,
  constraint: constraint
    ? constraint
    : { constraintType: "checkbox", isOptional: true, mustBeTrue: false },
  description: ""
});

export const txt = (
  name: string,
  constraint?: ConstraintString,
  value?: string
): StringField => ({
  name,
  value: value ? value : "",
  constraint: constraint ? constraint : stringConstraint("large"),
  description: ""
});

export const pwd = (
  name: string,
  constraint?: ConstraintString,
  value?: string,
  hidden?: boolean
): StringField => ({
  name,
  value: value ? value : "",
  constraint: constraint ? constraint : stringConstraint("small", true, true),
  description: "",
  hidden
});

export const num = (
  name: string,
  constraint?: ConstraintNumber,
  value?: number
): NumberField => ({
  name,
  value,
  constraint: constraint ? constraint : numberConstraint(),
  description: ""
});

export const select =
(fieldName: string, options: [string, string][], value?: string): SelectField => ({
  name: fieldName,
  value,
  constraint: selectConstraint(options.map(([key, name]) => ({ key, name }))),
  description: ""
});

export const multiSelect = (
  fieldName: string,
  options: [string, string][],
  value?: string[]
): MultiSelectField => ({
  name: fieldName,
  value: value ? value : [],
  constraint: selectConstraint(options.map(([key, name]) => ({ key, name })), true, true),
  description: ""
});

export const multiText = (
  fieldName: string,
  options: [string, string][],
  textField?: ConstraintString,
  value?: {selectValue: string; content: {[s: string]: string}}): MultiTextField => ({
  name: fieldName,
  value,
  constraint: { constraintType: "multiText",
    options: options.map(([key, name]) => ({ key, name })),
    text: textField ?? stringConstraint("medium") },
  description: ""
});

export const list = (
  name: string,
  constraint?: ConstraintList,
  value?: string[]
): ListField => ({
  name,
  value: value ? value : [],
  constraint: constraint ? constraint
    : { constraintType: "list", text: stringConstraint() },
  description: ""
});


export const listOptional = (
  name: string,
  isOptional?: boolean,
  value?: string[]
): ListField => ({
  name,
  value: value ? value : [],
  constraint: { constraintType: "list", isOptional, text: stringConstraint() },
  description: ""
});

export const file = (
  name: string,
  constraint?: ConstraintFile,
  multiple = false
): FileField => ({
  name,
  multiple,
  value: undefined,
  constraint: constraint ? constraint : fileConstraint(),
  description: ""
});

export const defaultConstraintForField = (
  field: FieldTypes,
  required = true,
  options: SelectOption[] = []
): ConstraintTypes => {
  switch (field) {
  case "checkbox":
    return checkboxConstraint(required);
  case "time":
  case "date":
    return dateConstraint(undefined, required);
  case "dateTime":
    return dateTimeConstraint(undefined, required);
  case "file":
    return fileConstraint(required);
  case "multiSelect":
    return selectConstraint(options, required);
  case "number":
    return numberConstraint(required);
  case "password":
    return stringConstraint(undefined, required);
  case "select":
    return selectConstraint(options, required);
  case "text":
    return stringConstraint(undefined, required);
  default: throw new Error("invalid");
  }
};


export const numericRange =
  (name: string, isOptional = false, step = 1, postfix?: string,
    value?: {min: number; max: number}):
  NumericRangeField =>
    ({ constraint: { constraintType: "numericRange", min: 0, max: 100, stepSize: step, isOptional },
      name, value, postfix });


export const percentageRange =
  (name: string, isOptional = false, step = 0.1, value?: {min: number; max: number}):
  NumericRangeField =>
    ({ constraint: { constraintType: "numericRange", min: 0, max: 100, stepSize: step, isOptional },
      name, value, postfix: "%" });

import { IDate, DateTime, Time } from "microtil";

export type NumericRange = {min: number; max: number}
export type MultiText ={selectValue?: string; content: {[s: string ]: string}}
export type FieldTypes =
| "text"
| "password"
| "number"
| "numericRange"
| "select"
| "multiSelect"
| "file"
| "checkbox"
| "date"
| "time"
| "dateTime"
| "multiText"
| "list";

export type EveryType =
string | string[] | number | boolean | IDate | Time | DateTime | NumericRange | MultiText;


export interface Constraint {
  constraintType: FieldTypes;
  isOptional?: boolean;
}

export interface ConstraintCheckBox extends Constraint {
  constraintType: "checkbox";
  mustBeTrue?: boolean;
}

export interface ConstraintNumber extends Constraint {
  min?: number;
  max?: number;
  stepSize?: number;
  constraintType: "number";
}

export interface ConstraintNumericRange extends Constraint {
  min?: number;
  max?: number;
  stepSize?: number;
  constraintType: "numericRange";
}

export interface ConstraintString extends Constraint {
  size?: "small" | "medium" | "large";
  constraintType: "text";
  sensitive?: boolean;
  regex?: string;
  regexErrorMessage?: string;
}
//NEXT refactor this to an object
export interface SelectOption {
  key: string;
  name: string;
}

export interface ConstraintSelect extends Constraint {
  constraint: SelectOption[];
  constraintType: "select" | "multiSelect";
}
export interface ConstraintMultiText extends Constraint{
  constraintType: "multiText";
  options: SelectOption[];
  text: ConstraintString;
}

export interface ConstraintList extends Constraint{
  constraintType: "list";
    minEntries?: number;
    maxEntries?: number;
    text: ConstraintString;

}

export interface ConstraintFile extends Constraint {
  fileType: "picture" | "video" | "media" | "audio" | "any";
  maxSizeMegaBytes?: number;
  constraintType: "file";
}

export interface ConstraintTime extends Constraint {
  min?: Time;
  max?: Time;
  excluding?: { min: Time; max: Time }[];
  constraintType: "time";
}

export interface ConstraintDate extends Constraint {
  min?: IDate;
  max?: IDate;
  excluding?: { min: IDate; max: IDate }[];
  constraintType: "date";
}

export interface ConstraintDateTime extends Constraint {
  min?: IDate;
  max?: IDate;
  // Example: Opening time for the place
  minTimeEveryDay?: Time;
  // Example: Closing time for the place
  maxTimeEveryDay?: Time;
  // Example: special holiday, closed day
  excluding?: { min: IDate; max: IDate }[];
  // Example lunch hour/ resting time
  excludingTimeEveryDay?: { min: Time; max: Time }[];
  excludingHours?: { minDate: IDate; maxDate: IDate; min: Time; max: Time }[];
  constraintType: "dateTime";
}

export type ConstraintTypes =
  | ConstraintDateTime
  | ConstraintFile
  | ConstraintSelect
  | ConstraintNumber
  | ConstraintString
  | ConstraintDate
  | ConstraintTime
  | ConstraintCheckBox
  | ConstraintNumericRange
  | ConstraintMultiText
  | ConstraintList;

export interface Field {
  // Key of the field, that is used to identify it
  // The name of the field that is visible to the user
  name: string;
  // The value of the field
  value?: EveryType;
  // The constraint of the field, used for validation and  Type of the field
  constraint: ConstraintTypes;
  postfix?: string;
  // Description of the field, displayed to the user
  description?: string;
  // Should the field be rendered or not
  hidden?: boolean;
  // If the field is based on a foreign key, this can be set,
  //so the user can add a new entry to that table
  formLink?: string;
}

export interface StringField extends Field {value?: string;constraint: ConstraintString}
export interface CheckboxField extends Field { value: boolean; constraint: ConstraintCheckBox}
export interface NumberField extends Field { value?: number;constraint: ConstraintNumber}
export interface NumericRangeField extends Field
  { value?: NumericRange; constraint: ConstraintNumericRange}
export interface SelectField extends Field {value?: string;constraint: ConstraintSelect}
export interface MultiSelectField extends Field {value: string[];constraint: ConstraintSelect}
export interface DateField extends Field {value?: IDate;constraint: ConstraintDate}
export interface TimeField extends Field { value?: Time;constraint: ConstraintTime}
export interface DateTimeField extends Field { value?: DateTime;constraint: ConstraintDateTime}
export interface MultiTextField extends Field {value? : MultiText; constraint: ConstraintMultiText}
export interface ListField extends Field {value? : string[]; constraint: ConstraintList}
export interface FileField extends Field
  {value?: string; multiple: boolean; constraint: ConstraintFile}

export const isStringField = (field: Field): field is StringField =>
  field.constraint.constraintType === "text";
export const isCheckboxField = (field: Field): field is CheckboxField =>
  field.constraint.constraintType === "checkbox";
export const isNumberField = (field: Field): field is NumberField =>
  field.constraint.constraintType === "number";
export const isNumericRangeField = (field: Field): field is NumericRangeField =>
  field.constraint.constraintType === "numericRange";
export const isSelectField = (field: Field): field is SelectField =>
  field.constraint.constraintType === "select";
export const isMultiSelectField = (field: Field): field is MultiSelectField =>
  field.constraint.constraintType === "multiSelect";
export const isDateField = (field: Field): field is DateField =>
  field.constraint.constraintType === "date";
export const isTimeField = (field: Field): field is TimeField =>
  field.constraint.constraintType === "time";
export const isDateTimeField = (field: Field): field is DateTimeField =>
  field.constraint.constraintType === "dateTime";
export const isMultiTextField = (field: Field): field is MultiTextField =>
  field.constraint.constraintType === "multiText";
export const isListField = (field: Field): field is ListField =>
  field.constraint.constraintType === "list";
export const isFileField = (field: Field): field is FileField =>
  field.constraint.constraintType === "file";



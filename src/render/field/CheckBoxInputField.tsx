import React from "react";
import { EditBaseType } from "../EditBaseType";
import { CheckboxField } from "../../FormTypes";

type CheckBoxInputType = EditBaseType & {field: CheckboxField}
export const CheckBoxInputField = ({ id, fieldKey: key, field: { name, value }, onChange }:
   CheckBoxInputType) =>
  <React.Fragment key={key} >
    <label htmlFor={id}>{name}</label>
    <input type="checkbox" checked={Boolean(value)} name={key} value={"true"} id={id}
      onChange={e => onChange(Boolean(e.target.value))}
    /></React.Fragment>;

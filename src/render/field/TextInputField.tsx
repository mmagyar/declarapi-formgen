import { EditBaseType } from "../EditBaseType";

import { StringField } from "../../FormTypes";
import { ContentSizedTextArea } from "../../components/ContentSizedTextArea";

import React from "react";

export const TextInputField = ({ id, onChange, fieldKey: key, field: { value, constraint, name } }:
  EditBaseType & {field: StringField}) => {
  if (constraint.sensitive)
    return <React.Fragment key={key} >
      <label htmlFor={id}>{name}</label>
      <input type="password" name={key} id={id} required={!constraint.isOptional}
        value={value ?? ""} onChange={e => onChange(e.target.value)}/></React.Fragment>;

  if (constraint.size === "small" || !constraint.size)
    return <React.Fragment key={key} >
      <label htmlFor={id}>{name}</label>
      <input type="text" name={key} id={id} required={!constraint.isOptional}
        value={value ?? ""} onChange={e => onChange(e.target.value)}/></React.Fragment>;

  return <React.Fragment key={key} >
    <label htmlFor={id}>{name}</label>
    <ContentSizedTextArea name={key} value={value ?? ""} id={id} onChange={onChange}
      required={!constraint.isOptional}/></React.Fragment>;
};

import { EditBaseType } from "../EditBaseType";
import { SelectField, MultiSelectField } from "../../FormTypes";
import React from "react";

export const SelectInputField = ({ id, onChange, fieldKey, field: { name, value, constraint } }:
  EditBaseType & {field: SelectField | MultiSelectField}) => {
  const multi = constraint.constraintType === "multiSelect";

  return <React.Fragment key={fieldKey} >
    <label htmlFor={id}>{name}</label>
    <select required={!constraint.isOptional} id={id} name={fieldKey}
      multiple={multi}
      className={multi ? "sized" : undefined}
      value={multi ? value ?? [] : value ?? ""}
      size={multi ? constraint.constraint.length : undefined}
      onChange={e => !multi ? onChange(e.target.value)
        : onChange([...e.target?.options].filter(o => o.selected).map(o => o.value)) }>
      {constraint.constraint.map(x =>
        <option value={x.key} key={x.key}>{x.name}</option>)}
    </select></React.Fragment>;
};

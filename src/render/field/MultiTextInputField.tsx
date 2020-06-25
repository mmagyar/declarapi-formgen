import { EditBaseType } from "../EditBaseType";

import { MultiTextField, MultiText } from "../../FormTypes";

import React from "react";

import { SelectInputField } from "./SelectInputField";

import { TextInputField } from "./TextInputField";
import { arrayToObject } from "microtil";

export const MultiTextInputField = ({ id, onChange, fieldKey, field: { name, value, constraint } }:
  EditBaseType & {field: MultiTextField}) => {
  const keys = arrayToObject(constraint.options, "key");
  const options = Object.entries(value?.content ?? {}).map(([key, valueLocal]) => keys[key]
    ? <div key={`${id}_${key}`} className="multiTextEntry">
      <TextInputField fieldKey={`${id}_${key}_text`} id={`${id}_${key}_text`}
        onChange={e => {
          const newVal: MultiText =
         { selectValue: value?.selectValue ||
           "err", content: { ...value?.content } };
          newVal.content[key] = e;
          onChange(newVal);
        }}
        field={{ value: valueLocal,
          name: keys[key].name,
          constraint: constraint.text }}/>
    </div> : null);

  return <React.Fragment key={fieldKey} >
    <label htmlFor={id}>{name}</label>
    <SelectInputField id={`${id}_select`} fieldKey={`${id}_select`}
      field={{ name: "Key", value: value?.selectValue, constraint: { constraintType: "select",
        constraint: constraint.options } }}
      onChange={selectValue => onChange({ selectValue, content: value?.content || {} })}/>
    <button type="button" onClick={() => {
      let selectValue = value?.selectValue || constraint.options[0]?.key;
      if (!selectValue || value?.content?.[selectValue]) return;
      if (!constraint.options.find(x => x.key === selectValue))
        selectValue = constraint.options[0].key;

      const newVal: {[s: string]: string} = { ...value?.content };
      newVal[selectValue] = "";
      onChange({ selectValue, content: newVal });
    }}>Add</button>{options }</React.Fragment>;
};

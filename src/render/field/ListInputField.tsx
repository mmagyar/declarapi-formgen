import React from "react";
import { EditBaseType } from "../EditBaseType";
import { ListField } from "../../FormTypes";

export const ListInputField = ({ id, fieldKey: key, field: { name, value }, onChange }:
  EditBaseType & {field: ListField}) => <React.Fragment key={key} >
  <label htmlFor={id}>{name}</label>
  <input type="button" name={key} value={"Add"} id={id}
    onClick={() => onChange([...value ?? [], ""])
    }/>
  <ol className="values">
    {value?.map((x, i) =>
      <li key={i}>
        <input key={`${i}_text`} type="text" value={x} onChange={e => {
          const newArray = [...value];
          newArray[i] = e.target.value;
          onChange(newArray);
        }}/>
        <input key={`${i}_remove`} type="button" value="remove" onClick={() => {
          const newArray = [...value];
          newArray.splice(i, 1);
          onChange(newArray);
        }}/>
      </li>)}
  </ol>
</React.Fragment>;

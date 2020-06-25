import { DateTimeField, DateField, TimeField } from "../../FormTypes";
import { EditBaseType } from "../EditBaseType";
import React from "react";

type DateInputType = EditBaseType & {field: DateField}
export const DateInputField = ({ id, onChange, fieldKey: key, field: { name, value, constraint } }:
       DateInputType) => {
  const current = value ?? { year: undefined, month: undefined, day: undefined };
  return <React.Fragment key={key} >
    <label htmlFor={id}>{name}</label>
    <span id={id} className="DatePicker">
      <label>Year <input type="number"
        name={`${key}_year`}
        value={current.year ?? ""}
        required={!constraint.isOptional}
        min={constraint.min ? constraint.min.year : 0}
        max={constraint.max ? constraint.max.year : 9999} step={1}
        onChange={e => onChange({ ...current, year: Number(e.target.value) })}
      /></label>
      <label>Month <input type="number"
        name={`${key}_month`}
        value={current.month ?? ""}
        required={!constraint.isOptional}
        min={constraint.min ? constraint.min.month : 1}
        max={constraint.max ? constraint.max.month : 12}
        onChange={e => onChange({ ...current, month: Number(e.target.value) })}
        step={1}/></label>
      <label>Day <input type="number"
        name={`${key}_day`}
        value={current.day ?? ""}
        required={!constraint.isOptional}
        min={constraint.min ? constraint.min.day : 1}
        max={constraint.max ? constraint.max.day : 31}
        onChange={e => onChange({ ...current, day: Number(e.target.value) })}
        step={1}/></label>
    </span></React.Fragment>;
};

type TimeInputType = EditBaseType & {field: TimeField}
export const TimeInputField = ({ id, onChange, fieldKey: key, field: { name, value, constraint } }:
       TimeInputType) => {
  const current = value ?? { hour: undefined, minute: undefined,
    second: undefined, millisecond: undefined, timezone: "UTC" };
  return <React.Fragment key={key} >
    <label htmlFor={id}>{name}</label>
    <span id={id} className="TimePicker">
      <label>Hour <input type="number"
        name={`${key}_hour`}
        value={current.hour ?? ""}
        required={!constraint.isOptional}
        min={constraint.min ? constraint.min.hour : 0}
        max={constraint.max ? constraint.max.hour : 24} step={1}
        onChange={e => onChange({ ...current, hour: Number(e.target.value) })}
      /></label>
      <label>Month <input type="number"
        name={`${key}_minute`}
        value={current.minute ?? ""}
        required={!constraint.isOptional}
        min={constraint.min ? constraint.min.minute : 0}
        max={constraint.max ? constraint.max.minute : 59}
        onChange={e => onChange({ ...current, minute: Number(e.target.value) })}
        step={1}/></label>
      <label>Day <input type="number"
        name={`${key}_second`}
        value={current.second ?? ""}
        required={!constraint.isOptional}
        min={constraint.min ? constraint.min.second : 0}
        max={constraint.max ? constraint.max.second : 59}
        onChange={e => onChange({ ...current, day: Number(e.target.value) })}
        step={1}/></label>
    </span></React.Fragment>;
};
export type DateTimeInputType = EditBaseType & {
  field: DateTimeField;
};

export const DateTimeInputField = ({ id, onChange, fieldKey, field: { name, value, constraint } }:
   DateTimeInputType) =>
  <React.Fragment key={fieldKey} >
    <label htmlFor={id}>{name}</label><span className="DateTimePicker" id={id}>
      <DateInputField id={`${id}_date`} fieldKey={`${fieldKey}_date`}
        onChange={(e => onChange({ ...value, date: e }))}
        field={{ name: "Date", value: value?.date, constraint: {
          constraintType: "date",
          min: constraint.min,
          max: constraint.max
        } }}/>
      <TimeInputField id={`${id}_time`}
        fieldKey={`${fieldKey}_time`}
        onChange={(e => onChange({ ...value, date: e }))}
        field={{ name: "Time", value: value?.time, constraint: {
          constraintType: "time",
          min: constraint.minTimeEveryDay,
          max: constraint.maxTimeEveryDay
        } }}/></span>
  </React.Fragment>;

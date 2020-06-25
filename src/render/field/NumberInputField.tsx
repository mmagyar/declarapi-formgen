import { EditBaseType } from "../EditBaseType";

import { NumberField, NumericRangeField, ConstraintNumber } from "../../FormTypes";

import React from "react";

export const NumberInputField =
({ id, onChange, fieldKey, field: { name, value, postfix, constraint }, onBlur }:
   EditBaseType & {field: NumberField; onBlur?: () => void}) =>
  <React.Fragment key={fieldKey} >
    <label htmlFor={id}>{name}</label>
    <input type="number" name={fieldKey} id={id}
      step={constraint.stepSize} min={constraint.min} max={constraint.max}
      required={!constraint.isOptional}
      onBlur={() => {
        if (onBlur) onBlur();
      }}
      value={value ?? ""} onChange={e => onChange(Number(e.target.value))}/>
    {postfix && <span className="postfix">{postfix}</span>}</React.Fragment>;

export const NumericRangeInputField =
({ id, onChange, fieldKey, field: { name, value, constraint, postfix } }:
   EditBaseType & {field: NumericRangeField}) => {
  /** Make sure min is actually min when user leaves input field**/
  const swap = (min1: number, max1: number) =>
    ({ min: min1 <= max1 ? min1 : max1, max: max1 <= min1 ? min1 : max1 });

  /** Only change other on change when it's being stepped, not with direct numeric input**/

  const numberConstraint: ConstraintNumber = { ...constraint, constraintType: "number" };
  return <React.Fragment key={fieldKey} >
    <label htmlFor={id}>{name}</label>
    <span className="numericRange">
      <NumberInputField id={`${id}_min`} fieldKey={`${fieldKey}_min`}
        field={{ value: value?.min, postfix,
          constraint: numberConstraint, name: "Minimum:" }}
        onBlur={() => {
          if (value?.min !== undefined && value?.max !== undefined)
            onChange(swap(value?.min ?? value?.max, value?.max ?? value?.min));
        }}
        onChange={(e: number) => onChange({ ...value, min: e })}/>
      <NumberInputField id={`${id}_max`} fieldKey={ `${fieldKey}_max`}
        field={{ value: value?.max, postfix,
          constraint: numberConstraint, name: "Maximum:" }}
        onBlur={() => {
          if (value?.min ?? value?.max !== undefined)
            onChange(swap(value?.min ?? value?.max, value?.max ?? value?.min));
        }}
        onChange={(e: number) => onChange({ ...value, max: e })}/>
    </span>
  </React.Fragment>;
};

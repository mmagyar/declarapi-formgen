import React, { FormEvent, useState, useEffect } from "react";
import { Form } from "../Form";
import { isStringField, isNumberField, isSelectField, isMultiSelectField,
  isCheckboxField, isDateField, isDateTimeField, isTimeField,
  isNumericRangeField, NumericRangeField, Field, isMultiTextField,
  isListField } from "../FormTypes";
import { deepCopy } from "microtil";
import { DateInputField, TimeInputField, DateTimeInputField } from "./field/DateTimeInputFields";
import { CheckBoxInputField } from "./field/CheckBoxInputField";
import { TextInputField } from "./field/TextInputField";
import { SelectInputField } from "./field/SelectInputField";
import { MultiTextInputField } from "./field/MultiTextInputField";
import { NumberInputField, NumericRangeInputField } from "./field/NumberInputField";
import { ListInputField } from "./field/ListInputField";

export type FormAction<T> = {action? : string; form?: T; key: string; value: any} |
  {action: "override"; form: T; key?: string; value?: any}
export type FormDispatcher<T> = React.Dispatch<FormAction<T>>


export const reducer = <T extends Form>(current: T, x: FormAction<T>): T => {
  if (x.action === "override" && x.form)
    return deepCopy(x.form);

  const result = deepCopy(current);
  result.fields[x.key || ""].value = x.value;
  return result;
};


const renderField = <T extends Form>(formKey: string, fieldKey: string,
  dispatcher: (value: FormAction<T>) => void, field: Field) => {
  if (field.hidden) return <React.Fragment key={fieldKey}></React.Fragment>;
  const defaultProps = {
    key: fieldKey,
    fieldKey,
    id: `_form_${formKey}_${fieldKey}`,
    onChange: (value: string) => dispatcher({ key: fieldKey, value })
  };

  if (isStringField(field))
    return <TextInputField {...defaultProps} field={field}/>;
  else if (isNumberField(field))
    return <NumberInputField {...defaultProps} field={field}/>;
  else if (isNumericRangeField(field))
    return <NumericRangeInputField {...defaultProps} field={field}/>;
  else if (isSelectField(field) || isMultiSelectField(field))
    return <SelectInputField {...defaultProps} field={field}/>;
  else if (isCheckboxField(field))
    return <CheckBoxInputField {...defaultProps} field={field}/>;
  else if (isDateField(field))
    return <DateInputField {...defaultProps} field={field}/>;
  else if (isTimeField(field))
    return <TimeInputField {...defaultProps} field={field}/>;
  else if (isDateTimeField(field))
    return <DateTimeInputField {...defaultProps} field={field}/>;
  else if (isMultiTextField(field)) return <MultiTextInputField {...defaultProps} field={field}/>;
  else if (isListField(field)) return <ListInputField {...defaultProps} field={field} />;
  console.warn(`Skipping unhandled field type: ${field.constraint.constraintType}`);
  return <React.Fragment key={fieldKey} ></React.Fragment>;
};

const ensureDataConsistency = (form: Form) => {
  for (const key of Object.keys(form.fields))
    if (isNumericRangeField(form.fields[key])) {
      const read: NumericRangeField = form.fields[key] as NumericRangeField;
      if (read.value) {
        if (read.value?.min === undefined && read.value?.max === undefined)
          form.fields[key].value = undefined;
        if (read.value?.min === undefined)
          form.fields[key].value = { ...read.value, min: read.value.max };
        if (read.value?.max === undefined)
          form.fields[key].value = { ...read.value, max: read.value.min };
      }
    }
};

export type Input<T extends Form> = {
  reducer: [T, FormDispatcher<T>]; onDone: (form: T) => Promise<JSX.Element|void>;}
  & React.HTMLProps<HTMLFormElement>


export const FormRender = <T extends Form>(props: Input<T>) => {
  const { reducer: [formDef, dispatcher], onDone } = props;

  const [done, setDone] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState<any>();
  useEffect(() => {
    let isMounted = true;
    if (submit) {
      setLoading(true);
      onDone(submit).then(x => {
        if (!isMounted) return;
        if (!x) setDone(<p>Saving finished successfully</p>);
        else setDone(x);
        setLoading(false);
      }).catch(x => {
        if (!isMounted) return;
        setDone(<div><h2>Error</h2><code>{JSON.stringify(x, undefined, 2)}</code></div>);
        setLoading(false);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [submit, onDone]);

  if (!formDef.formKey) {
    console.error("Form key is missing, can't render form");
    return <h2 className="error">Error, could not load form</h2>;
  }
  const fields = Object.entries(formDef.fields)
    .map(([key, field]) => renderField(formDef.formKey, key, dispatcher, field));
  if (loading) return <h2 >Saving...<span className="loading"></span></h2>;
  if (done) return <div >
    <button type="button" onClick={() => {
      setSubmit(undefined);
      setDone(undefined);
    }}>Go back to editing</button>
    {done}</div>;

  const passThroughProps = { ...props };
  delete passThroughProps.reducer;
  delete passThroughProps.onDone;
  return <form name={formDef.formKey} {...passThroughProps } onSubmit={
    (e: FormEvent<HTMLFormElement>) => {
      ensureDataConsistency(formDef);
      setSubmit(formDef);
      e.preventDefault();
      return false;
    }}>
    <h2>{formDef.formName}</h2>{fields}
    <br/>

    <button type="submit">Submit</button></form>;
};

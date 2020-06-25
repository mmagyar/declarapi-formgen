import React from "react";
import { Form } from "./Form";
import { isStringField, isNumberField, isSelectField, isMultiSelectField,
  isCheckboxField, isDateField, isDateTimeField, isTimeField,
  isNumericRangeField, Field, isMultiTextField, isListField } from "./FormTypes";
import { IDate, Time } from "microtil";

export type Action = {
  action: "edit" | "delete";
  id: string;
}


type FC = {
  id: string;
  key: string;
  name: string;
  children: any;
}
const FieldCommon = (props: FC) => <div className="valueBlock column" id={props.id} key={props.id}>
  <span className="fieldInfo">{props.name}</span>
  <span className="fieldValue">{props.children}</span>
</div>;
const DateFieldRender = ({ id, name, field, postfix }:
   {id: string;name: string; field?: IDate; postfix: string}) =>
  <FieldCommon key={id} id={id} name={name}>{field?.year}-{field?.month}-{field?.day}{postfix}
  </FieldCommon>;

const TimeFieldRender = ({ id, field, name, postfix }:
  {id: string;name: string; field?: Time; postfix: string}) =>
  <FieldCommon key={id} id={id} name={name}>
    {field?.hour}:{field?.minute}:{field?.second} {field?.inputTimezone ?? ""}{postfix}
  </FieldCommon>;

const DateTimeFieldRender = ({ id, time, date, name, postfix }:
  {id: string;name: string; time?: Time; date?: IDate; postfix: string}) =>
  <FieldCommon key={id} id={id} name={name}>
    {date?.year}-{date?.month}-{date?.day}T
    {time?.hour}:{time?.minute}:{time?.second}{time?.inputTimezone ?? ""}{postfix}</FieldCommon>;

// eslint-disable-next-line complexity
const renderField = (prefix: string, field: Field) => {
  if (field.hidden) return <React.Fragment key={prefix} ></React.Fragment>;
  const id = `${prefix}`;
  const postfix = field.postfix ?? "";
  const defaultProps = { key: id, id, name: field.name };
  if (isStringField(field) || isNumberField(field))
    return <FieldCommon {...defaultProps}>{field.value}{postfix}</FieldCommon>;
  else if (isNumericRangeField(field)) {
    if (field.value?.min === undefined && field.value?.max === undefined)
      return <FieldCommon {...defaultProps}>
        <span></span></FieldCommon>;
    if (field.value?.min === field.value?.max) return <FieldCommon {...defaultProps}>
      <span>{field.value?.min}{postfix}</span></FieldCommon>;
    return <FieldCommon {...defaultProps}>
      <span>{field.value?.min}{postfix}</span>{" - "}
      <span>{field.value?.max}{postfix}</span></FieldCommon>;
  } else if (isSelectField(field) || isMultiSelectField(field)) {

    const fieldName = Array.isArray(field.value) ? field.value
      .map(x => field.constraint.constraint.find(y => y.key === x)?.name).join(", ")
      : field.constraint.constraint
        .find(x => x.key === field.value)?.name ?? field.value ?? "";
    return <FieldCommon {...defaultProps}>{fieldName}{postfix}</FieldCommon>;
  } else if (isCheckboxField(field))
    return <FieldCommon {...defaultProps}>
      {field.value ? "true" : "false"}{field.postfix}</FieldCommon>;
  else if (isDateField(field))
    return <DateFieldRender id={id} name={field.name} field={field.value} postfix={postfix}/>;
  else if (isTimeField(field))
    return <TimeFieldRender id={id} name={field.name} field={field.value} postfix={postfix}/>;
  else if (isDateTimeField(field))
    return <DateTimeFieldRender id={id} name={field.name}
      date={field.value?.date} time={field.value?.time}postfix={postfix}/>;
  else if (isMultiTextField(field))
    return <FieldCommon {...defaultProps}>
      {Object.entries(field.value?.content || {}).map(([key, value]) =>
        <span className="keyValue" key={key}>
          <span className="key">{key}</span>
          <span className="value">{value}</span>
        </span>)}</FieldCommon>;
  else if (isListField(field))
    return <FieldCommon {...defaultProps}><ol>
      {(field.value ?? []).map((value, i) => <li className="value" key={i}>{value}</li>)}
    </ol></FieldCommon>;


  console.warn(`unhandled field type: ${field.constraint.constraintType}`);
  return <FieldCommon {...defaultProps}>
    {JSON.stringify(field.value, undefined, 2)}{field.postfix ?? ""}</FieldCommon>;

};


const renderEditLine = (
  id: string, form: Form, onlyWithValue = false, callback?: (action: Action) => void) => {
  const prefix = `${form.formKey}${id}`;

  const actions = callback ? <div className="valueBlock column actionButton">
    <span className="fieldInfo">Actions</span>
    <span className="fieldValue">
      <button onClick={() => callback({ id, action: "edit" })}>Edit</button>
      <button onClick={() => callback({ id, action: "delete" })}>Delete</button>
    </span>
  </div> : null;
  return <div key={prefix} className="row">
    {/* <div className="field"> */}
    {Object.entries(form.fields).map(([key, field]) =>
      onlyWithValue && field.value === undefined ? null : renderField(`${prefix}_${key}`, field))}
    {/* </div> */}
    {actions}
  </div>;
};
export type InputCard = {
  formData: Form | undefined;
  showFormName?: boolean;
} & React.HTMLProps<HTMLDivElement>

export const FormCardRender = (props: InputCard) => {
  const { formData: data } = props;
  const passThroughProps = { ...props };
  delete passThroughProps.formData;

  if (!data) return <div className={"formCardRender"}><h2>No Data</h2></div>;
  return <div {...passThroughProps }
    className={`${passThroughProps?.className || ""} formCardRenderContainer`}>
    <div className={"formCardRender"}>
      {props.showFormName ? <h2>{data.formName}</h2> : <></>}{renderEditLine("", data, true)}
    </div>
    {props.children}
  </div>;
};


export type Input = {
  idFieldKey: string;
  forms: Form[];
  onAction?: (action: Action) => void;
  showFormName?: boolean;
} & React.HTMLProps<HTMLDivElement>

export const FormListRender = (props: Input) => {
  const { forms: data, idFieldKey } = props;
  const passThroughProps = { ...props };
  delete passThroughProps.forms;
  delete passThroughProps.idFieldKey;
  delete passThroughProps.onAction;
  const first = data.find(() => true);
  if (first === undefined)
    return <div {...passThroughProps }><h2>No Data</h2></div>;
  const proto: Form = first;

  const rows = data.map(x => renderEditLine(
    x.fields[idFieldKey]?.value?.toString() ?? "", x, false, props.onAction));

  const header = <div className="header row">{Object.entries(proto.fields).map(([key, field]) => {
    if (field.hidden) return <React.Fragment key={key}></React.Fragment >;
    return <span key={key} className="column">
      <span className="name">{field.name}</span>
      <span className="tooltip description">{field.description}</span>
    </span>;
  })}
  { props.onAction ? <span key={"$$actions"} className="column">
    <span className="name">Actions</span>
    <span className="tooltip description">Possible operations with the record</span>
  </span> : null}
  </div>;


  return <div {...passThroughProps }
    className={`${passThroughProps?.className || ""} formListRenderContainer`}>
    <div className={"formListRender"}>
      {props.showFormName ? <h2>{proto.formName}</h2> : <></>}{header}{rows}</div></div>;
};

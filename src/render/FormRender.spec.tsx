import React from "react";
import { cleanup, fireEvent, render, wait } from "@testing-library/react";
import { FormRender } from "./FormRender";
import { Form } from "../Form";
import * as field from "../FieldHelpers";

describe("Form Render", () => {
  afterEach(cleanup);

  const changeValue = async (el: any, value: any) => {
    el.value = value;
    const evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    el.dispatchEvent(evt);
    fireEvent.change(el, { target: { name: "sdf", value } });
    console.log(el.change);
    await wait();
  };
  it("can render a basic form", async () => {
    const form: Form = {
      formKey: "testForm",
      formName: "TestForm",
      fields: { field1: field.str("String Test", undefined, "default text") }
    };
    const { getByLabelText } = render(
      <FormRender onDone={async () => { /**/ } }
        reducer={[form, ({ key, value }) => console.log(key, value)]} />
    );

    expect(getByLabelText("String Test")).toHaveValue("default text");

  });

  it("can render number field", async () => {
    const form: Form = {
      formKey: "testForm",
      formName: "TestForm",
      fields: { field1: field.num("Number Test", { constraintType: "number" }, 22) }
    };
    const { getByLabelText } = render(
      <FormRender onDone={async () => { /**/ } }
        reducer={[form, ({ key, value }) => console.log(key, value)]} />
    );

    expect(getByLabelText("Number Test")).toHaveValue(22);


  });
});

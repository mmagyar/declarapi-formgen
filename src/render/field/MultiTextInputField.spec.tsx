import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { MultiTextInputField } from "./MultiTextInputField";
import { multiText } from "../../FieldHelpers";
import userEvent from "@testing-library/user-event";

describe("Multi text input field", () => {
  const fieldProto = () =>
    multiText("text1", [["a1", "Alpha 1"], ["b1", "Beta 1"]]);

  it("shows an options selector", () => {
    const field = fieldProto();
    const el = <MultiTextInputField
      field={field}
      id={"a1"}
      fieldKey={"alpha1"}
      onChange={e => {
        field.value = e;
      }}/>;
    const { getByLabelText } = render(el);

    expect(getByLabelText("Key")).toHaveValue("a1");

  });

  it("it adds a text box on clicking add", async () => {
    const field = fieldProto();
    const el = () => <MultiTextInputField
      field={field}
      id={"o1"}
      fieldKey={"omega1"}
      onChange={e => { field.value = e; }}/>;
    const { getByLabelText, getByText, rerender } = render(el());

    fireEvent.change(getByLabelText("Key"), { target: { value: "b1" } });
    rerender(el());

    getByText("Add").click();
    rerender(el());
    expect(getByLabelText("Beta 1")).toHaveValue("");
    userEvent.type(getByLabelText("Beta 1"), "hello world");
    rerender(el());
    expect(getByLabelText("Beta 1")).toHaveValue("hello world");

  });

  it("it handles invalid select gracefully, falls back to first options", async () => {
    const field = fieldProto();
    const el = () => <MultiTextInputField
      field={field}
      id={"o1"}
      fieldKey={"omega1"}
      onChange={e => {
        field.value = e;
      }}/>;
    const { getByLabelText, getByText, rerender } = render(el());

    // getByLabelText("Key").click();
    fireEvent.change(getByLabelText("Key"), { target: { value: "b2" } });
    rerender(el());

    getByText("Add").click();
    rerender(el());
    expect(getByLabelText("Alpha 1")).toHaveValue("");
  });

  it("it handles invalid props gracefully, falls back to first options", async () => {
    const field = fieldProto();
    field.value = { selectValue: "invalid", content: {} };
    const el = () => <MultiTextInputField
      field={field}
      id={"o1"}
      fieldKey={"omega1"}
      onChange={e => {
        field.value = e;
      }}/>;
    const { getByLabelText, getByText, rerender } = render(el());

    rerender(el());
    getByText("Add").click();
    rerender(el());
    expect(getByLabelText("Alpha 1")).toHaveValue("");
  });

  it("it does not display data who's key is not in the constraints", async () => {
    const field = fieldProto();
    field.value = { content: { invalid: "Invalid" } };
    const el = () => <MultiTextInputField
      field={field}
      id={"o1"}
      fieldKey={"omega1"}
      onChange={e => {
        field.value = e;
      }}/>;
    const { queryByText } = render(el());
    expect(queryByText("Invalid")).toBeNull();

  });

  it("it handles if an options selection was not set when the user types", async () => {
    const field = fieldProto();
    field.value = { content: { a1: "Alpha 1" } };
    const el = () => <MultiTextInputField
      field={field}
      id={"o1"}
      fieldKey={"omega1"}
      onChange={e => {
        field.value = e;
      }}/>;
    const { getByLabelText, rerender } = render(el());
    userEvent.type(getByLabelText("Alpha 1"), "hello world");
    rerender(el());
    expect(getByLabelText("Alpha 1")).toHaveValue("hello world");
  });

  it("It shows empty select when no options for the select is specified " +
  "add button does nothing", () => {
    let isCalled = false;
    const field = multiText("text1", []);
    const el = () => <MultiTextInputField
      field={field}
      id={"a1"}
      fieldKey={"alpha1"}
      onChange={e => {
        field.value = e;
        isCalled = true;
      }}/>;
    const { rerender, getByText } = render(el());

    getByText("Add").click();
    rerender(el());
    expect(isCalled).toBeFalsy();
  });

  it("It handles invalid value gracefully", () => {
    let isCalled = false;
    const field = multiText("text1", []);
    field.value = {} as any;
    const el = () => <MultiTextInputField
      field={field}
      id={"a1"}
      fieldKey={"alpha1"}
      onChange={e => {
        field.value = e;
        isCalled = true;
      }}/>;
    const { rerender, getByText } = render(el());

    getByText("Add").click();
    rerender(el());
    expect(isCalled).toBeFalsy();
  });
});

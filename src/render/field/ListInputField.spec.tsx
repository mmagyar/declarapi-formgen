import React from "react";
import { render } from "@testing-library/react";
import { list } from "../../FieldHelpers";
import userEvent from "@testing-library/user-event";
import { ListInputField } from "./ListInputField";
describe("List input field", () => {

  let value: string[]|undefined = [];
  beforeEach(() => { value = []; });
  const props = () => ({ id: "abc",
    fieldKey: "xzy",
    field: list("List input", undefined, value),
    onChange: (e: string[]) => { value = e; } });

  it("renders the label and an add button for empty input", () => {
    value = [];
    const { getByDisplayValue, getByLabelText } = render(<ListInputField {...props()}/>);
    expect(getByDisplayValue("Add")).toHaveAttribute("type", "button");
    expect(getByLabelText("List input")).toHaveAttribute("type", "button");
  });

  it("renders all the given values", () => {
    value = ["element1", "element2", "element3"];
    const { getByDisplayValue, getByLabelText, getAllByDisplayValue } =
      render(<ListInputField {...props()}/>);
    expect(getByDisplayValue("Add")).toHaveAttribute("type", "button");
    expect(getByLabelText("List input")).toHaveAttribute("type", "button");
    expect(getAllByDisplayValue("element1")).toHaveLength(1);
    expect(getAllByDisplayValue("element1")[0]).toHaveAttribute("type", "text");
    expect(getAllByDisplayValue("element2")).toHaveLength(1);
    expect(getAllByDisplayValue("element2")[0]).toHaveAttribute("type", "text");
    expect(getAllByDisplayValue("element3")).toHaveLength(1);
    expect(getAllByDisplayValue("element3")[0]).toHaveAttribute("type", "text");

  });

  it("calls onChange on user interaction", () => {
    const { rerender, queryAllByDisplayValue, getByDisplayValue } =
      render(<ListInputField {...props()}/>);
    userEvent.click(getByDisplayValue("Add"));
    expect(queryAllByDisplayValue("")).toHaveLength(0);

    rerender(<ListInputField {...props()}/>);
    expect(value).toHaveLength(1);
    expect(value).toStrictEqual([""]);
    const input = getByDisplayValue("");
    expect(input).toHaveAttribute("type", "text");
    userEvent.type(input, "hello world");

    rerender(<ListInputField {...props()}/>);
    expect(value).toStrictEqual(["hello world"]);
    expect(getByDisplayValue("hello world")).toHaveAttribute("type", "text");

    userEvent.click(getByDisplayValue("Add"));
    expect(value).toStrictEqual(["hello world", ""]);

  });


  it("can remove added elements", () => {
    value = ["el1", "el2", "el3", "el4", "el5"];

    const { rerender, queryByDisplayValue, getByDisplayValue } =
      render(<ListInputField {...props()}/>);
    const el3 = getByDisplayValue("el3");
    const remove = el3.parentElement?.querySelector("input[value='remove']");
    expect(remove).toBeDefined();
    userEvent.click(remove as any);
    rerender(<ListInputField {...props()}/>);

    expect(queryByDisplayValue("el3")).toBeNull();
    expect(value).toStrictEqual(["el1", "el2", "el4", "el5"]);
  });

  it("handles undefined value", () => {
    value = undefined;
    const properties = props();
    properties.field.value = value;
    const { getByDisplayValue, getByLabelText } = render(<ListInputField {...properties}/>);
    expect(getByDisplayValue("Add")).toHaveAttribute("type", "button");
    expect(getByLabelText("List input")).toHaveAttribute("type", "button");

    userEvent.click(getByDisplayValue("Add"));

    expect(value).toStrictEqual([""]);

  });
});

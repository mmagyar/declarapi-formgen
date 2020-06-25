import React from "react";
import { render } from "@testing-library/react";
import { checkbox } from "../../FieldHelpers";
import userEvent from "@testing-library/user-event";
import { CheckBoxInputField } from "./CheckBoxInputField";
describe("Checkbox input field", () => {

  let value = false;
  beforeEach(() => { value = false; });
  const props = () => ({ id: "abc", fieldKey: "xzy", field: checkbox("chubu", undefined, value),
    onChange: (e: boolean) => { value = e; } });

  it("renders a checkbox", () => {
    const { container } = render(<CheckBoxInputField {...props()}/>);
    expect(container).toMatchSnapshot();
  });

  it("calls onChange on user interaction", () => {
    const { rerender, getByLabelText } = render(<CheckBoxInputField {...props()}/>);
    expect(getByLabelText("chubu")).not.toBeChecked();
    userEvent.click(getByLabelText("chubu"));
    rerender(<CheckBoxInputField {...props()}/>);
    expect(getByLabelText("chubu")).toBeChecked();

  });
});

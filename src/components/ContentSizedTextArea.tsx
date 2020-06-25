import React, { useState, useRef, useEffect } from "react";
type Input = { value: string; name?: string; id?: string;
   onChange: (value: string) => void; required?: boolean;};
export const ContentSizedTextArea = ({ value, name, id, onChange, required }: Input) => {
  const [state, setState] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const scrollHeight = ref?.current?.scrollHeight;
  const resize = (force = false) => {
    if (ref?.current) {
      if (!force && ref.current.scrollHeight === parseInt(ref.current.style.height, 10))
        return;

      ref.current.style.height = "unset";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  //This is needed for the initial size setting
  useEffect(() => {
    resize();
  }, [scrollHeight]);

  return (
    <textarea
      className="contentTextArea"
      ref={ref}
      value={value}
      id={id}
      required={required}
      name={name}
      onChange={e => {
        const current = e.target.value;
        resize(state.length > current.length); //force resize on text delete
        setState(current);
        onChange(current);
      }}
    />
  );
};

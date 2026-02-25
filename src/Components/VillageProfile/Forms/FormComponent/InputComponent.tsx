import React from "react";

export default function InputComponent(props: any) {
  let {
    componentClass,
    palceholder,
    defaultValue,
    handleChange,
    label,
    wrapperClass,
    name,
    disabled,
    type,
    id,
    errors,
    ...rest
  } = props;
  const errorItem = errors.find((s: any) => s.name === id || s.name === name);
  const checkIfError = () => (errorItem ? "error" : "");
  return (
    <div className={`question ${checkIfError()} ${componentClass}`} key={id} id={id}>
      {label ? <label className="label">{label}</label> : ""}

      <div className={wrapperClass}>
        <input
          {...rest}
          onChange={handleChange}
          type={type ?? "text"}
          className="form-control"
          value={defaultValue ?? ""}
          name={name}
          disabled = {disabled}
          placeholder={palceholder}
        />
      </div>
      {errorItem && <div className="text-danger">{errorItem.message}</div>}
    </div>
  );
}

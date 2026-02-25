import React from "react";

export default function RadioComponent(props: any) {
  let {
    options,
    defaultValue,
    handleChange,
    label,
    wrapperClass,
    name,
    id,
    errors,
  } = props;

  const errorItem = errors.find((s: any) => s.name === id || s.name === name);
  const checkIfError = () => (errorItem ? "error" : "");
  const normalizedDefaultValue =
    defaultValue === undefined || defaultValue === null ? "" : `${defaultValue}`;
  return (
    <div className={`question ${checkIfError()}`} key={id} id={id}>
      <label className="label">{label}</label>
      <div className={wrapperClass}>
        {options.map((o: any, key: any) => (
          <div className="radio" key={key}>
            <label>
              <input
                type="radio"
                value={o.id}
                name={name}
                checked={normalizedDefaultValue === `${o.id}`}
                onChange={handleChange}
              />
              {o.name}
            </label>
          </div>
        ))}
      </div>
      {errorItem && <div className="text-danger">{errorItem.message}</div>}
    </div>
  );
}

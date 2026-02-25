export default function SelectComponent(props: any) {
  let {
    options,
    defaultValue,
    handleChange,
    label,
    wrapperClass,
    name,
    disabled,
    id,
    placeholder,
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
        <select
          className="form-control"
          name={name}
          disabled={disabled}
          onChange={handleChange}
          value={normalizedDefaultValue}
        >
          <option value={""} key={name + "-option-1"}>
            ---{placeholder}---
          </option>
          {options.map((d: any, key: any) => (
            <option value={d.id} key={name + "-option-" + key}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      {errorItem && <div className="text-danger">{errorItem.message}</div>}
    </div>
  );
}

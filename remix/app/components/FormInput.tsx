import { InputText } from "primereact/inputtext";
import { useField } from "remix-validated-form";

type MyInputProps = {
  name: string;
  label: string;
};

export const MyInput = ({ name, label }: MyInputProps) => {
  const { error, getInputProps } = useField(name);
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <InputText {...getInputProps({ id: name })} className={error && `p-invalid`} />
      {error && <small className="my-error-class">{error}</small>}
    </div>
  );
};
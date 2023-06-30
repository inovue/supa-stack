import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import type { InputTextProps } from 'primereact/inputtext';

import { useField } from "remix-validated-form";

type FormInputProps = InputTextProps & {
  name: string;
  label?: string;
  description?: string;
};

export const FormInput:React.FC<FormInputProps> = ({ name, label, description, ...rest }: FormInputProps ) => {
  const { getInputProps, error } = useField(name);
  const ariaDescribedId = `${name}-help`
  return (
    <div className={classNames(['field'])}>
      <label className={classNames([])} htmlFor={name}>{label}</label>
      <InputText className={classNames(['w-full', { 'p-invalid': error }])}  aria-describedby={ariaDescribedId} {...getInputProps({ id: name, ...rest, })} />
      {error ?
        <small className="p-error">{error}</small>:
        description && <small id={ariaDescribedId} >{description}</small>
      }
    </div>
  );
};
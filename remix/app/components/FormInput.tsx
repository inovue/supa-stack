import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import type { InputTextProps } from 'primereact/inputtext';

import { useField } from "remix-validated-form";

type FormInputProps = {
  name: string;
  label?: string;
  description?: string;
};

export const FormInput = ({ name, label, description, ...rest }: FormInputProps & InputTextProps) => {
  const { getInputProps, error } = useField(name);
  const ariaDescribedId = `${name}-help`
  return (
    <div className={classNames(['flex', 'flex-column', 'gap-2'])}>
      <label className={classNames(['font-bold'])} htmlFor={name}>{label}</label>
      <InputText className={classNames({ 'p-invalid': error })}  aria-describedby={ariaDescribedId} {...getInputProps({ id: name, ...rest, })} />
      {error ?
        <small className="p-error">{error}</small>:
        description && <small id={ariaDescribedId} >{description}</small>
      }
    </div>
  );
};
import { Button } from "primereact/button";
import { useIsSubmitting } from "remix-validated-form";

type SubmitButtonProps = JSX.IntrinsicElements['input'] & {
  label?: string;
  submittingLabel?: string;
};

export const SubmitButton = ({label, submittingLabel}:SubmitButtonProps) => {
  const isSubmitting = useIsSubmitting();
  const labelText = isSubmitting ? (submittingLabel || label || 'Submitting...') : (label || 'Submit')

  return (
    <Button type="submit" disabled={isSubmitting} loading={isSubmitting} label={labelText} />
  );
};
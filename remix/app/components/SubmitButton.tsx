import { Button } from "primereact/button";
import { useFormContext, useIsSubmitting } from "remix-validated-form";

export const SubmitButton = () => {
  const isSubmitting = useIsSubmitting();
  const { isValid } = useFormContext();
  const disabled = isSubmitting || !isValid;

  return (
    <Button type="submit" disabled={disabled} loading={isSubmitting} >
      {isSubmitting ? "Submitting..." : "Submit"}
    </Button>
  );
};
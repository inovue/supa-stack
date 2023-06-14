import { classNames } from "primereact/utils";
import { useNavigate } from "@remix-run/react";
import { z } from "zod";
import { ValidatedForm } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";

import { Button } from "primereact/button";
import { FormInput } from "./FormInput";
import { SubmitButton } from "./SubmitButton";
import { FormErrorBox } from "./FormErrorBox";
import FormFile from "./FormFile";

const stockSchema = z.object({
  title: z.string().nullable(),
  content: z.string().nullable()
});

export const stockFormValidator = withZod(stockSchema);

export function StockForm({ defaultValues }: { defaultValues?: Partial<z.infer<typeof stockSchema>>; }) {
  let navigate = useNavigate();

  return (
    <ValidatedForm validator={stockFormValidator} defaultValues={defaultValues} method="post" noValidate >
      <div className={classNames(['flex', 'flex-column', 'gap-2'])}>
        <FormInput name="title" label="Title" />
        <FormInput name="content" label="Content" />
        <div style={{width:'150px'}}> <FormFile /> </div>
        <FormErrorBox />
        
        <div className={classNames(['flex', 'w-full', 'gap-4', 'justify-content-center', 'mt-7'])}>
          <SubmitButton />
          <Button outlined onClick={() => navigate(-1)} label="Cancel" />
        </div>
      </div>
    </ValidatedForm>
  );
}
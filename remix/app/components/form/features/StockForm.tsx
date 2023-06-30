import { classNames } from "primereact/utils";
import { useNavigate } from "@remix-run/react";
import { z } from "zod";
import { ValidatedForm } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";

import { Button } from "primereact/button";
import { FormInput } from "~/components/form/fields/FormInput";
import { SubmitButton } from "~/components/form/fields/SubmitButton";
import { FormErrorBox } from "~/components/form/ui/FormErrorBox";

const stockSchema = z.object({
  title: z.string().nullable(),
  content: z.string().nullable(),
  
});
const mediaBoxSchema = z.object({
  id: z.number(),
  medias: z.array(z.object({
    id: z.number(),
    path: z.string(),
    contentType: z.string(),
    filename:z.string()
  }))
}).nullable()


const onChangeFilesHandler = (files: FileList | null) => {
  const formData = new FormData();
  if(files){
    for(let i=0; i<files.length; i++){
      formData.append('files', files![i]);
    }
  }
  
  // fetch('/api/stocks/AA001/images', { method: 'POST', body: formData });
}

export const stockFormValidator = withZod(stockSchema);

export function StockForm({ defaultValues, mediaboxValues }: { defaultValues?: Partial<z.infer<typeof stockSchema>>; mediaboxValues?: Partial<z.infer<typeof mediaBoxSchema>>}) {
  let navigate = useNavigate();

  return (
    <ValidatedForm validator={stockFormValidator} defaultValues={defaultValues} method="post" noValidate >
        <FormInput name="title" label="Title" />
        <FormInput name="content" label="Content" />
        
        <FormErrorBox />
        
        <div className={classNames(['flex', 'w-full', 'gap-4', 'justify-content-center', 'mt-7'])}>
          <SubmitButton />
          <Button outlined onClick={() => navigate(-1)} label="Cancel" />
        </div>
      
    </ValidatedForm>
  );
}
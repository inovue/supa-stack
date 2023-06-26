import { classNames } from "primereact/utils";
import { useNavigate } from "@remix-run/react";
import { z } from "zod";
import { ValidatedForm } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";

import { Button } from "primereact/button";
import { FormInput } from "~/components/form/fields/FormInput";
import { SubmitButton } from "~/components/form/fields/SubmitButton";
import { FormErrorBox } from "~/components/form/ui/FormErrorBox";
import MediaUploadButton from "~/components/form/features/MediaUploadButton";

const stockSchema = z.object({
  title: z.string().nullable(),
  content: z.string().nullable(),
  mediaBox: z.object({
    medias: z.array(z.object({
      id: z.number(),
      path: z.string(),
      contentType: z.string(),
      filename:z.string()
    }))
  }).nullable()
});

export const stockFormValidator = withZod(stockSchema);

export function StockForm({ defaultValues }: { defaultValues?: Partial<z.infer<typeof stockSchema>>; }) {
  let navigate = useNavigate();

  return (
    <>
      <ValidatedForm validator={stockFormValidator} defaultValues={defaultValues} method="post" noValidate >
        <div className={classNames(['flex', 'flex-column', 'gap-2'])}>
          <FormInput name="title" label="Title" />
          <FormInput name="content" label="Content" />
          
          <FormErrorBox />
          
          <div className={classNames(['flex', 'w-full', 'gap-4', 'justify-content-center', 'mt-7'])}>
            <SubmitButton />
            <Button outlined onClick={() => navigate(-1)} label="Cancel" />
          </div>
        </div>
      </ValidatedForm>
      
      <p>Medias</p>
      <ul>
        {defaultValues?.mediaBox?.medias?.map(media => (
          <li key={media.id}>
            {`${media.id } - ${media.filename} - ${media.contentType} - ${media.path}}`}
          </li>
        ))}
      </ul>
      <MediaUploadButton style={{width:'200px'}} id="files" name="files" accept="image/*" multiple />
    </>

  );
}
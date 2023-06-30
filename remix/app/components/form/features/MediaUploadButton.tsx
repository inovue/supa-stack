import { classNames } from 'primereact/utils';
import type { ChangeEvent, DragEvent, FormEvent } from 'react';
import { useRef } from 'react';

import { Toast } from 'primereact/toast';
import {z} from 'zod';
import { Form, useSubmit } from '@remix-run/react';

type FormFileProps = JSX.IntrinsicElements["input"] & {
  icon?: string;
  label?: string;
};

// zod validation less than 500KB image file
export const imageSchema = z.custom<File>().refine(
  (file) => file.size < 500000 && file.type.match(/image\/(png|jpe?g|gif)/), 
  { message: 'File must be less than 5MB and be an image' }
);

const MediaUploadButton: React.FC<FormFileProps> = ({ icon="pi-upload", label="Upload File", style, ...props }: FormFileProps) => {
  const preInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropareaRef = useRef<HTMLDivElement>(null);
  
  const toastRef = useRef<Toast>(null);
  const submit = useSubmit()
  
  
  const onChangePreInput = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('onChangePreInput [start]', event.currentTarget)
    event.preventDefault();
    const files = validateFiles(event.target.files);
    if(files?.length){
      inputRef.current!.files = files;
      inputRef.current?.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const onChangeForm = (event: FormEvent<HTMLFormElement>) => {
    console.log('onChangeForm [start]', event.currentTarget)
    event.preventDefault();
    submit(event.currentTarget, {method:"post"} )
    console.log('onChangeForm [end]', event.currentTarget)
  }


  const validateFiles = (files:FileList|null):FileList|null => {
    if(!files) return null;
    
    const safeFiles = new DataTransfer();
    for(let i=0; i<files.length; i++){
      const result = imageSchema.safeParse(files[i]);
      if(result.success){
        safeFiles.items.add(files[i])
      }else{
        toastRef.current?.show({ severity: 'error', summary: `${files[i].name}`, detail: result.error.issues[0].message, life: 3000 })
      }
    }
    return safeFiles.files;
  }

  
  

  const onClickCard = () => preInputRef.current?.click();

  const onDragOverCard = (event:DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDropAreaStyle(true);
  }
  const onDragLeaveCard = (event:DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDropAreaStyle(false);
  }

  const onDropCard = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files){
      preInputRef.current!.files = files;
      preInputRef.current?.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const setDropAreaStyle = (activate:boolean) => {
    activate ? dropareaRef.current?.classList.add('bg-blue-100'): dropareaRef.current?.classList.remove('bg-blue-100')
  }

  return (
    <>
    <Toast ref={toastRef} position="bottom-right" />
      <Form method='post' onChange={onChangeForm} style={{ display: 'none' }} encType='multipart/form-data' >
        <input type="file" name='files' ref={inputRef} {...props} />
      </Form>
      <input type="file" name='files' ref={preInputRef} onChangeCapture={onChangePreInput}  style={{ display: 'none' }} {...props} />
      <div 
        onClick={onClickCard} 
        onDrop={onDropCard} 
        onDragOver={onDragOverCard}
        onDragLeave={onDragLeaveCard} 
        onDropCapture={onDragLeaveCard}
        onDragEnd={onDragLeaveCard}
        className={classNames(['flex', 'flex-column', 'align-items-center', 'justify-content-center', 'hover:bg-gray-100', 'border-round', 'text-gray-800', 'border-gray-500', 'border-2','border-dashed', 'p-3', 'cursor-pointer'])} 
        style={{aspectRatio:1, ...style}} 
        ref={dropareaRef} 
      >
        {icon && <i className={classNames(['pi', icon])} style={{fontSize: '1.2rem'}}/>}
        {label && <small className={classNames(['font-bold', 'mt-3', 'mb-1'])}>{label}</small>}
      </div>
    </>
  );
};

export default MediaUploadButton;

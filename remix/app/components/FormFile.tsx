import { classNames } from 'primereact/utils';
import type { ChangeEvent, DragEvent } from 'react';
import { useRef } from 'react';

import { Toast } from 'primereact/toast';
import {z} from 'zod';

type FormFileProps = JSX.IntrinsicElements["input"] & {
  icon?: string;
  label?: string;
};

// zod validation less than 500KB image file
export const imageSchema = z.custom<File>().refine(
  (file) => file.size < 500000 && file.type.match(/image\/(png|jpe?g|gif)/), 
  { message: 'File must be less than 5MB and be an image' }
);
export const stringSchema = z.string().min(3).max(50);

const FormFile: React.FC<FormFileProps> = ({ icon="pi-upload", label="Upload File", ...props }: FormFileProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropareaRef = useRef<HTMLDivElement>(null);
  
  const toastRef = useRef<Toast>(null);


  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    // event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files){
      inputRef.current!.files = files;
      inputRef.current?.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('cahnged file')
    const files = event.target.files;
    const safeData = new DataTransfer();

    for (let i = 0; i < files!.length; i++) {
      const result = imageSchema.safeParse(files![i]);
      if(result.success){
        // toastRef.current?.show({ severity: 'success', summary: `${files![i].name}`, life: 3000 })
        safeData.items.add(files![i])
      }else{
        toastRef.current?.show({ severity: 'error', summary: `${files![i].name}`, detail: result.error.issues[0].message, life: 3000 })
      }
    }
  };

  const setDropAreaStyle = (activate:boolean) => {
    activate ? dropareaRef.current?.classList.add('bg-blue-100'): dropareaRef.current?.classList.remove('bg-blue-100')
  }

  const onDragOverHandler = (event:DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDropAreaStyle(true);
  }
  const onDragLeaveHandler = (event:DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDropAreaStyle(false);
  }



  return (
    <>
      <Toast ref={toastRef} position="bottom-right" />
      <input type="file" style={{ display: 'none' }} ref={inputRef} onChangeCapture={handleFileChange} {...props} />
      <div 
        onClick={handleClick} 
        onDrop={handleDrop} 
        onDragOver={onDragOverHandler}
        onDragLeave={onDragLeaveHandler} 
        onDropCapture={onDragLeaveHandler}
        onDragEnd={onDragLeaveHandler}
        className={classNames(['flex', 'flex-column', 'align-items-center', 'justify-content-center', 'hover:bg-gray-100', 'border-round', 'text-gray-800', 'border-gray-500', 'border-2','border-dashed', 'p-3', 'cursor-pointer'])} 
        style={{aspectRatio:1}} 
        ref={dropareaRef} 
      >
        {icon && <i className={classNames(['pi', icon])}  style={{fontSize: '1.2rem'}}/>}
        {label && <small className={classNames(['font-bold', 'mt-3', 'mb-1'])}>{label}</small>}
      </div>
    </>
  );
};

export default FormFile;

import { classNames } from 'primereact/utils';
import type { ChangeEvent, DragEvent } from 'react';
import { useRef } from 'react';

const FormFile: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropareaRef = useRef<HTMLDivElement>(null);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      const dt = new DataTransfer();
      dt.items.add(file);
      Object.defineProperty(inputRef.current, 'files', {
        value: dt.files,
        writable: false,
      });
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    // ファイルの処理を行う場合はここに追加する
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
      <input type="file" style={{ display: 'none' }} ref={inputRef} onChange={handleFileChange} />
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
        <i className={classNames(['pi', 'pi-upload'])}  style={{fontSize: '1.2rem'}}/>
        <small className={classNames(['font-bold', 'mt-3', 'mb-1'])}>Upload File</small>
      </div>
    </>
  );
};

export default FormFile;

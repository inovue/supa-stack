import { classNames } from "primereact/utils";
import React from "react";

export const ErrorBox:React.FC<{title?:string, description?:string}> = ({ title, description }) => {
  return (
    <div className={classNames(['flex', 'flex-column', 'align-items-center', 'bg-red-200', 'p-3', 'justify-content-center', 'text-center' ])} style={{height:'200px'}} >
      <i className={classNames(['pi', 'pi-exclamation-circle', 'text-red-600' ])} style={{fontSize:'2.5rem'}}/>
      { title && <div className={classNames(['mt-3', 'mb-1', 'text-lg', 'font-bold'])}>{title}</div> }
      { description && <div className={classNames([])} >{description}</div> }
    </div>
  );
}
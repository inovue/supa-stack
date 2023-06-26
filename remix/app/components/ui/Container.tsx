import { classNames } from "primereact/utils";

const Container: React.FC<{ children?: React.ReactNode, className?:string }> = ({ children, className='' }) => {
  return (
    <div className={classNames(['py-5','px-3','md:px-7'])+className}>
      {children}
    </div>
  );
};

export default Container;
import { Link, Outlet, useParams } from "@remix-run/react";
import Container from "~/components/ui/Container";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";


export default function Stock() {
  const {id} = useParams();
  
  return (
    <div>
      <nav className={classNames(['flex', 'align-items-center', 'mx-2', 'my-1', 'gap-2'])}>
        <Link to="/stocks">
          <Button text rounded icon="pi pi-arrow-left" size='small' aria-label="Back" />
        </Link>
        <div className={classNames(['flex-1'])}/>
        <Link to={``}>
          <Button label="Base" text className={classNames(['border-bottom-2'])}/>
        </Link>
        <Link to='images'>
          <Button label={`Image`} text />
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}

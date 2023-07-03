import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { json } from "@remix-run/node";
import { Form, Link,  useCatch, useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/services/db.server";
import { classNames } from 'primereact/utils';

import { Panel } from 'primereact/panel';
import type {PanelHeaderTemplateOptions} from 'primereact/panel';
import { Ripple } from 'primereact/ripple';
import type { DataFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";


export const loader = async ({ request, context, params }:DataFunctionArgs) => {
  const stocks = await db.stock.findMany({
    select: { id: true, title: true, content: true },
    orderBy: { id: "desc" }
  });
  return json(stocks);
};


export const action = async ({ request, context, params }:DataFunctionArgs) => {
  const method = request.method.toLowerCase();
  try{
    if(method === 'post') {
      const newStock = await db.stock.create({data: {}});
      return redirect(`/stocks/${newStock.id}/edit`);
    }else{
      throw new Error('Unknown method type');
    }
  }catch(e){
    if(e instanceof Error) return new Response(e.message, { status: 500 });
    else return new Response("Unknown error", { status: 500 });
  }
};


export default function Stocks() {
  const stocks = useLoaderData<typeof loader>();

  const panelHeader = (options:PanelHeaderTemplateOptions) => {
    const toggleIcon = `pi ${options.collapsed ? 'pi-filter' : 'pi-minus'}`;
        
    return (
      <div className={classNames(['flex', 'align-items-center', 'px-3'])}>
        <div className={classNames(['text-2xl', 'font-bold'])}>Stocks</div>
        <div className={classNames(['flex-1'])}></div>
        <div>
          <button className={options.togglerClassName} onClick={options.onTogglerClick}>
            <span className={toggleIcon} />
            <Ripple />
          </button>
        </div>
      </div>
    )
  }
  const tableHeader = () => {
    return (
      <Panel headerTemplate={panelHeader} toggleable>
        <p className="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Panel>
    )
  }

  const footer = (
    <div>{`In total there are ${stocks ? stocks.length : 0} stocks.`}</div>
  )
  const editBodyTemplate = (stock:typeof stocks[0]) => (
    <div className={classNames(['flex', 'justify-center', 'align-items-center'])}>
      <Link to={`${stock.id}/edit`}>
        <Button text rounded label='Edit' size='small' aria-label="Edit" />
      </Link>
      <Form action={`/stocks/${stock.id}/edit?index`} method='delete'>
        <Button type='submit' rounded text severity="danger" aria-label="Delete"  size='small' icon="pi pi-trash" />
      </Form>
    </div>
  )
  
  return (
    <div>
      <DataTable value={stocks} header={tableHeader} footer={footer} size='small' tableStyle={{ }}>
        <Column field="id" header="ID"  style={{width:'6rem'}}></Column>
        <Column field="title" header="Title" style={{minWidth:'20rem'}}></Column>
        <Column body={editBodyTemplate} style={{width:'4rem'}}></Column>
      </DataTable>
      <Form method='post'>
        <Button type='submit' rounded icon="pi pi-plus" className={classNames(['fixed', 'right-0', 'bottom-0', 'm-5'])} />
      </Form>
    </div>
  )
}


export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  if (caught.status === 404) {
    return (
      <div className="error-container">
        Huh? What the heck is "{params.id}"?
      </div>
    );
  }
  throw new Error(`Unhandled error: ${caught.status}`);
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  return (
    <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
  );
}



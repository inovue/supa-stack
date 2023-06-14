import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { json } from "@remix-run/node";
import { Link,  useCatch, useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/services/db.server";
import { classNames } from 'primereact/utils';


export const loader = async () => {
  const stocks = await db.stock.findMany({
    select: { id: true, title: true, content: true }
  });
  return json(stocks);
};

export default function Stocks() {
  const stocks = useLoaderData<typeof loader>();

  const header = (
    <div className={classNames(['flex', 'align-items-center', 'px-3'])}>
      <div className={classNames(['text-2xl', 'font-bold'])}>Stocks</div>
      <div className={classNames(['flex-1'])}></div>
      <Link to="create">
        <Button size='small' label='New' icon="pi pi-file" />
      </Link>
    </div>
  )
  const footer = (
    <div>{`In total there are ${stocks ? stocks.length : 0} stocks.`}</div>
  )
  const editBodyTemplate = (stock:typeof stocks[0]) => (
    <Link to={`${stock.id}/edit`}>
      <Button text label='Edit' />
    </Link>
  )
  return (
    <div>
      <DataTable value={stocks} header={header} footer={footer} size='small' tableStyle={{ }}>
        
        <Column field="id" header="ID"  style={{width:'6rem'}}></Column>
        <Column field="title" header="Title" style={{minWidth:'20rem'}}></Column>
        <Column body={editBodyTemplate} style={{width:'4rem'}}></Column>
      </DataTable>
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
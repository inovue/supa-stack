import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { json } from "@remix-run/node";
import { Link, useCatch, useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/services/db.server";


export const loader = async () => {
  const stocks = await db.stock.findMany({
    select: {
      id: true,
      title: true,
      content: true,
    }
  });
  return json(stocks);
};

export default function Subjects() {
  const stocks = useLoaderData<typeof loader>();

  const header = (
    <Link to="add">
      <Button label='Add'></Button>
    </Link>
  )
  const footer = (
    <div>{`In total there are ${stocks ? stocks.length : 0} stocks.`}</div>
  )
  const editBodyTemplate = (stock:typeof stocks[0]) => (
    <Link to={`${stock.id}/edit`}>
      <Button label='Edit' />
    </Link>
  )
  return (
    <div className="card">
      <DataTable value={stocks} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }}>
        <Column field="title" header="Title"></Column>
        <Column body={editBodyTemplate}></Column>
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
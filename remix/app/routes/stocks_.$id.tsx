import type { DataFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useCatch, useLoaderData, useParams } from "@remix-run/react";

import { validationError } from "remix-validated-form";
import { z } from "zod";

import { db } from "~/services/db.server";

import { ErrorBox } from "~/components/ErrorBox";
import { StockForm, stockFormValidator } from "~/components/StockFrom";
import Container from "~/components/Container";
import { classNames } from "primereact/utils";

import type {ActionFunction} from '@remix-run/node';
import { Button } from "primereact/button";


export const loader = async ({ params }: DataFunctionArgs) => {
  const { id } = z.object({ id: z.string() }).parse(params);

  const stock = await db.stock.findUnique({
    where: { id: +id },
    select: {id:true, title: true, content: true}
  });

  if (!stock) throw new Response(`stock ${id} doesn't exist`, { status: 404 });

  return json(stock);
};
  

export const action: ActionFunction = async ({ request, context, params }) => {
  const id = params.id;
  if(!id) return new Response('Missing id', {status: 400} );
  const method = request.method.toLowerCase();
  
  try{
    if(method === 'post') {
      const fieldValues = await stockFormValidator.validate( await request.formData() );
      if (fieldValues.error) throw validationError(fieldValues.error);
      const { ...updatedStock } = fieldValues.data;
      await db.stock.update({ where: { id: +id }, data: { ...updatedStock} });
      return redirect("/stocks");

    }else if(method === 'delete') {
      const stock = await db.stock.findUnique({where: {id: +id}});
      if(!stock) throw new Error('Stock not found');
      await db.stock.delete({where: {id: stock.id}});
      return redirect(`/stocks`);

    }else{
      throw new Error('Unknown method type');
    }
  }catch(e){
    if(e instanceof Error) return new Response(e.message, { status: 500 });
    else return new Response("Unknown error", { status: 500 });
  }
  
};

export default function EditStock() {
  const stock = useLoaderData<typeof loader>();
  return (
    <>
      <nav className={classNames(['flex', 'align-items-center', 'mx-2', 'my-1', 'gap-2'])}>
        <Link to="/stocks">
          <Button text rounded icon="pi pi-arrow-left" size='small' aria-label="Back" />
        </Link>
        <div className={classNames(['font-bold', 'text-2xl'])}>{stock.id}</div>
      </nav>
      <Container>
        <StockForm defaultValues={stock ?? undefined} />
      </Container>
    </>
  );
}


/*
export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  if (caught.status === 404) {
    return <ErrorBox title={`stock ${params.id} doesn't exist`} />;
  }
  throw new Error(`Unhandled error: ${caught.status}`);
}

export function ErrorBoundary() {
  const { id } = useParams();
  return (
    <ErrorBox title={`There was an error stock by the id ${id}. Sorry.`} />
  );
}
*/
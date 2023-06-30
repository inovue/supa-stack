import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { db } from "~/services/db.server";
import { StockForm, stockFormValidator } from "~/components/form/features/StockForm";
import { classNames } from "primereact/utils";

import type { ActionFunction, DataFunctionArgs} from '@remix-run/node';
import Container from "~/components/ui/Container";


export const loader = async ({ request, context, params }:DataFunctionArgs) => {
  
  const stockId = params.id;
  if(!stockId) throw new Response('Missing id', {status: 400} );
  if(isNaN(+stockId)) throw new Response('Invalid id', {status: 400} );
  
  const stock = await db.stock.findUnique({
    where: { id: +stockId },
    select: { id: true, title: true, content: true, 
      mediaBox:{
        select:{
          medias:{
            select:{ id:true, path:true, contentType:true, filename:true },
            where:{ contentType: {startsWith: 'image/'} }
          }
        }
      }
    }
  });

  if (!stock) throw new Response(`stock ${stockId} doesn't exist`, { status: 404 });

  return json(stock);
};


export const action = async ({ request, context, params }:DataFunctionArgs) => {
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
    <Container>
      <StockForm defaultValues={stock ?? undefined} />
    </Container>
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
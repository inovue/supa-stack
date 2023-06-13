import type { DataFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useCatch, useLoaderData, useParams } from "@remix-run/react";

import { validationError } from "remix-validated-form";
import { z } from "zod";

import { db } from "~/services/db.server";

import { ErrorBox } from "~/components/ErrorBox";
import { StockForm, stockFormValidator } from "~/components/StockFrom";
import Container from "~/components/Container";
import { classNames } from "primereact/utils";


export const loader = async ({ params }: DataFunctionArgs) => {
  const { id } = z.object({ id: z.string() }).parse(params);

  const subject = await db.stock.findUnique({
    where: { id: +id },
    select: {title: true, content: true}
  });

  if (!subject) throw new Response(`Subject ${id} doesn't exist`, { status: 404 });

  return json(subject);
};

export const action = async ({ request, params }: DataFunctionArgs) => {
  const { id } = z.object({ id: z.string() }).parse(params);
  
  const fieldValues = await stockFormValidator.validate(
    await request.formData()
  );
  if (fieldValues.error) return validationError(fieldValues.error);

  const { ...updatedStock } = fieldValues.data;

  await db.stock.update({
    where: { id: +id },
    data: { ...updatedStock},
  });

  return redirect("/stocks");
};

export default function AddStock() {
  const subject = useLoaderData<typeof loader>();
  return (
    <Container>
      <div className={classNames(['font-bold', 'text-2xl', 'mb-5'])}>Update Stock</div>
      <StockForm defaultValues={subject ?? undefined} />
    </Container>
  );
}

/*
export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  if (caught.status === 404) {
    return <ErrorBox title={`Subject ${params.id} doesn't exist`} />;
  }
  throw new Error(`Unhandled error: ${caught.status}`);
}

export function ErrorBoundary() {
  const { id } = useParams();
  return (
    <ErrorBox title={`There was an error subject by the id ${id}. Sorry.`} />
  );
}
*/
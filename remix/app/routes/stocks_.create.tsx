import type { DataFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { classNames } from "primereact/utils";
import { validationError } from "remix-validated-form";
import { StockForm, stockFormValidator } from "~/components/StockFrom";
import { db } from "~/services/db.server";

import Container from "~/components/Container";

export const action = async ({ request }: DataFunctionArgs) => {
  const fieldValues = await stockFormValidator.validate(
    await request.formData()
  );
  if (fieldValues.error) return validationError(fieldValues.error);

  const { ...newStock } = fieldValues.data;

  await db.stock.create({
    data: { ...newStock },
  });

  return redirect("/stocks");
};

export default function Create() {
  return (
    <Container >
      <div className={classNames(['font-bold', 'text-2xl', 'mb-5'])}>Create Stock</div>
      <main>
        <StockForm />
      </main>
    </Container>
  );
}
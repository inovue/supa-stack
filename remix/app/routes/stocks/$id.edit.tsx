import { Box, Container, Heading } from "@chakra-ui/react";
import { DataFunctionArgs, json, redirect } from "@remix-run/node";
import { useCatch, useLoaderData, useParams } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { ErrorBox } from "~/components/ErrorBox";
import { StockForm, stockFormValidator } from "~/components/StockFrom";
import { db } from "~/services/db.server";
import { SubjectComplete } from "~/types";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { id } = z.object({ id: z.string() }).parse(params);

  const subject = await db.stock.findUnique({
    where: { id: +id },
    include: {
      teacher: true,
      subjectDays: { orderBy: { day: "asc" } },
    },
  });

  if (!subject) {
    throw new Response(`Subject ${id} doesn't exist`, {
      status: 404,
    });
  }

  return json(subject);
};

export const action = async ({ request, params }: DataFunctionArgs) => {
  const { id } = z.object({ id: z.string() }).parse(params);

  const fieldValues = await stockFormValidator.validate(
    await request.formData()
  );
  if (fieldValues.error) return validationError(fieldValues.error);

  const { teacher, subjectDays, ...updatedSubject } = fieldValues.data;

  await db.stock.update({
    where: { id: +id },
    data: {
      ...updatedSubject,
      teacher: {
        update: teacher,
      },
      subjectDays: {
        deleteMany: {},
        create: subjectDays,
      },
    },
  });

  return redirect("/stocks");
};

export default function NewSubject() {
  const subject = useLoaderData<SubjectComplete | null>();
  return (
    <>
      <Box bg="white" pt="4" pb="4" shadow="sm">
        <Container maxW="7xl">
          <Heading size="lg" mb="0">
            Create Subject
          </Heading>
        </Container>
      </Box>

      <Box as="main" py="8" flex="1">
        <Container maxW="7xl">
          <StockForm defaultValues={subject ?? undefined} />
        </Container>
      </Box>
    </>
  );
}

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
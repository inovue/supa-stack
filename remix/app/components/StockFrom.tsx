import { Box, Button, Stack, HStack, Container, VStack } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import { SubmitButton } from "./SubmitButton";

const stockSchema = z.object({
  title: z.string().min(1, { message: "Stock Name can't be empty" }),
  content: z.string()
});

export const stockFormValidator = withZod(stockSchema);

export function StockForm({ defaultValues }: {
  defaultValues?: Partial<z.infer<typeof stockSchema>>;
}) {
  
  let navigate = useNavigate();
  

  return (
    <Box as="main" py="8" flex="1">
      <Container maxW="7xl" id="xxx">
        <Box bg="white" p="6" rounded="lg" shadow="base">
          <Box px="10" maxWidth="7xl">
            <ValidatedForm validator={stockFormValidator} defaultValues={defaultValues} method="post" noValidate >
              <Stack spacing="6" direction="column">
                <Stack direction="row" spacing="6" align="center" width="full">
                  <FormInput name="name" label="Name" isRequired />
                  <FormInput
                    name="description"
                    label="Description"
                    isRequired
                  />
                </Stack>
                <Stack direction="row" spacing="6" align="center" width="full">
                  <FormInput
                    name="teacher.name"
                    label="Teacher Name"
                    isRequired
                  />
                  <FormInput
                    name="teacher.email"
                    label="Teacher Email"
                    isRequired
                  />
                </Stack>
                <VStack width="full" spacing="6" alignItems="flex-start">
                  {daysKeys.map((key, index) => (
                    <Stack direction="row" width="full" key={key}>
                      <FormSelect
                        name={`stockDays[${index}].day`}
                        label="Stock Day"
                        isRequired
                        placeholder="Select Day"
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </FormSelect>
                      {daysKeys.length > 1 && (
                        <Box pt="8">
                          <Button
                            colorScheme="red"
                            onClick={() =>
                              setDaysKeys(
                                daysKeys.filter(
                                  (key2, index2) => index !== index2
                                )
                              )
                            }
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </Stack>
                  ))}
                  <Button
                    colorScheme="blue"
                    size="xs"
                    onClick={() =>
                      setDaysKeys([...daysKeys, Math.max(...daysKeys) + 1])
                    }
                  >
                    Add Day
                  </Button>
                </VStack>

                <HStack width="full" justifyContent="center" mt="8">
                  <SubmitButton />
                  <Button variant="outline" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                </HStack>
              </Stack>
            </ValidatedForm>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
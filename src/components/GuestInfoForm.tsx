"use client";

import { FormProps } from "@/app/[locale]/rsvp/page";
import { IUserInvite, IUserInviteSubmission } from "@/models/invite";
import { isNotEmpty } from "@/utils/validation";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Heading,
  VStack,
  Text,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Button,
  Input,
  HStack,
} from "@chakra-ui/react";
import { Field, FieldProps, useFormik } from "formik";
import { Dispatch, FC, SetStateAction } from "react";

export interface IGuestInfoFormProps {
  currentUserInvite?: IUserInvite;
  formik: ReturnType<typeof useFormik<Partial<FormProps>>>;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

const GuestInfoForm: FC<IGuestInfoFormProps> = ({
  currentUserInvite,
  formik,
  setActiveStep,
}) => {
  return (
    <VStack gap={10}>
      <Heading as="h3">
        Hey {currentUserInvite?.name} 👋, let&apos;s start with basic
        information
      </Heading>
      <Text>We promise this will be quick and easy 😉</Text>
      <FormControl>
        <VStack gap={10}>
          <Field name="isGoing" validate={isNotEmpty}>
            {({ form }: FieldProps<FormProps>) => (
              <FormControl
                isInvalid={!!form.errors.isGoing && !!form.touched.isGoing}
              >
                <FormLabel htmlFor="isGoing">
                  Are you able to join us in Vietnam?
                </FormLabel>
                <RadioGroup
                  onChange={(e) => formik.setFieldValue("isGoing", e)}
                  value={form.values.isGoing}
                >
                  <HStack gap={10}>
                    <Radio value={"true"}>Yes 💯</Radio>
                    <Radio value={"false"}>No...Sorry 😢</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
            )}
          </Field>
          {formik.values.isGoing === "true" && (
            <FormControl>
              <VStack align="flex-start" gap={6}>
                <FormLabel>
                  Nice! Are you going with a plus one? (Ignore if you are going
                  by yourself)
                </FormLabel>
                <Button
                  isDisabled={(formik.values.additionalGuests?.length ?? 0) > 0}
                  leftIcon={<AddIcon />}
                  onClick={() => {
                    formik.setFieldValue("additionalGuests", [{ name: "" }]);
                  }}
                >
                  Add Guest
                </Button>
                {formik.values.additionalGuests?.map((guest, index) => (
                  <HStack width="full" align="flex-end" key={index}>
                    <FormControl
                      isInvalid={
                        !isNotEmpty(
                          formik.values.additionalGuests?.[index].name
                        )
                      }
                    >
                      <FormLabel>Your ➕ 1 Name</FormLabel>
                      <Input
                        type="text"
                        value={guest.name}
                        onChange={(e) => {
                          formik.setFieldValue("additionalGuests", [
                            {
                              name: e.target.value,
                            },
                          ]);
                        }}
                      />
                    </FormControl>

                    <Button
                      leftIcon={<MinusIcon />}
                      onClick={() => {
                        formik.setFieldValue("additionalGuests", []);
                      }}
                    >
                      Remove
                    </Button>
                  </HStack>
                ))}
              </VStack>
            </FormControl>
          )}
          <HStack width="full" justify="space-between">
            <Button
              width="50%"
              onClick={() => {
                setActiveStep(0);
              }}
            >
              Back
            </Button>

            <Button
              width="50%"
              isDisabled={
                !isNotEmpty(formik.values.isGoing) ||
                ((formik.values.additionalGuests?.length ?? 0) > 0 &&
                  !isNotEmpty(formik.values.additionalGuests?.[0].name))
              }
              onClick={() => {
                if (formik.values.isGoing === "true") {
                  setActiveStep(2);
                } else {
                  setActiveStep(4);
                }
              }}
            >
              Next
            </Button>
          </HStack>
        </VStack>
      </FormControl>
    </VStack>
  );
};

export default GuestInfoForm;
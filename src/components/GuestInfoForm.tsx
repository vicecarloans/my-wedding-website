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
import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useMemo } from "react";

export interface IGuestInfoFormProps {
  currentUserInvite?: IUserInvite;
  formik: ReturnType<typeof useFormik<Partial<FormProps>>>;
  setActiveStep: Dispatch<SetStateAction<number>>;
  currentStep: number;
  miscStep: number;
}

const GuestInfoForm: FC<IGuestInfoFormProps> = ({
  currentUserInvite,
  formik,
  setActiveStep,
  currentStep,
  miscStep,
}) => {
  const t = useTranslations();
  const enableNextStep = useMemo(() => {
    if (formik.values.isGoing === "No") {
      return true;
    }

    const areAllFieldsFilled = [formik.values.isGoing].every(isNotEmpty);

    const guestNameNotEmpty =
      (formik.values.additionalGuests?.length ?? 0) > 0
        ? isNotEmpty(formik.values.additionalGuests?.[0].name)
        : true;

    return areAllFieldsFilled && guestNameNotEmpty;
  }, [formik.values.isGoing, formik.values.additionalGuests]);
  return (
    <VStack gap={10} maxW="4xl" minW="full">
      <Heading as="h3">
        {t("guestInfoForm.title", { name: currentUserInvite?.name })}
      </Heading>
      <Text fontSize="2xl">{t("guestInfoForm.description")}</Text>
      <FormControl>
        <VStack gap={10}>
          <Field name="isGoing" validate={isNotEmpty}>
            {({ form }: FieldProps<FormProps>) => (
              <FormControl
                isInvalid={!!form.errors.isGoing && !!form.touched.isGoing}
              >
                <FormLabel htmlFor="isGoing">
                  {t("guestInfoForm.isGoingLabel")}
                </FormLabel>
                <RadioGroup
                  onChange={(e) => formik.setFieldValue("isGoing", e)}
                  value={form.values.isGoing}
                >
                  <HStack gap={10}>
                    <Radio value={"Yes"}>
                      {t("guestInfoForm.isGoingYesAnswer")}
                    </Radio>
                    <Radio value={"No"}>
                      {t("guestInfoForm.isGoingNoAnswer")}
                    </Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
            )}
          </Field>
          {formik.values.isGoing === "Yes" && (
            <FormControl>
              <VStack align="flex-start" gap={6}>
                <FormLabel>{t("guestInfoForm.plusOneLabel")}</FormLabel>
                <Button
                  isDisabled={(formik.values.additionalGuests?.length ?? 0) > 0}
                  leftIcon={<AddIcon />}
                  onClick={() => {
                    formik.setFieldValue("additionalGuests", [{ name: "" }]);
                  }}
                >
                  {t("guestInfoForm.plusOneAdd")}
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
                      <FormLabel>{t("guestInfoForm.plusOneName")}</FormLabel>
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
                      {t("guestInfoForm.plusOneRemove")}
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
                setActiveStep(currentStep - 1);
              }}
              border="2px"
              borderColor="red.500"
              colorScheme="red"
              color="gray.900"
            >
              {t("backBtn")}
            </Button>

            <Button
              width="50%"
              isDisabled={!enableNextStep}
              onClick={() => {
                if (formik.values.isGoing === "Yes") {
                  setActiveStep(currentStep + 1);
                } else {
                  setActiveStep(miscStep);
                }
              }}
              border="2px"
              borderColor="red.500"
              colorScheme="red"
              color="gray.900"
            >
              {t("nextBtn")}
            </Button>
          </HStack>
        </VStack>
      </FormControl>
    </VStack>
  );
};

export default GuestInfoForm;

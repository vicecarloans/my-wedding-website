import { FormProps } from "@/app/[locale]/rsvp/page";
import { IUserInviteSubmission, TravelInfo } from "@/models/invite";
import { CALENDAR_DATE_FORMAT, convertToTimezone } from "@/utils/time";
import { isNotEmpty } from "@/utils/validation";
import {
  Heading,
  VStack,
  Text,
  FormControl,
  FormLabel,
  RadioGroup,
  HStack,
  Radio,
  Input,
  Select,
  Button,
  FormHelperText,
  Highlight,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputLeftAddon,
  InputGroup,
} from "@chakra-ui/react";
import { format, toDate } from "date-fns";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useState } from "react";

export interface ITravelFormProps {
  travelInfo?: TravelInfo;
  formik: ReturnType<typeof useFormik<Partial<FormProps>>>;
  currentUserSubmission: IUserInviteSubmission | undefined;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

const TravelForm: FC<ITravelFormProps> = ({
  travelInfo,
  formik,
  currentUserSubmission,
  setActiveStep,
}) => {
  const t = useTranslations("travelForm");

  const [ogTime, setOGTime] = useState<string | undefined>(
    currentUserSubmission?.flight.arrivalDateTime
  );

  const renderDomesticTravel = () => {
    const enableNextStep = [
      formik.values.flight?.reimburseAccountNumber,
      formik.values.flight?.reimburseAccountHolderName,
      formik.values.flight?.reimburseBankName,
      formik.values.flight?.reimburseAmount,
    ].every(isNotEmpty);

    return (
      <VStack gap={10}>
        <Text>{t("domestic.disclaimer")}</Text>
        <Text>{t("domestic.reimbursementDisclaimer")}</Text>
        <FormControl
          isInvalid={!isNotEmpty(formik.values.flight?.reimburseAccountNumber)}
        >
          <FormLabel htmlFor="flight.reimburseAccountNumber">
            {t("domestic.reimburseAccountNumber")}
          </FormLabel>
          <Input
            value={formik.values.flight?.reimburseAccountNumber}
            onChange={(e) =>
              formik.setFieldValue(
                "flight.reimburseAccountNumber",
                e.target.value
              )
            }
            name="flight.reimburseAccountNumber"
          />
        </FormControl>
        <FormControl
          isInvalid={
            !isNotEmpty(formik.values.flight?.reimburseAccountHolderName)
          }
        >
          <FormLabel htmlFor="flight.reimburseAccountHolderName">
            {t("domestic.reimburseAccountHolderName")}
          </FormLabel>
          <Input
            value={formik.values.flight?.reimburseAccountHolderName}
            onChange={(e) =>
              formik.setFieldValue(
                "flight.reimburseAccountHolderName",
                e.target.value
              )
            }
            name="flight.reimburseAccountHolderName"
          />
        </FormControl>
        <FormControl
          isInvalid={!isNotEmpty(formik.values.flight?.reimburseBankName)}
        >
          <FormLabel htmlFor="flight.reimburseBankName">
            {t("domestic.reimburseBankName")}
          </FormLabel>
          <Input
            value={formik.values.flight?.reimburseBankName}
            onChange={(e) =>
              formik.setFieldValue("flight.reimburseBankName", e.target.value)
            }
            name="flight.reimburseBankName"
          />
        </FormControl>
        <FormControl
          isInvalid={!isNotEmpty(formik.values.flight?.reimburseAmount)}
        >
          <FormLabel htmlFor="flight.reimburseAmount">
            {t("domestic.reimburseAmount")}
          </FormLabel>

          <NumberInput
            value={formik.values.flight?.reimburseAmount}
            onChange={(val) => {
              formik.setFieldValue("flight.reimburseAmount", val);
            }}
            defaultValue={0}
            max={2000000}
            min={0}
            name="flight.reimburseAmount"
          >
            <InputGroup>
              <InputLeftAddon>VND</InputLeftAddon>
              <NumberInputField borderRadius="none" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </InputGroup>
          </NumberInput>
        </FormControl>
        <HStack width="full" justify="space-between">
          <Button
            width="50%"
            onClick={() => {
              setActiveStep(1);
            }}
          >
            Back
          </Button>

          <Button
            width="50%"
            isDisabled={!enableNextStep}
            onClick={() => {
              setActiveStep(3);
            }}
          >
            Next
          </Button>
        </HStack>
      </VStack>
    );
  };

  const renderInternationalTravel = () => {
    const isNeededPickupFulfilled =
      formik.values.flight?.needsPickup === "Yes"
        ? [
            formik.values.flight?.flightNumber,
            formik.values.flight?.arrivalDateTime,
            formik.values.flight?.arrivalDateTimeTZ,
          ].every(isNotEmpty)
        : true;
    const enableNextStep =
      isNotEmpty(formik.values.flight?.needsPickup) && isNeededPickupFulfilled;

    return (
      <VStack gap={10} w="full">
        <FormControl isInvalid={!isNotEmpty(formik.values.flight?.needsPickup)}>
          <FormLabel htmlFor="flight.needsPickup">
            Do you need pickup at the airport?
          </FormLabel>
          <RadioGroup
            name="flight.needsPickup"
            onChange={(e) => formik.setFieldValue("flight.needsPickup", e)}
            value={formik.values.flight?.needsPickup}
          >
            <HStack gap={10}>
              <Radio value={"Yes"}>Yes</Radio>
              <Radio value={"No"}>
                No I will not need you to pick us up (Are you sure? 🤔)
              </Radio>
            </HStack>
          </RadioGroup>
        </FormControl>

        {formik.values.flight?.needsPickup === "Yes" && (
          <VStack gap={5} w="full">
            <Text>
              Great! Let us ask you a few things before we can arrange your
              pickup 🚕
            </Text>
            <FormControl
              isInvalid={!isNotEmpty(formik.values.flight?.flightNumber)}
            >
              <FormLabel htmlFor="flight.flightNumber">
                What is your flight number?
              </FormLabel>
              <Input
                onChange={(e) =>
                  formik.setFieldValue("flight.flightNumber", e.target.value)
                }
                value={formik.values.flight?.flightNumber}
                name="flight.flightNumber"
              />
            </FormControl>
            <FormControl
              isInvalid={
                !isNotEmpty(
                  formik.values.flight?.arrivalDateTime,
                  formik.values.flight?.arrivalDateTimeTZ
                )
              }
            >
              <Text>What is your exact arrival date time?</Text>
              <VStack gap={5}>
                <Select
                  value={formik.values.flight?.arrivalDateTimeTZ}
                  onChange={(e) => {
                    formik.setFieldValue(
                      "flight.arrivalDateTimeTZ",
                      e.target.value
                    );
                    if (formik.values.flight?.arrivalDateTime) {
                      formik.setFieldValue(
                        "flight.arrivalDateTime",
                        convertToTimezone(
                          `${ogTime}:00 ${e.target.value}`,
                          "Asia/Ho_Chi_Minh"
                        )
                      );
                    }
                  }}
                  placeholder="Select timezone shown in your ticket"
                >
                  <option value="Asia/Ho_Chi_Minh">Vietnamese Timezone</option>
                  <option value="Canada/Eastern">
                    Eastern Timezone (PDT/PST)
                  </option>
                </Select>
                {formik.values.flight?.arrivalDateTimeTZ && (
                  <Input
                    placeholder="Select datetime shown in your ticket"
                    size="md"
                    type="datetime-local"
                    value={
                      ogTime
                        ? convertToTimezone(
                            ogTime,
                            formik.values.flight?.arrivalDateTimeTZ,
                            CALENDAR_DATE_FORMAT
                          )
                        : formik.values.flight?.arrivalDateTime
                        ? convertToTimezone(
                            formik.values.flight?.arrivalDateTime,
                            formik.values.flight?.arrivalDateTimeTZ,
                            CALENDAR_DATE_FORMAT
                          )
                        : undefined
                    }
                    onChange={(e) => {
                      setOGTime(e.target.value);
                      console.log(e.target.value);
                      formik.setFieldValue(
                        "flight.arrivalDateTime",
                        convertToTimezone(
                          `${e.target.value}:00 ${formik.values.flight?.arrivalDateTimeTZ}`,
                          "Asia/Ho_Chi_Minh"
                        )
                      );
                    }}
                    name="flight.arrivalDateTimeTZ"
                  />
                )}
                {formik.values.flight?.arrivalDateTime && (
                  <FormHelperText fontSize={22}>
                    We will see you:{" "}
                    <Highlight
                      query="spotlight"
                      styles={{ px: "1", py: "1", bg: "orange.100" }}
                    >
                      {convertToTimezone(
                        formik.values.flight?.arrivalDateTime,
                        "Asia/Ho_Chi_Minh",
                        "EEEE, LLLL do, yyyy 'at' h:mm aaaa OOOO"
                      )}
                    </Highlight>
                  </FormHelperText>
                )}
              </VStack>
            </FormControl>
          </VStack>
        )}

        <HStack width="full" justify="space-between">
          <Button
            width="50%"
            onClick={() => {
              setActiveStep(1);
            }}
          >
            Back
          </Button>

          <Button
            width="50%"
            isDisabled={!enableNextStep}
            onClick={() => {
              setActiveStep(3);
            }}
          >
            Next
          </Button>
        </HStack>
      </VStack>
    );
  };
  return (
    <VStack gap={10} maxW="4xl" minW="full">
      <Heading as="h3">Awesome 😊, we are so glad that you can make it</Heading>
      <Text>Can you let us know about your travel plan?</Text>
      {travelInfo === "international" && renderInternationalTravel()}
      {travelInfo === "domestic" && renderDomesticTravel()}
    </VStack>
  );
};

export default TravelForm;

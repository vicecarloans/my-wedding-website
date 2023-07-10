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
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useState } from "react";

export interface ITravelFormProps {
  travelInfo?: TravelInfo;
  formik: ReturnType<typeof useFormik<Partial<FormProps>>>;
  currentUserSubmission: IUserInviteSubmission | undefined;
  setActiveStep: Dispatch<SetStateAction<number>>;
  currentStep: number;
}

const TravelForm: FC<ITravelFormProps> = ({
  travelInfo,
  formik,
  currentUserSubmission,
  setActiveStep,
  currentStep,
}) => {
  const t = useTranslations("travelForm");
  const tBasic = useTranslations();
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
              setActiveStep(currentStep - 1);
            }}
            border="2px"
            borderColor="red.500"
            colorScheme="red"
            color="gray.900"
          >
            {tBasic("backBtn")}
          </Button>

          <Button
            width="50%"
            isDisabled={!enableNextStep}
            onClick={() => {
              setActiveStep(currentStep + 1);
            }}
            border="2px"
            borderColor="red.500"
            colorScheme="red"
            color="gray.900"
          >
            {tBasic("nextBtn")}
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
            {t("international.airportPickupLabel")}
          </FormLabel>
          <RadioGroup
            name="flight.needsPickup"
            onChange={(e) => formik.setFieldValue("flight.needsPickup", e)}
            value={formik.values.flight?.needsPickup}
          >
            <HStack gap={10}>
              <Radio value={"Yes"}>
                {t("international.airportPickupYesAnswer")}
              </Radio>
              <Radio value={"No"}>
                {t("international.airportPickupNoAnswer")}
              </Radio>
            </HStack>
          </RadioGroup>
        </FormControl>

        {formik.values.flight?.needsPickup === "Yes" && (
          <VStack gap={5} w="full">
            <Text fontSize="xl">{t("international.pickupFollowupLabel")}</Text>
            <FormControl
              isInvalid={!isNotEmpty(formik.values.flight?.flightNumber)}
            >
              <FormLabel htmlFor="flight.flightNumber">
                {t("international.pickupFlightNumberLabel")}
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
              <FormLabel>
                {t("international.pickupFlightArrivalLabel")}
              </FormLabel>
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
                  placeholder={t("international.timezonePlaceholder")}
                >
                  <option value="Asia/Ho_Chi_Minh">
                    {t("international.vietnameseTimezoneAnswer")}
                  </option>
                  <option value="Canada/Eastern">
                    {t("international.easternTimezoneAnswer")}
                  </option>
                </Select>
                {formik.values.flight?.arrivalDateTimeTZ && (
                  <Input
                    placeholder={t("international.arrivalDateTimePlaceholder")}
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
                    {t("international.arrivalDateTimeConfirmation")}
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
              setActiveStep(currentStep - 1);
            }}
            border="2px"
            borderColor="red.500"
            colorScheme="red"
            color="gray.900"
          >
            {tBasic("backBtn")}
          </Button>

          <Button
            isDisabled={!enableNextStep}
            onClick={() => {
              setActiveStep(currentStep + 1);
            }}
            width="50%"
            border="2px"
            borderColor="red.500"
            colorScheme="red"
            color="gray.900"
          >
            {tBasic("nextBtn")}
          </Button>
        </HStack>
      </VStack>
    );
  };
  return (
    <VStack gap={10} maxW="4xl" minW="full">
      <Heading as="h3">{t("title")}</Heading>
      <Text fontSize="2xl">{t("description")}</Text>
      {travelInfo === "international" && renderInternationalTravel()}
      {travelInfo === "domestic" && renderDomesticTravel()}
    </VStack>
  );
};

export default TravelForm;

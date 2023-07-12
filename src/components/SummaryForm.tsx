import { FormProps } from "@/app/[locale]/rsvp/page";
import { TravelInfo } from "@/models/invite";
import { convertToTimezone } from "@/utils/time";
import {
  HStack,
  Heading,
  StackDivider,
  VStack,
  Text,
  Button,
  Stack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction } from "react";

export interface ISummaryFormProps {
  formik: ReturnType<typeof useFormik<Partial<FormProps>>>;
  setActiveStep: Dispatch<SetStateAction<number>>;
  travelInfo?: TravelInfo;
  currentStep: number;
  eligibleForReimbursement?: boolean;
}

const SummaryForm: FC<ISummaryFormProps> = ({
  formik,
  setActiveStep,
  travelInfo,
  currentStep,
  eligibleForReimbursement,
}) => {
  const t = useTranslations("summaryForm");
  const tRoot = useTranslations();

  const renderReimbursement = () => {
    if (!eligibleForReimbursement) {
      return null;
    }
    return (
      <VStack
        justify="flex-start"
        align="flex-start"
        divider={<StackDivider />}
        w="full"
        spacing={6}
      >
        {travelInfo === "international" ? (
          <VStack spacing={6} divider={<StackDivider />} w="full">
            <Stack
              direction={{ base: "column", lg: "row" }}
              justify={{ base: "center", lg: "space-between" }}
              w="full"
            >
              <Text fontSize="xl" as="b">
                {t("going.pickUpAtAirportLabel")}
              </Text>
              <Text fontSize="xl">{formik.values.flight?.needsPickup}</Text>
            </Stack>
            {formik.values.flight?.needsPickup && (
              <Stack
                direction={{ base: "column", lg: "row" }}
                justify={{ base: "center", lg: "space-between" }}
                w="full"
              >
                <Text fontSize="xl" as="b">
                  {t("going.flightNumberLabel")}
                </Text>
                <Text fontSize="xl">{formik.values.flight?.flightNumber}</Text>
              </Stack>
            )}
            {formik.values.flight?.needsPickup && (
              <Stack
                direction={{ base: "column", lg: "row" }}
                justify={{ base: "center", lg: "space-between" }}
                w="full"
              >
                <Text fontSize="xl" as="b">
                  {t("going.arrivalDateLabel")}
                </Text>
                <Text fontSize="xl">
                  {convertToTimezone(
                    formik.values.flight?.arrivalDateTime,
                    "Asia/Ho_Chi_Minh",
                    "EEEE, LLLL do, yyyy 'at' h:mm aaaa OOOO"
                  )}
                </Text>
              </Stack>
            )}
          </VStack>
        ) : (
          <VStack spacing={6} divider={<StackDivider />} w="full">
            <Stack
              direction={{ base: "column", lg: "row" }}
              justify={{ base: "center", lg: "space-between" }}
              w="full"
            >
              <Text fontSize="xl" as="b">
                {t("going.reimburseAccountNumberLabel")}
              </Text>
              <Text fontSize="xl">
                {formik.values.flight?.reimburseAccountNumber}
              </Text>
            </Stack>
            <Stack
              direction={{ base: "column", lg: "row" }}
              justify={{ base: "center", lg: "space-between" }}
              w="full"
            >
              <Text fontSize="xl" as="b">
                {t("going.reimburseAccountHolderNameLabel")}
              </Text>
              <Text fontSize="xl">
                {formik.values.flight?.reimburseAccountHolderName}
              </Text>
            </Stack>
            <Stack
              direction={{ base: "column", lg: "row" }}
              justify={{ base: "center", lg: "space-between" }}
              w="full"
            >
              <Text fontSize="xl" as="b">
                {t("going.reimburseBankNameLabel")}
              </Text>
              <Text fontSize="xl">
                {formik.values.flight?.reimburseBankName}
              </Text>
            </Stack>
            <Stack
              direction={{ base: "column", lg: "row" }}
              justify={{ base: "center", lg: "space-between" }}
              w="full"
            >
              <Text fontSize="xl" as="b">
                {t("going.reimburseAmountLabel")}
              </Text>
              <Text fontSize="xl">
                {formik.values.flight?.reimburseAmount} VNĐ
              </Text>
            </Stack>
          </VStack>
        )}

        <Stack
          direction={{ base: "column", lg: "row" }}
          justify={{ base: "center", lg: "space-between" }}
          w="full"
        >
          <Text fontSize="xl" as="b">
            {t("going.needsTransportLabel")}
          </Text>
          <Text fontSize="xl">{formik.values.hotel?.needsTransport}</Text>
        </Stack>
        <Stack
          direction={{ base: "column", lg: "row" }}
          justify={{ base: "center", lg: "space-between" }}
          w="full"
        >
          <Text fontSize="xl" as="b">
            {t("going.stayFromLabel")}
          </Text>
          <Text fontSize="xl">{formik.values.hotel?.stayFrom}</Text>
        </Stack>
        <Stack
          direction={{ base: "column", lg: "row" }}
          justify={{ base: "center", lg: "space-between" }}
          w="full"
        >
          <Text fontSize="xl" as="b">
            {t("going.stayToLabel")}
          </Text>
          <Text fontSize="xl">{formik.values.hotel?.stayTo}</Text>
        </Stack>
        {formik.values.hotel?.proposedStayTo && (
          <Stack
            direction={{ base: "column", lg: "row" }}
            justify={{ base: "center", lg: "space-between" }}
            w="full"
          >
            <Text fontSize="xl" as="b">
              {t("going.proposedStay")}
            </Text>
            <Text fontSize="xl">{formik.values.hotel?.proposedStayTo}</Text>
          </Stack>
        )}
      </VStack>
    );
  };
  const renderGoingSummary = () => {
    return (
      <VStack
        spacing={6}
        divider={<StackDivider />}
        w={{ base: "xs", lg: "full" }}
      >
        <Text fontSize="2xl" as="b">
          {t("going.title")}
        </Text>

        {(formik.values.additionalGuests?.length ?? 0) > 0 && (
          <Stack
            direction={{ base: "column", xl: "row" }}
            justify={{ base: "center", lg: "space-between" }}
            w="full"
          >
            <Text fontSize="xl" as="b">
              {t("going.plusOneLabel")}
            </Text>
            <Text fontSize="xl">
              {formik.values.additionalGuests?.[0].name}
            </Text>
          </Stack>
        )}
        {renderReimbursement()}
        <Stack
          direction={{ base: "column", lg: "row" }}
          justify={{ base: "center", lg: "space-between" }}
          w="full"
        >
          <Text fontSize="xl" as="b" minW="xs">
            {t("going.wishesLabel")}
          </Text>
          <Text fontSize="xl" overflowWrap="break-word" maxW="lg">
            {formik.values.wishes ?? ""}
          </Text>
        </Stack>
      </VStack>
    );
  };

  const renderNotGoingSummary = () => {
    return (
      <VStack
        spacing={10}
        divider={<StackDivider />}
        w={{ base: "xs", lg: "full" }}
      >
        <Text fontSize="2xl" as="b">
          {t("notGoing.title")}
        </Text>
        <Stack
          direction={{ base: "column", lg: "row" }}
          justify={{ base: "center", lg: "space-between" }}
          w="full"
        >
          <Text fontSize="xl" as="b" minW="xs">
            {t("going.wishesLabel")}
          </Text>
          <Text fontSize="xl" overflowWrap="break-word" maxW="lg">
            {formik.values.wishes ?? ""}
          </Text>
        </Stack>
      </VStack>
    );
  };

  return (
    <VStack gap={10} maxW="4xl" minW={{ base: "full", lg: "4xl" }}>
      <Heading as="h3">{t("title")}</Heading>

      {formik.values.isGoing === "Yes"
        ? renderGoingSummary()
        : renderNotGoingSummary()}

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
          {tRoot("backBtn")}
        </Button>

        <Button
          width="50%"
          onClick={() => {
            formik.submitForm();
          }}
          border="2px"
          borderColor="red.500"
          colorScheme="red"
          color="gray.900"
        >
          {tRoot("nextBtn")}
        </Button>
      </HStack>
    </VStack>
  );
};

export default SummaryForm;

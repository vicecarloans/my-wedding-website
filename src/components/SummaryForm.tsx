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
}

const SummaryForm: FC<ISummaryFormProps> = ({
  formik,
  setActiveStep,
  travelInfo,
}) => {
  const t = useTranslations("summaryForm");

  const renderGoingSummary = () => {
    return (
      <VStack
        spacing={6}
        divider={<StackDivider />}
        w={{ base: "xs", lg: "full" }}
      >
        <Text fontSize="xl" as="b">
          You have confirmed that you are going
        </Text>

        {(formik.values.additionalGuests?.length ?? 0) > 0 && (
          <Stack
            direction={{ base: "column", xl: "row" }}
            justify={{ base: "center", lg: "space-between" }}
            w="full"
          >
            <Text fontSize="xl" as="b">
              Your plus one name{" "}
            </Text>
            <Text fontSize="xl">
              {formik.values.additionalGuests?.[0].name}
            </Text>
          </Stack>
        )}
        {travelInfo === "international" ? (
          <VStack spacing={6} divider={<StackDivider />} w="full">
            <Stack
              direction={{ base: "column", lg: "row" }}
              justify={{ base: "center", lg: "space-between" }}
              w="full"
            >
              <Text fontSize="xl" as="b">
                Pick up at airport{" "}
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
                  Flight Number{" "}
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
                  Arrive At{" "}
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
                Reimburse Account Number{" "}
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
                Reimburse Account Holder Name{" "}
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
                Reimburse Bank Name{" "}
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
                Reimburse Amount{" "}
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
            Need a ride to venue{" "}
          </Text>
          <Text fontSize="xl">{formik.values.hotel?.needsTransport}</Text>
        </Stack>
        <Stack
          direction={{ base: "column", lg: "row" }}
          justify={{ base: "center", lg: "space-between" }}
          w="full"
        >
          <Text fontSize="xl" as="b">
            Stay From{" "}
          </Text>
          <Text fontSize="xl">{formik.values.hotel?.stayFrom}</Text>
        </Stack>
        <Stack
          direction={{ base: "column", lg: "row" }}
          justify={{ base: "center", lg: "space-between" }}
          w="full"
        >
          <Text fontSize="xl" as="b">
            Stay To{" "}
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
              We will book your stay until{" "}
            </Text>
            <Text fontSize="xl">{formik.values.hotel?.proposedStayTo}</Text>
          </Stack>
        )}

        <Stack
          direction={{ base: "column", lg: "row" }}
          justify={{ base: "center", lg: "space-between" }}
          w="full"
        >
          <Text fontSize="xl" as="b" minW="xs">
            Wishes / Advices for us
          </Text>
          <Text fontSize="xl">{formik.values.wishes ?? ""}</Text>
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
        <Text fontSize="xl" as="b">
          You have confirmed that you are not going
        </Text>
        <Stack
          direction={{ base: "column", lg: "row" }}
          justify={{ base: "center", lg: "space-between" }}
          w="full"
        >
          <Text fontSize="xl" as="b" minW="xs">
            Wishes/Advices for us
          </Text>
          <Text fontSize="xl">{formik.values.wishes ?? ""}</Text>
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
            setActiveStep(4);
          }}
          border="2px"
          borderColor="red.500"
          colorScheme="red"
          color="gray.900"
        >
          Back
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
          Submit
        </Button>
      </HStack>
    </VStack>
  );
};

export default SummaryForm;

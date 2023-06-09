import { FormProps } from "@/app/[locale]/rsvp/page";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction } from "react";

export interface IMiscFormProps {
  formik: ReturnType<typeof useFormik<Partial<FormProps>>>;
  setActiveStep: Dispatch<SetStateAction<number>>;
  currentStep: number;
  guestInfoStep: number;
}

const MiscForm: FC<IMiscFormProps> = ({
  formik,
  setActiveStep,
  currentStep,
  guestInfoStep,
}) => {
  const t = useTranslations("miscForm");
  const length = formik.values.wishes?.length ?? 0;
  return (
    <VStack gap={10} maxW="4xl" minW={{ base: "full", lg: "4xl" }}>
      <Heading as="h3">Alright! One last step 😬</Heading>

      <FormControl w="full">
        <FormLabel htmlFor="wishes">{t("wishesLabel")}</FormLabel>
        <Textarea
          placeholder={t("wishesPlaceholder")}
          value={formik.values.wishes}
          onChange={(e) => formik.setFieldValue("wishes", e.target.value)}
          size="md"
          w="full"
          resize="vertical"
        />
        <FormHelperText fontSize="lg">
          {length > 0 && length < 300 && t("wishesFeedback1")}
          {length >= 300 && length < 500 && t("wishesFeedback2")}
          {length >= 500 && t("wishesFeedback3")}
        </FormHelperText>
      </FormControl>
      <HStack width="full" justify="space-between">
        <Button
          width="50%"
          onClick={() => {
            if (formik.values.isGoing === "No") {
              setActiveStep(guestInfoStep);
            } else {
              setActiveStep(currentStep - 1);
            }
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
            setActiveStep(currentStep + 1);
          }}
          border="2px"
          borderColor="red.500"
          colorScheme="red"
          color="gray.900"
        >
          Next
        </Button>
      </HStack>
    </VStack>
  );
};

export default MiscForm;

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
}

const MiscForm: FC<IMiscFormProps> = ({ formik, setActiveStep }) => {
  const t = useTranslations("miscForm");
  const length = formik.values.wishes?.length ?? 0;
  return (
    <VStack gap={10} maxW="4xl" minW="2xl">
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
          {length > 0 && length < 50 && t("wishesFeedback1")}
          {length >= 50 && length < 100 && t("wishesFeedback2")}
          {length >= 100 && length < 300 && t("wishesFeedback3")}
          {length >= 300 && length < 500 && t("wishesFeedback4")}
          {length >= 500 && t("wishesFeedback5")}
        </FormHelperText>
      </FormControl>
      <HStack width="full" justify="space-between">
        <Button
          width="50%"
          onClick={() => {
            if (formik.values.isGoing === "No") {
              setActiveStep(1);
            } else {
              setActiveStep(3);
            }
          }}
        >
          Back
        </Button>

        <Button
          width="50%"
          onClick={() => {
            setActiveStep(5);
          }}
        >
          Next
        </Button>
      </HStack>
    </VStack>
  );
};

export default MiscForm;

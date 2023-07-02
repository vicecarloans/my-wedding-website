import { FormProps } from "@/app/[locale]/rsvp/page";
import { IUserInviteSubmission } from "@/models/invite";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useEffect, useMemo } from "react";
import {
  Heading,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Alert,
  AlertIcon,
  RadioGroup,
  HStack,
  Radio,
  Button,
} from "@chakra-ui/react";
import { isNotEmpty } from "@/utils/validation";
import {
  addDays,
  differenceInCalendarDays,
  differenceInDays,
  format,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";
import { DEFAULT_DATE_FORMAT, HUMAN_READABLE_DATE_FORMAT } from "@/utils/time";

export interface IAccomodationFormProps {
  formik: ReturnType<typeof useFormik<Partial<FormProps>>>;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

const AccomodationForm: FC<IAccomodationFormProps> = ({
  formik,
  setActiveStep,
}) => {
  const t = useTranslations("accomodationForm");
  const enableNextStep = useMemo(() => {
    const areAllFieldsFilled = [
      formik.values.hotel?.needsTransport,
      formik.values.hotel?.stayFrom,
      formik.values.hotel?.stayTo,
    ].every(isNotEmpty);

    const toAfterFrom = isAfter(
      parseISO(formik.values.hotel?.stayTo!),
      parseISO(formik.values.hotel?.stayFrom!)
    );

    return areAllFieldsFilled && toAfterFrom;
  }, [
    formik.values.hotel?.needsTransport,
    formik.values.hotel?.stayFrom,
    formik.values.hotel?.stayTo,
  ]);

  const verdict = useMemo(() => {
    if (!formik.values.hotel?.stayFrom || !formik.values.hotel?.stayTo)
      return null;

    const daysStay =
      differenceInCalendarDays(
        parseISO(formik.values.hotel?.stayTo),
        parseISO(formik.values.hotel?.stayFrom)
      ) + 1; // Including hotel check in date

    if (daysStay < 0) return null;

    return {
      daysCovered: Math.min(daysStay, 5),
      overStay: daysStay > 5,
      proposedCheckoutDate:
        daysStay > 5
          ? addDays(parseISO(formik.values.hotel?.stayFrom), 4)
          : parseISO(formik.values.hotel?.stayTo),
    };
  }, [formik.values.hotel?.stayFrom, formik.values.hotel?.stayTo]);

  useEffect(() => {
    if (verdict?.proposedCheckoutDate) {
      formik.setFieldValue(
        "hotel.proposedStayTo",
        format(verdict?.proposedCheckoutDate, DEFAULT_DATE_FORMAT)
      );
    }
  }, [verdict?.proposedCheckoutDate]);

  console.log(verdict?.proposedCheckoutDate);
  return (
    <VStack gap={10} maxW="4xl" minW="2xl">
      <Heading as="h3">Just a few more to go 🤗</Heading>
      <Text>
        As you might have known, we intend to travel your cost hotel cost. Let
        us know how long you would intend to stay
      </Text>
      <FormControl isInvalid={!isNotEmpty(formik.values.hotel?.needsTransport)}>
        <FormLabel htmlFor="hotel.needsTransport">
          {t("transportLabel")}
        </FormLabel>
        <RadioGroup
          name="hotel.needsTransport"
          onChange={(e) => formik.setFieldValue("hotel.needsTransport", e)}
          value={formik.values.hotel?.needsTransport}
        >
          <HStack gap={10}>
            <Radio value={"Yes"}>Yes</Radio>
            <Radio value={"No"}>
              No I have drivers license and I can ride motorbike (Are you sure?
              🤔)
            </Radio>
          </HStack>
        </RadioGroup>
      </FormControl>
      <FormControl
        isInvalid={
          !isNotEmpty(formik.values.hotel?.stayFrom) && formik.touched.hotel
        }
      >
        <FormLabel htmlFor="hotel.stayFrom">{t("stayFromLabel")}</FormLabel>
        <Input
          placeholder={t("stayFromPlaceholder")}
          size="md"
          type="date"
          value={formik.values.hotel?.stayFrom}
          onChange={(e) => {
            formik.setFieldValue(
              "hotel.stayFrom",
              format(parseISO(e.target.value), DEFAULT_DATE_FORMAT)
            );
          }}
        />
      </FormControl>
      <FormControl
        isInvalid={
          !isNotEmpty(formik.values.hotel?.stayTo) &&
          formik.touched.hotel &&
          isBefore(
            parseISO(formik.values.hotel?.stayTo!),
            parseISO(formik.values.hotel?.stayFrom!)
          )
        }
      >
        <FormLabel htmlFor="hotel.stayTo">{t("stayToLabel")}</FormLabel>
        <Input
          placeholder={t("stayToPlaceholder")}
          size="md"
          type="date"
          value={formik.values.hotel?.stayTo}
          onChange={(e) => {
            formik.setFieldValue(
              "hotel.stayTo",
              format(parseISO(e.target.value), DEFAULT_DATE_FORMAT)
            );
          }}
        />
      </FormControl>
      {verdict && (
        <Alert maxW="3xl" status={verdict.overStay ? "warning" : "info"}>
          <AlertIcon />
          {verdict?.overStay
            ? t("verdictOverstay", {
                stayFrom: format(
                  parseISO(formik.values.hotel?.stayFrom!),
                  HUMAN_READABLE_DATE_FORMAT
                ),
                proposedStayTo: format(
                  verdict.proposedCheckoutDate!,
                  HUMAN_READABLE_DATE_FORMAT
                ),
              })
            : t("verdictGood")}
        </Alert>
      )}

      <HStack width="full" justify="space-between">
        <Button
          width="50%"
          onClick={() => {
            setActiveStep(2);
          }}
        >
          Back
        </Button>

        <Button
          width="50%"
          isDisabled={!enableNextStep}
          onClick={() => {
            setActiveStep(4);
          }}
        >
          Next
        </Button>
      </HStack>
    </VStack>
  );
};

export default AccomodationForm;

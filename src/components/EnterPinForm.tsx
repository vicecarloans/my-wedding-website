"use client";

import {
  Heading,
  VStack,
  Text,
  HStack,
  FormControl,
  PinInput,
  PinInputField,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction } from "react";

export interface IEnterPinFormProps {
  isCodeInvalid: boolean;
  handleComplete: (value: string) => void;
  handleChange: () => void;
  showEditPinForm: boolean;
  setActiveStep: Dispatch<SetStateAction<number>>;
  currentStep: number;
}

const EnterPinForm: FC<IEnterPinFormProps> = ({
  isCodeInvalid,
  handleComplete,
  handleChange,
  setActiveStep,
  showEditPinForm,
  currentStep,
}) => {
  const t = useTranslations("pinForm");
  return (
    <VStack gap={10} maxW="4xl" minW="full">
      <Heading as="h3">{t("title")}</Heading>
      <Text fontSize="2xl">{t("description")}</Text>
      <FormControl isInvalid={isCodeInvalid}>
        <VStack>
          <HStack spacing={2}>
            <PinInput
              type="alphanumeric"
              onComplete={handleComplete}
              onChange={handleChange}
            >
              <PinInputField borderColor="blue.300" />
              <PinInputField borderColor="blue.300" />
              <PinInputField borderColor="blue.300" />
              <PinInputField borderColor="blue.300" />
              <PinInputField borderColor="blue.300" />
              <PinInputField borderColor="blue.300" />
            </PinInput>
          </HStack>
          {isCodeInvalid && <FormErrorMessage>{t("error")}</FormErrorMessage>}
        </VStack>
      </FormControl>

      {showEditPinForm && (
        <VStack>
          <Text fontSize="xl">{t("rsvpDoneTitle")}</Text>
          <Button
            border="2px"
            borderColor="red.500"
            colorScheme="red"
            color="gray.900"
            onClick={() => setActiveStep(currentStep + 1)}
          >
            {t("rsvpEditButton")}
          </Button>
        </VStack>
      )}
    </VStack>
  );
};

export default EnterPinForm;

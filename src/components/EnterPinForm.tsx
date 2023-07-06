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
import { Dispatch, FC, SetStateAction } from "react";

export interface IEnterPinFormProps {
  isCodeInvalid: boolean;
  handleComplete: (value: string) => void;
  handleChange: () => void;
  showEditPinForm: boolean;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

const EnterPinForm: FC<IEnterPinFormProps> = ({
  isCodeInvalid,
  handleComplete,
  handleChange,
  setActiveStep,
  showEditPinForm,
}) => {
  return (
    <VStack gap={10} maxW="4xl" minW="full">
      <Heading as="h3">Hey 👋, thanks for taking the time to rsvp</Heading>
      <Text fontSize="2xl">
        Let&apos;s get started with your invitation code. It contains 6
        alphanumberic (text + number) values and you can find this in the invite
        letter
      </Text>
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
          {isCodeInvalid && (
            <FormErrorMessage>
              Code is invalid. Please try again or reach out to us
            </FormErrorMessage>
          )}
        </VStack>
      </FormControl>

      {showEditPinForm && (
        <VStack>
          <Text fontSize="xl">It looks like you have already RSVP-ed</Text>
          <Button
            border="2px"
            borderColor="red.500"
            colorScheme="red"
            color="gray.900"
            onClick={() => setActiveStep(1)}
          >
            I want to edit my RSVP information
          </Button>
        </VStack>
      )}
    </VStack>
  );
};

export default EnterPinForm;

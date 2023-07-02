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
} from "@chakra-ui/react";
import { FC } from "react";

export interface IEnterPinFormProps {
  isCodeInvalid: boolean;
  handleComplete: (value: string) => void;
  handleChange: () => void;
}

const EnterPinForm: FC<IEnterPinFormProps> = ({
  isCodeInvalid,
  handleComplete,
  handleChange,
}) => {
  return (
    <VStack gap={10} maxW="4xl" minW="2xl">
      <Heading as="h3">Hey 👋, thanks for taking the time to rsvp</Heading>
      <Text>
        Let&apos;s get started with your invitation code. It contains 6
        alphanumberic (text + number) values and you can find this in the invite
        letter
      </Text>
      <HStack>
        <FormControl isInvalid={isCodeInvalid}>
          <PinInput
            type="alphanumeric"
            onComplete={handleComplete}
            onChange={handleChange}
          >
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
          {isCodeInvalid && (
            <FormErrorMessage>
              Code is invalid. Please try again or reach out to us
            </FormErrorMessage>
          )}
        </FormControl>
      </HStack>
    </VStack>
  );
};

export default EnterPinForm;

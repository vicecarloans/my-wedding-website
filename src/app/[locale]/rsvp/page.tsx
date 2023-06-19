"use client";

import {
  IGetInviteResponse,
  IUserInvite,
  IUserInviteSubmission,
} from "@/models/invite";
import { useCallback, useRef, useState } from "react";
import useSWR, { Fetcher, useSWRConfig } from "swr";
import { useIsomorphicLayoutEffect, useLocalStorage } from "usehooks-ts";
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Text,
  Box,
  Container,
  Flex,
  HStack,
  Heading,
  VStack,
  PinInput,
  PinInputField,
  useDisclosure,
  ModalOverlay,
  Modal,
  Center,
  Spinner,
  ModalContent,
  FormControl,
  FormErrorMessage,
  FormLabel,
  RadioGroup,
  Radio,
  Button,
  Input,
} from "@chakra-ui/react";
import {
  useFormik,
  Field,
  FormikProps,
  FieldProps,
  FormikProvider,
} from "formik";
import axios, { AxiosError } from "axios";
import { AddIcon } from "@chakra-ui/icons";

const STEPS = [
  { title: "Invite", description: "Enter your invite code" },
  { title: "Guests Information", description: "Let us know who's coming" },
  { title: "Travel Information", description: "Let us know your travel plans" },
  {
    title: "Accomodation",
    description: "Let us know your preference of accomodation",
  },
  { title: "Miscellaneous", description: "We would love to hear from you" },
  { title: "Done", description: "You're all set!" },
];

export type FormProps = Omit<IUserInviteSubmission, "inviteId">;

export default function RSVP() {
  const [currentUserInvite, setCurrentUserInvite] = useLocalStorage<
    IUserInvite | undefined
  >("current-user-invite", undefined);

  const [currentUserSubmission, setCurrentUserSubmission] = useLocalStorage<
    IUserInviteSubmission | undefined
  >("current-user-submission", undefined);

  const [inviteId, setInviteId] = useState(currentUserInvite?.id);

  const { fetcher } = useSWRConfig();

  const { data, mutate, isLoading, error } = useSWR<IGetInviteResponse>(
    inviteId?.length === 6 ? ["/api/invites", inviteId] : null,
    ([url, id]: [string, string]) =>
      (fetcher as Fetcher<IGetInviteResponse, string>)?.(`${url}/${id}`)
  );

  const { activeStep, setActiveStep } = useSteps({
    index: inviteId ? 1 : 0,
    count: STEPS.length,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);

  const [isCodeInvalid, setCodeInvalid] = useState<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    if (isLoading) {
      onOpen();
    } else {
      onClose();
    }
  }, [isLoading]);

  useIsomorphicLayoutEffect(() => {
    setCurrentUserInvite(data?.invite);
    if (data?.invite?.id) {
      setActiveStep(1);
    }
  }, [data?.invite]);

  useIsomorphicLayoutEffect(() => {
    setCurrentUserSubmission(data?.inviteSubmission);
  }, [data?.inviteSubmission]);

  useIsomorphicLayoutEffect(() => {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        setCodeInvalid(true);
      }
    }
  }, [error]);

  const isRequired = (value: unknown) => {
    return value !== undefined && value !== null && value !== "";
  };

  const formik = useFormik({
    initialValues: {
      isGoing: currentUserSubmission?.isGoing,
      additionalGuests: currentUserSubmission?.additionalGuests,
      flight: {
        flightNumber: currentUserSubmission?.flight?.flightNumber,
        arrivalDateTime: currentUserSubmission?.flight?.arrivalDateTime,
        needsPickup: currentUserSubmission?.flight?.needsPickup,
      },
      hotel: {
        stayFrom: currentUserSubmission?.hotel?.stayFrom,
        stayTo: currentUserSubmission?.hotel?.stayTo,
        needsTransport: currentUserSubmission?.hotel?.needsTransport,
      },
      wishes: currentUserSubmission?.wishes,
    },
    onSubmit: async (values) => {
      console.log(values);
      try {
        await axios.post("/api/invites/rsvp", {
          inviteId: currentUserInvite?.id,
          ...values,
        });

        mutate();
      } catch (err) {
        console.error(err);
      }
    },
  });

  const renderStep = useCallback(() => {
    if (activeStep === 0) {
      return (
        <VStack>
          <Heading as="h3">Hey 👋, thanks for taking the time to rsvp</Heading>
          <Text>
            Let&apos;s get started with your invitation code. It contains 6
            alphanumberic (text + number) values and you can find this in the
            invite letter
          </Text>
          <HStack>
            <FormControl isInvalid={isCodeInvalid}>
              <PinInput
                type="alphanumeric"
                onComplete={(value) => {
                  setInviteId(value);
                }}
                onChange={() => {
                  setInviteId("");
                  setCodeInvalid(false);
                }}
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
    }

    if (activeStep === 1) {
      console.log(formik.values.additionalGuests);
      return (
        <VStack>
          <Heading as="h3">
            Hey {currentUserInvite?.name} 👋, let&apos;s start with basic
            information
          </Heading>
          <Text>We promise this will be quick and easy 😉</Text>
          <FormControl>
            <Field name="isGoing" validate={isRequired}>
              {({ form }: FieldProps<FormProps>) => (
                <FormControl
                  isInvalid={!!form.errors.isGoing && !!form.touched.isGoing}
                >
                  <FormLabel htmlFor="isGoing">
                    Are you able to join us in Vietnam?
                  </FormLabel>
                  <RadioGroup
                    onChange={(e) => formik.setFieldValue("isGoing", e)}
                    value={form.values.isGoing}
                  >
                    <Radio value={"true"}>Yes 💯</Radio>
                    <Radio value={"false"}>No...Sorry 😢</Radio>
                  </RadioGroup>
                </FormControl>
              )}
            </Field>
            {formik.values.isGoing === "true" && (
              <FormControl>
                <FormLabel>Nice! Are you going with a plus one?</FormLabel>
                <Button
                  isDisabled={(formik.values.additionalGuests?.length ?? 0) > 0}
                  leftIcon={<AddIcon />}
                  onClick={() => {
                    formik.setFieldValue("additionalGuests", [{ name: "" }]);
                  }}
                >
                  Add Guest
                </Button>
                {formik.values.additionalGuests?.map((guest, index) => (
                  <FormControl
                    isInvalid={
                      !!formik.errors.additionalGuests &&
                      !!formik.touched.additionalGuests
                    }
                    key={index}
                  >
                    <FormLabel>Plus One Name</FormLabel>
                    <Input
                      type="text"
                      value={guest.name}
                      onChange={(e) => {
                        formik.setFieldValue("additionalGuests", [
                          {
                            name: e.target.value,
                          },
                        ]);
                      }}
                    />
                  </FormControl>
                ))}
              </FormControl>
            )}
            <Button
              onClick={() => {
                if (formik.values.isGoing === "true") {
                  setActiveStep(2);
                } else {
                  setActiveStep(4);
                }
              }}
            >
              Next
            </Button>
          </FormControl>
        </VStack>
      );
    }

    if (activeStep === 2) {
      return <></>;
    }

    if (activeStep === 3) {
      return <></>;
    }

    // Done
    return <></>;
  }, [
    activeStep,
    isCodeInvalid,
    formik.values.isGoing,
    formik.values.additionalGuests,
  ]);

  return (
    <Container maxW="container.xl" h="100vh" pt="14">
      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isCentered
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(3px)" />
        <ModalContent bgColor="transparent" boxShadow="none">
          <Center gap={6}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
            <Text fontSize="2xl">Loading...</Text>
          </Center>
        </ModalContent>
      </Modal>
      <HStack align="flex-start" spacing={16}>
        <Stepper index={activeStep} orientation="vertical" minH="lg" gap="0">
          {STEPS.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>
              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>
        <Flex justify="center" h="full">
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>{renderStep()}</form>
          </FormikProvider>
        </Flex>
      </HStack>
    </Container>
  );
}

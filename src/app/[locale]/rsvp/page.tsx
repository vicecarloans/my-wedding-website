"use client";

import {
  IGetInviteResponse,
  IUserInvite,
  IUserInviteSubmission,
} from "@/models/invite";
import { useCallback, useEffect, useRef, useState } from "react";
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
  useDisclosure,
  ModalOverlay,
  Modal,
  Center,
  Spinner,
  ModalContent,
} from "@chakra-ui/react";
import { useFormik, FormikProvider } from "formik";
import axios, { AxiosError } from "axios";
import EnterPinForm from "@/components/EnterPinForm";
import GuestInfoForm from "@/components/GuestInfoForm";

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
    index: 0,
    count: STEPS.length,
  });

  console.log("activeStep", activeStep);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);

  const [isCodeInvalid, setCodeInvalid] = useState<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    if (isLoading) {
      onOpen();
    } else {
      onClose();
    }
  }, [isLoading, onClose, onOpen]);

  useIsomorphicLayoutEffect(() => {
    if (data?.invite?.id) {
      setCurrentUserInvite(data?.invite);
      setActiveStep(1);
    }
  }, [data?.invite, setActiveStep, setCurrentUserInvite]);

  useIsomorphicLayoutEffect(() => {
    setCurrentUserSubmission(data?.inviteSubmission);
  }, [data?.inviteSubmission, setCurrentUserSubmission]);

  useIsomorphicLayoutEffect(() => {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        setCodeInvalid(true);
      }
    }
  }, [error]);

  const formik = useFormik<Partial<FormProps>>({
    initialValues: {
      isGoing: currentUserSubmission?.isGoing,
      additionalGuests: currentUserSubmission?.additionalGuests,
      flight: currentUserSubmission?.flight,
      hotel: currentUserSubmission?.hotel,
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
        <EnterPinForm
          isCodeInvalid={isCodeInvalid}
          handleChange={() => {
            setInviteId("");
            setCodeInvalid(false);
          }}
          handleComplete={(value) => {
            setInviteId(value);
          }}
        />
      );
    }

    if (activeStep === 1) {
      return (
        <GuestInfoForm
          currentUserInvite={currentUserInvite}
          formik={formik}
          setActiveStep={setActiveStep}
        />
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
  }, [activeStep, isCodeInvalid, formik, currentUserInvite, setActiveStep]);

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

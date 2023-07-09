"use client";

import {
  IGetInviteResponse,
  IUserInvite,
  IUserInviteSubmission,
} from "@/models/invite";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  VStack,
  Heading,
  Button,
  Icon,
  Stack,
} from "@chakra-ui/react";
import { useFormik, FormikProvider } from "formik";
import axios, { AxiosError } from "axios";
import EnterPinForm from "@/components/EnterPinForm";
import GuestInfoForm from "@/components/GuestInfoForm";
import TravelForm from "@/components/TravelForm";
import AccomodationForm from "@/components/AccomodationForm";
import MiscForm from "@/components/MiscForm";
import SummaryForm from "@/components/SummaryForm";
import { CheckCircleIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { useSearchParams } from "next/navigation";

export type FormProps = Omit<IUserInviteSubmission, "inviteId">;

export default function RSVP() {
  const searchParams = useSearchParams();

  const code = searchParams.get("code");

  const [currentUserInvite, setCurrentUserInvite] = useLocalStorage<
    IUserInvite | undefined
  >("current-user-invite", undefined);

  const [currentUserSubmission, setCurrentUserSubmission] = useLocalStorage<
    IUserInviteSubmission | undefined
  >("current-user-submission", undefined);

  const [inviteId, setInviteId] = useState(code ?? currentUserInvite?.id);

  const [showEditPinForm, setShowEditPinForm] = useState<boolean>(false);

  const { fetcher } = useSWRConfig();

  const { data, mutate, isLoading, error } = useSWR<IGetInviteResponse>(
    inviteId?.length === 6 ? ["/api/invites", inviteId] : null,
    ([url, id]: [string, string]) =>
      (fetcher as Fetcher<IGetInviteResponse, string>)?.(`${url}/${id}`)
  );

  const STEPS = useMemo(
    () =>
      currentUserInvite?.eligibleForReimburse
        ? [
            { title: "Invite", description: "Enter your invite code" },
            {
              title: "Guests Information",
              description: "Let us know who's coming",
            },
            {
              title: "Travel Information",
              description: "Let us know your travel plans",
            },
            {
              title: "Accomodation",
              description: "Let us know your preference of accomodation",
            },
            {
              title: "Miscellaneous",
              description: "We would love to hear from you",
            },
            { title: "Review", description: "See if you miss anything" },
            { title: "Done", description: "You're all set!" },
          ]
        : [
            { title: "Invite", description: "Enter your invite code" },
            {
              title: "Guests Information",
              description: "Let us know who's coming",
            },

            {
              title: "Miscellaneous",
              description: "We would love to hear from you",
            },
            { title: "Review", description: "See if you miss anything" },
            { title: "Done", description: "You're all set!" },
          ],
    [currentUserInvite?.eligibleForReimburse]
  );

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: STEPS.length,
  });

  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: true,
  });
  const finalRef = useRef(null);

  const [isCodeInvalid, setCodeInvalid] = useState<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    if (isLoading) {
      onOpen();
    } else {
      onClose();
    }
  }, [isLoading, onClose, onOpen, currentUserInvite]);

  useIsomorphicLayoutEffect(() => {
    if (error || !data) {
      setShowEditPinForm(false);
      if (error?.response?.status === 404) {
        setCodeInvalid(true);
      }
      return;
    }
    setCurrentUserInvite(data?.invite);
    setCurrentUserSubmission(data?.inviteSubmission);

    setShowEditPinForm(false);
    if (data?.inviteSubmission) {
      setShowEditPinForm(true);
    } else {
      setActiveStep(1);
    }
  }, [
    data?.invite,
    setActiveStep,
    setCurrentUserInvite,
    error,
    data?.inviteSubmission,
    setCurrentUserSubmission,
  ]);

  const formik = useFormik<Partial<FormProps>>({
    initialValues: {
      isGoing: currentUserSubmission?.isGoing,
      additionalGuests: currentUserSubmission?.additionalGuests,
      flight: currentUserSubmission?.flight,
      hotel: currentUserSubmission?.hotel,
      wishes: currentUserSubmission?.wishes,
    },
    onSubmit: async (values) => {
      try {
        onOpen();
        await axios.post("/api/invites/rsvp", {
          inviteId: currentUserInvite?.id,
          ...values,
        });

        setActiveStep(6);
        // Restart the form
        mutate();
      } catch (err) {
        console.error(err);
      } finally {
        onClose();
      }
    },
    enableReinitialize: true,
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
          showEditPinForm={showEditPinForm}
          setActiveStep={setActiveStep}
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
      return (
        <TravelForm
          currentUserSubmission={currentUserSubmission}
          travelInfo={currentUserInvite?.travel}
          formik={formik}
          setActiveStep={setActiveStep}
        />
      );
    }

    if (activeStep === 3) {
      return <AccomodationForm formik={formik} setActiveStep={setActiveStep} />;
    }

    if (activeStep === 4) {
      return <MiscForm formik={formik} setActiveStep={setActiveStep} />;
    }

    if (activeStep === 5) {
      return (
        <SummaryForm
          formik={formik}
          setActiveStep={setActiveStep}
          travelInfo={currentUserInvite?.travel}
        />
      );
    }

    // Done
    return (
      <VStack maxW="4xl" minW={{ base: "full", lg: "4xl" }}>
        <Center minH="2xs">
          <Heading size="xl">
            <CheckCircleIcon color="green.400" mr="6" />
            Thank you for your RSVP!
          </Heading>
        </Center>
        <Button
          onClick={() => {
            formik.resetForm();
            setActiveStep(1);
          }}
          border="2px"
          borderColor="red.500"
          colorScheme="red"
          color="gray.900"
        >
          Edit Submission
        </Button>
      </VStack>
    );
  }, [
    activeStep,
    isCodeInvalid,
    formik,
    currentUserInvite,
    setActiveStep,
    currentUserSubmission,
    showEditPinForm,
  ]);

  return (
    <Container maxW="container.xl" className="min-h-[100vh]" pt="14">
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
      <Stack
        direction={{ base: "column", lg: "row" }}
        align="flex-start"
        gap={16}
        className="top-16 relative"
      >
        <Stepper
          display={{ base: "none", lg: "flex" }}
          index={activeStep}
          orientation="vertical"
          minH="lg"
          gap="0"
        >
          {STEPS.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>
              <VStack align="flex-start">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </VStack>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>
        <Box display={{ base: "block", lg: "none" }} w="full">
          <HStack spacing={4} alignItems="center" justifyContent="center">
            <Icon as={InfoOutlineIcon} w="10" h="10" />
            <VStack align="flex-start">
              <Text fontSize="lg" fontWeight="extrabold">
                {STEPS[activeStep].title}
              </Text>
              <Text fontSize="md">{STEPS[activeStep].description}</Text>
            </VStack>
          </HStack>
        </Box>
        <VStack
          maxW={{ base: "md", lg: "full" }}
          justify="center"
          h="full"
          pb="10"
        >
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>{renderStep()}</form>
          </FormikProvider>
        </VStack>
      </Stack>
    </Container>
  );
}

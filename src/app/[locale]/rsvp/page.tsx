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
import { useRouter } from "next-intl/client";
import { useTranslations } from "next-intl";

export type FormProps = Omit<IUserInviteSubmission, "inviteId">;

export default function RSVP() {
  const searchParams = useSearchParams();
  const t = useTranslations("rsvp");
  const tDone = useTranslations("doneForm");
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

  const STEPS = useMemo(() => {
    if (!inviteId || error) {
      return [
        {
          title: t("stepper.invite.stepName"),
          description: t("stepper.invite.stepDescription"),
        },
      ];
    }
    return currentUserInvite?.eligibleForReimburse
      ? [
          {
            title: t("stepper.invite.stepName"),
            description: t("stepper.invite.stepDescription"),
          },
          {
            title: t("stepper.guestInformation.stepName"),
            description: t("stepper.guestInformation.stepDescription"),
          },
          {
            title: t("stepper.travel.stepName"),
            description: t("stepper.travel.stepDescription"),
          },
          {
            title: t("stepper.accomodation.stepName"),
            description: t("stepper.accomodation.stepDescription"),
          },
          {
            title: t("stepper.miscellaneous.stepName"),
            description: t("stepper.miscellaneous.stepDescription"),
          },
          {
            title: t("stepper.review.stepName"),
            description: t("stepper.review.stepDescription"),
          },
          {
            title: t("stepper.done.stepName"),
            description: t("stepper.done.stepDescription"),
          },
        ]
      : [
          {
            title: t("stepper.invite.stepName"),
            description: t("stepper.invite.stepDescription"),
          },
          {
            title: t("stepper.guestInformation.stepName"),
            description: t("stepper.guestInformation.stepDescription"),
          },
          {
            title: t("stepper.miscellaneous.stepName"),
            description: t("stepper.miscellaneous.stepDescription"),
          },
          {
            title: t("stepper.review.stepName"),
            description: t("stepper.review.stepDescription"),
          },
          {
            title: t("stepper.done.stepName"),
            description: t("stepper.done.stepDescription"),
          },
        ];
  }, [t, currentUserInvite, error]);

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

        setActiveStep(STEPS.length - 1);
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
          currentStep={0}
        />
      );
    }

    if (activeStep === 1) {
      return (
        <GuestInfoForm
          currentUserInvite={currentUserInvite}
          formik={formik}
          setActiveStep={setActiveStep}
          currentStep={1}
          miscStep={currentUserInvite?.eligibleForReimburse ? 4 : 2}
        />
      );
    }

    if (activeStep === 2) {
      return currentUserInvite?.eligibleForReimburse ? (
        <TravelForm
          currentUserSubmission={currentUserSubmission}
          travelInfo={currentUserInvite?.travel}
          formik={formik}
          setActiveStep={setActiveStep}
          currentStep={2}
        />
      ) : (
        <MiscForm
          formik={formik}
          setActiveStep={setActiveStep}
          currentStep={2}
          guestInfoStep={1}
        />
      );
    }

    if (activeStep === 3) {
      return currentUserInvite?.eligibleForReimburse ? (
        <AccomodationForm
          formik={formik}
          setActiveStep={setActiveStep}
          currentStep={3}
        />
      ) : (
        <SummaryForm
          formik={formik}
          setActiveStep={setActiveStep}
          travelInfo={currentUserInvite?.travel}
          currentStep={3}
        />
      );
    }

    if (activeStep === 4 && currentUserInvite?.eligibleForReimburse) {
      return (
        <MiscForm
          currentStep={4}
          guestInfoStep={1}
          formik={formik}
          setActiveStep={setActiveStep}
        />
      );
    }

    if (activeStep === 5 && currentUserInvite?.eligibleForReimburse) {
      return (
        <SummaryForm
          formik={formik}
          setActiveStep={setActiveStep}
          travelInfo={currentUserInvite?.travel}
          currentStep={5}
        />
      );
    }

    // Done
    return (
      <VStack maxW="4xl" minW={{ base: "full", lg: "4xl" }}>
        <Center minH="2xs">
          <Heading size="xl">
            <CheckCircleIcon color="green.400" mr="6" />
            {tDone("title")}
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
          {tDone("editButton")}
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
    tDone,
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

"use client";

import {
  Text,
  Center,
  Container,
  Modal,
  ModalContent,
  ModalOverlay,
  Spinner,
  useDisclosure,
  Image,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useRef } from "react";
import useSWR from "swr";

export default function GalleryPage() {
  const { data, isLoading, error } = useSWR<{ images: string[] }>(
    "/api/gallery"
  );
  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: true,
  });
  const finalRef = useRef(null);

  return (
    <Container maxW="container.xl" className="min-h-[100vh]" pt="14">
      <Modal
        finalFocusRef={finalRef}
        isOpen={isLoading}
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
      {/* <Wrap px="1rem" spacing={4} justify="center" className="top-16 relative">
        {data?.images.map((url) => (
          <WrapItem
            key={url}
            boxShadow="base"
            rounded="20px"
            overflow="hidden"
            lineHeight="0"
            _hover={{ boxShadow: "dark-lg" }}
          >
            <Image
              src={`/gallery/${url}`}
              key={url}
              alt="image"
              className="w-96 h-96"
              objectFit="cover"
              objectPosition="center center"
            />
          </WrapItem>
        ))}
      </Wrap> */}
      <Center px="1rem" justify="center" className="top-16 relative">
        This is under construction 🚧 Please come back later for contents
      </Center>
    </Container>
  );
}

"use client";

import Hero from "@/components/landing/Hero";
import {
  Box,
  Button,
  Center,
  Heading,
  VStack,
  Image,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import { useRouter } from "next-intl/client";

type GalleryImageType = {
  src: string;
  className: string;
  alt: string;
  size: string;
  parallaxOffset: number;
  parallaxSpeed: number;
};
const GALLERY_IMAGES: GalleryImageType[] = [
  {
    src: "https://bit.ly/dan-abramov",
    className: "absolute top-[40%] left-[10%]",
    alt: "Dan Abramov",
    size: "200px",
    parallaxOffset: 1,
    parallaxSpeed: 1,
  },
  {
    src: "https://bit.ly/dan-abramov",
    className: "absolute top-[0%] left-[5%] w-[150px] h-[200px]",
    alt: "Dan Abramov",
    size: "200px",
    parallaxOffset: 1,
    parallaxSpeed: 0.2,
  },
  {
    src: "https://bit.ly/dan-abramov",
    className: "absolute top-[25%] right-[20%] w-[150px] h-[200px]",
    alt: "Dan Abramov",
    size: "200px",
    parallaxOffset: 1,
    parallaxSpeed: 1,
  },
  {
    src: "https://bit.ly/dan-abramov",
    className: "absolute bottom-[10%] right-[5%] w-[150px] h-[200px]",
    alt: "Dan Abramov",
    size: "200px",
    parallaxOffset: 1,
    parallaxSpeed: 0.2,
  },
];

export default function IndexPage() {
  const router = useRouter();

  const alignCenter = { display: "flex", alignItems: "center" };
  return (
    <div className="min-h-[100vh]">
      <Parallax pages={4} className="parallax-landing">
        <ParallaxLayer offset={0}>
          <Hero />
        </ParallaxLayer>
        <ParallaxLayer sticky={{ start: 1, end: 2 }}>
          <div className="absolute bg-red-50/25 w-full h-full">
            <Center h="full">
              <VStack>
                <Heading
                  fontFamily="'Handlee', sans-serif"
                  as="h3"
                  className="text-2xl md:text-6xl mb-8"
                >
                  Explore our Gallery
                </Heading>
                <Button
                  onClick={() => router.push("/gallery")}
                  w="full"
                  fontFamily="'Handlee', sans-serif"
                  border="2px"
                  borderColor="red.500"
                  colorScheme="red"
                  color="gray.900"
                >
                  View Gallery
                </Button>
              </VStack>
            </Center>
          </div>
        </ParallaxLayer>
        {GALLERY_IMAGES.map((image, index) => (
          <ParallaxLayer
            offset={image.parallaxOffset}
            speed={image.parallaxSpeed}
            key={index}
          >
            <Image
              src={image.src}
              alt={image.alt}
              className={image.className}
              boxSize={image.size}
              objectFit="cover"
            />
          </ParallaxLayer>
        ))}
        <ParallaxLayer offset={3}>
          <Center h="full">
            <VStack>
              <Heading
                fontFamily="'Handlee', sans-serif"
                as="h3"
                className="text-xl uppercase md:text-6xl mb-8"
              >
                Join us in Vietnam
              </Heading>
              <Button
                onClick={() => router.push("/rsvp")}
                w="full"
                fontFamily="'Handlee', sans-serif"
                border="2px"
                borderColor="red.500"
                colorScheme="red"
                color="gray.900"
              >
                RSVP Now
              </Button>
            </VStack>
          </Center>
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}

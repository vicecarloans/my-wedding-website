"use client";

import Hero from "@/components/landing/Hero";
import RSVPSection from "@/components/landing/RSVPSection";
import {
  Button,
  Center,
  Heading,
  VStack,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import { useRouter } from "next-intl/client";

type GalleryImageType = {
  src: string;
  className: string;
  alt: string;
  parallaxOffset: number;
  parallaxSpeed: number;
};
const GALLERY_IMAGES: GalleryImageType[] = [
  // Parallax Page 1
  // Left
  {
    src: "/gallery/IMG_0630.JPEG",
    className: "absolute top-[20%] left-[10%] w-60 h-72",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.7,
  },

  {
    src: "/gallery/GOPR0107.JPG",
    className: "absolute top-[50%] left-[0%] w-40 h-48",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.5,
  },

  {
    src: "/gallery/IMG_4214.JPEG",
    className: "absolute bottom-[0%] left-[35%] w-32 h-40",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.8,
  },
  {
    src: "/gallery/IMG_6288.JPEG",
    className: "absolute top-[25%] left-[40%] w-60 h-72",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.5,
  },
  {
    src: "/gallery/IMG_2226.JPEG",
    className: "absolute bottom-[0%] left-[15%] w-72 h-96",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.5,
  },
  // Right
  {
    src: "/gallery/IMG_6548.JPEG",
    className: "absolute top-[10%] right-[30%] w-72 h-96",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.6,
  },
  {
    src: "/gallery/IMG_3636.JPEG",
    className: "absolute bottom-[10%] right-[5%] w-40 h-48",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.7,
  },
  {
    src: "/gallery/IMG_4078.JPEG",
    className: "absolute top-[50%] right-[20%] w-72 h-96",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.6,
  },
  {
    src: "/gallery/IMG_6552.JPEG",
    className: "absolute top-[20%] right-[0%] w-72 h-96",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.7,
  },
  {
    src: "/gallery/IMG_5106.JPG",
    className: "absolute bottom-[0%] right-[40%] w-60 h-72",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.6,
  },
  // Parallax Page 2
  // Left
  {
    src: "/gallery/IMG_5600.JPEG",
    className: "absolute -top-[30%] left-[10%] w-60 h-72",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.5,
  },
  {
    src: "/gallery/IMG_6037.JPEG",
    className: "absolute -top-[40%] left-[35%] w-96 h-72",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.6,
  },
  {
    src: "/gallery/IMG_5359.JPEG",
    className: "absolute bottom-[30%] left-[30%] w-32 h-40",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.7,
  },
  {
    src: "/gallery/IMG_6288.JPEG",
    className: "absolute top-[10%] left-[30%] w-60 h-72",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.7,
  },
  {
    src: "/gallery/IMG_6548.JPEG",
    className: "absolute bottom-[20%] left-[5%] w-72 h-96",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.5,
  },
  //Right
  {
    src: "/gallery/IMG_6562.JPEG",
    className: "absolute -top-[40%] right-[5%] w-72 h-96",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.4,
  },
  {
    src: "/gallery/IMG_6746.JPEG",
    className: "absolute -top-[50%] right-[30%] w-40 h-48",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.5,
  },
  {
    src: "/gallery/IMG_6997.JPG",
    className: "absolute top-[35%] right-[10%] w-72 h-96",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.2,
  },
  {
    src: "/gallery/IMG_7012.JPEG",
    className: "absolute -top-[20%] right-[35%] w-72 h-96",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.6,
  },
  {
    src: "/gallery/IMG_7022.JPG",
    className: "absolute bottom-[20%] right-[40%] w-60 h-72",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.5,
  },
];

export default function IndexPage() {
  const router = useRouter();

  return (
    <div className="min-h-[100vh]">
      <Parallax pages={4} className="parallax-landing">
        <ParallaxLayer offset={0}>
          <Hero />
        </ParallaxLayer>
        <ParallaxLayer sticky={{ start: 1, end: 2 }}>
          <div className="absolute bg-red-100/60 w-full h-full">
            <Center h="full">
              <VStack>
                <Heading
                  fontFamily="'Handlee', sans-serif"
                  as="h3"
                  className="text-2xl lg:text-5xl uppercase mb-8"
                >
                  Explore our Gallery
                </Heading>
                <Button
                  onClick={() => router.push("/gallery")}
                  w="full"
                  h="14"
                  fontFamily="'Handlee', sans-serif"
                  fontSize="3xl"
                  border="2px"
                  borderColor="red.500"
                  bgColor={useColorModeValue("red.500", "red.200")}
                  colorScheme="red"
                  color="red.900"
                  _hover={{
                    color: "gray.200",
                    bgColor: "red.500",
                  }}
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
              objectFit="cover"
            />
          </ParallaxLayer>
        ))}
        <ParallaxLayer offset={3}>
          <RSVPSection />
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}

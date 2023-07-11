"use client";

import Hero from "@/components/landing/Hero";
import RSVPSection from "@/components/landing/RSVPSection";
import {
  Button,
  Center,
  Heading,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";

import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";

type GalleryImageType = {
  src: string;
  className: string;
  alt: string;
  parallaxOffset: number;
  parallaxSpeed: number;
  width: number;
  height: number;
};

const MULTIPLIER = 4;
const GALLERY_IMAGES: GalleryImageType[] = [
  // Parallax Page 1
  // Left
  {
    src: "/gallery/IMG_0630.JPEG",
    className: "absolute top-[calc(20%-9rem)] left-[calc(10%-5rem)]",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.7,
    width: 80 * MULTIPLIER,
    height: 96 * MULTIPLIER,
  },

  {
    src: "/gallery/IMG_4214.JPEG",
    className: "absolute bottom-[0%] left-[calc(35%-10rem)]",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.8,
    width: 48 * MULTIPLIER,
    height: 40 * MULTIPLIER,
  },
  {
    src: "/gallery/IMG_6288.JPEG",
    className: "absolute top-[25%] left-[calc(40%-10rem)]",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.5,
    width: 60 * MULTIPLIER,
    height: 72 * MULTIPLIER,
  },
  {
    src: "/gallery/IMG_2226.JPEG",
    className: "absolute bottom-[0%] left-[calc(15%-15rem)]",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.5,
    width: 72 * MULTIPLIER,
    height: 96 * MULTIPLIER,
  },
  // Right
  {
    src: "/gallery/IMG_6548.JPEG",
    className: "absolute top-[0%] right-[calc(30%-10rem)]",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.6,
    width: 72 * MULTIPLIER,
    height: 96 * MULTIPLIER,
  },
  {
    src: "/gallery/IMG_3636.JPEG",
    className: "absolute bottom-[10%] right-[calc(5%-7rem)]",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.7,
    width: 64 * MULTIPLIER,
    height: 72 * MULTIPLIER,
  },
  {
    src: "/gallery/IMG_4078.JPEG",
    className: "absolute top-[50%] right-[20%]",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.6,
    width: 72 * MULTIPLIER,
    height: 96 * MULTIPLIER,
  },
  {
    src: "/gallery/IMG_6552.JPEG",
    className: "absolute top-[0%] right-[calc(10%-15rem)]",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.7,
    width: 72 * MULTIPLIER,
    height: 96 * MULTIPLIER,
  },
  {
    src: "/gallery/IMG_5106.JPG",
    className: "absolute bottom-[0%] right-[40%]",
    alt: "Dan Abramov",
    parallaxOffset: 1,
    parallaxSpeed: 0.6,
    width: 60 * MULTIPLIER,
    height: 72 * MULTIPLIER,
  },
  // Parallax Page 2
  // Left
  {
    src: "/gallery/IMG_5600.JPEG",
    className: "absolute -top-[0%] left-[10%]",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.5,
    width: 60 * MULTIPLIER,
    height: 72 * MULTIPLIER,
  },
  {
    src: "/gallery/IMG_6037.JPEG",
    className: "absolute -top-[40%] left-[15%]",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.6,
    width: 96 * MULTIPLIER,
    height: 72 * MULTIPLIER,
  },
  {
    src: "/gallery/IMG_5359.JPEG",
    className: "absolute bottom-[30%] left-[30%]",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.7,
    width: 32 * MULTIPLIER,
    height: 40 * MULTIPLIER,
  },
  {
    src: "/gallery/IMG_6288.JPEG",
    className: "absolute top-[10%] left-[30%]",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.7,
    width: 60 * MULTIPLIER,
    height: 72 * MULTIPLIER,
  },
  {
    src: "/gallery/IMG_6548.JPEG",
    className: "absolute bottom-[20%] left-[5%]",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.5,
    width: 72 * MULTIPLIER,
    height: 96 * MULTIPLIER,
  },
  //Right
  {
    src: "/gallery/IMG_6562.JPEG",
    className: "absolute -top-[40%] right-[5%] ",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.4,
    width: 72 * MULTIPLIER,
    height: 96 * MULTIPLIER,
  },
  {
    src: "/gallery/IMG_6746.JPEG",
    className: "absolute -top-[50%] right-[30%]",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.5,
    width: 40 * MULTIPLIER,
    height: 48 * MULTIPLIER,
  },
  {
    src: "/gallery/IMG_6997.JPG",
    className: "absolute top-[35%] right-[10%] ",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.2,
    width: 72 * MULTIPLIER,
    height: 96 * MULTIPLIER,
  },
  {
    src: "/gallery/IMG_7012.JPEG",
    className: "absolute -top-[20%] right-[35%]",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.6,
    width: 72 * MULTIPLIER,
    height: 96 * MULTIPLIER,
  },
  {
    src: "/gallery/IMG_7022.JPG",
    className: "absolute bottom-[20%] right-[40%]",
    alt: "Dan Abramov",
    parallaxOffset: 2,
    parallaxSpeed: 0.5,
    width: 60 * MULTIPLIER,
    height: 72 * MULTIPLIER,
  },
];

export default function IndexPage() {
  const router = useRouter();
  const t = useTranslations("home");
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
                  {t("galleryTitle")}
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
                  {t("galleryButton")}
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
              priority
              width={image.width}
              height={image.height}
              style={{
                objectFit: "cover", // cover, contain, none
              }}
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

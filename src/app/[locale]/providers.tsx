// app/providers.tsx
"use client";
import "./globals.css";
// Supports weights 100-900
import "@fontsource/handlee";
import "@fontsource-variable/jost";
import { CacheProvider } from "@chakra-ui/next-js";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Menu,
  Select,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { SWRConfig } from "swr";
import theme from "@/theme";
import {
  Box,
  Flex,
  useColorModeValue,
  HStack,
  ColorModeScript,
  ChakraProvider,
} from "@chakra-ui/react";
import NavLink from "../../components/NavLink";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRouter } from "next-intl/client";
import { usePathname } from "next/navigation";

const Links = [
  {
    text: "Gallery",
    href: "/gallery",
  },
  {
    text: "RSVP",
    href: "/rsvp",
  },
];

export function Providers({
  children,
  currentLocale,
}: {
  children: React.ReactNode;
  currentLocale: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const path = usePathname();
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <SWRConfig
          value={{
            revalidateIfStale: true,
            fetcher: async (resource) => {
              const { data } = await axios.get(resource);
              return data;
            },
          }}
        >
          <Box
            position="absolute"
            w="full"
            zIndex={20}
            bg={useColorModeValue("red.100", "gray.900")}
            px={4}
          >
            <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
              <HStack spacing={8} alignItems={"center"}>
                <Box>
                  <NavLink href="/" text="Huy & Tien" />
                </Box>
              </HStack>
              <Flex alignItems={"center"}>
                <HStack
                  as={"nav"}
                  spacing={4}
                  display={{ base: "none", md: "flex" }}
                >
                  <Select
                    value={currentLocale}
                    onChange={(e) => {
                      router.replace(
                        `${e.target.value}${path.replace(/\/(en|vi)/g, "")}`
                      );
                    }}
                    border="2px"
                    borderColor="red.500"
                  >
                    <option value="en">English</option>
                    <option value="vi">Tiếng Việt</option>
                  </Select>
                  {Links.map(({ href, text }) => (
                    <NavLink key={href} href={href} text={text} />
                  ))}
                </HStack>
                <Box display={{ base: "inline", md: "none" }}>
                  <Button
                    variant="link"
                    leftIcon={<HamburgerIcon />}
                    onClick={onOpen}
                  ></Button>
                  <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                    <DrawerOverlay />
                    <DrawerContent>
                      <DrawerCloseButton />
                      <DrawerHeader>Menu</DrawerHeader>
                      <DrawerBody>
                        <VStack spacing={4}>
                          <Select
                            value={currentLocale}
                            onChange={(e) => {
                              router.replace(
                                `${e.target.value}${path.replace(
                                  /\/(en|vi)/g,
                                  ""
                                )}`
                              );
                            }}
                          >
                            <option value="en">English</option>
                            <option value="vi">Tiếng Việt</option>
                          </Select>
                          {Links.map(({ href, text }) => (
                            <NavLink
                              key={href}
                              href={href}
                              text={text}
                              onClick={onClose}
                            />
                          ))}
                        </VStack>
                      </DrawerBody>
                    </DrawerContent>
                  </Drawer>
                </Box>
              </Flex>
            </Flex>
          </Box>
          <Box bg={useColorModeValue("red.50", "red.900")}>{children}</Box>
        </SWRConfig>
      </ChakraProvider>
    </CacheProvider>
  );
}

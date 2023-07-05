// app/providers.tsx
"use client";
import "./globals.css";
// Supports weights 100-900
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

const Links = [
  {
    text: "About",
    href: "/about",
  },
  {
    text: "RSVP",
    href: "/rsvp",
  },
];

export function Providers({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <SWRConfig
          value={{
            revalidateIfStale: true,
            fetcher: async (resource) => {
              try {
                const { data } = await axios.get(resource);
                return data;
              } catch (err) {
                console.error(err);
                throw err;
              }
            },
          }}
        >
          <Box
            position="relative"
            zIndex={20}
            bg={useColorModeValue("red.100", "gray.900")}
            px={4}
          >
            <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
              <HStack spacing={8} alignItems={"center"}>
                <Box>
                  <NavLink href="/" text="Logo" />
                </Box>
              </HStack>
              <Flex alignItems={"center"}>
                <HStack
                  as={"nav"}
                  spacing={4}
                  display={{ base: "none", md: "flex" }}
                >
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
          <Box minH="100vh" bg={useColorModeValue("red.50", "red.900")}>
            {children}
          </Box>
        </SWRConfig>
      </ChakraProvider>
    </CacheProvider>
  );
}

// app/providers.tsx
"use client";

import "@fontsource/indie-flower";
import { CacheProvider } from "@chakra-ui/next-js";
import {} from "@chakra-ui/react";
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
          <Box bg={useColorModeValue("red.100", "gray.900")} px={4}>
            <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
              <HStack spacing={8} alignItems={"center"}>
                <Box>Logo</Box>
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
              </Flex>
            </Flex>
          </Box>
          <Box minH="100vh" bg={useColorModeValue("red.200", "red.900")}>
            {children}
          </Box>
        </SWRConfig>
      </ChakraProvider>
    </CacheProvider>
  );
}

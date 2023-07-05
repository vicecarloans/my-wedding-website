import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: `'Jost Variable', sans-serif`,
    body: `'Jost Variable', sans-serif`,
  },
  config: {
    initialColorMode: "light",
  },
});

export default theme;

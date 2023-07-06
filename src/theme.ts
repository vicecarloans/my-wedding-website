import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: `'Jost Variable', sans-serif`,
    body: `'Jost Variable', sans-serif`,
  },
  fontSizes: {
    xs: "16px",
    sm: "18px",
    md: "20px",
  },
  config: {
    initialColorMode: "theme",
    useSystemColorMode: false,
  },
});

export default theme;

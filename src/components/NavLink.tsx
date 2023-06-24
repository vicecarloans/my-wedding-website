"use client";

import Link from "next-intl/link";
import { FC, PropsWithChildren } from "react";
import { useColorModeValue, Text } from "@chakra-ui/react";

export interface NavLinkProps {
  text: string;
  href: string;
}

const NavLink: FC<PropsWithChildren<NavLinkProps>> = ({ text, href }) => (
  <Link href={href}>
    <Text>{text}</Text>
  </Link>
);

export default NavLink;

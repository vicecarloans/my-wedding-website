"use client";

import Link from "next-intl/link";
import { FC, PropsWithChildren } from "react";
import { useColorModeValue, Text } from "@chakra-ui/react";

export interface NavLinkProps {
  text: string;
  href: string;
  onClick?: () => void;
}

const NavLink: FC<PropsWithChildren<NavLinkProps>> = ({
  text,
  href,
  onClick,
}) => (
  <Link href={href} onClick={onClick}>
    <Text fontSize="xl">{text}</Text>
  </Link>
);

export default NavLink;

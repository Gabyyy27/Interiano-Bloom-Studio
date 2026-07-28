import type { ReactNode } from "react";

import { Box, Container } from "@mui/material";

type ContainerWidth =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | false;

interface SectionContainerProps {
  children: ReactNode;
  id?: string;
  maxWidth?: ContainerWidth;
}

export default function SectionContainer({
  children,
  id,
  maxWidth = "lg",
}: SectionContainerProps) {
  return (
    <Box
      component="section"
      id={id}
      sx={{
        scrollMarginTop: {
          xs: 72,
          md: 88,
        },
        py: {
          xs: 8,
          md: 12,
        },
      }}
    >
      <Container maxWidth={maxWidth}>
        {children}
      </Container>
    </Box>
  );
}
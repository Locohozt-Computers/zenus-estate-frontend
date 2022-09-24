import styled from "styled-components/macro";
import { Typography } from "components/atoms/Typography";
import React from "react";
import { pxToEm } from "utils";

const TagStyling = styled.div<{ bg?: string; tColor?: string }>`
  background-color: ${({ bg }) => bg || "var(--green)"};
  color: ${({ tColor }) => tColor || "white"} !important;
  padding: ${pxToEm(10)} ${pxToEm(12)};
  border-radius: 4px;
`;

export const Tag = ({
  label,
  colors,
}: {
  label: string;
  colors?: {
    bg: string;
    text: string;
  };
}) => {
  return (
    <TagStyling bg={colors?.bg} tColor={colors?.text}>
      <Typography
        transform="capitalize"
        variant="bodyBig"
        color="inherit"
        content={label}
      />
    </TagStyling>
  );
};

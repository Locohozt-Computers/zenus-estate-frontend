/* eslint-disable */
import styled, { css } from "styled-components/macro";
import { pxToEm } from "utils";
import { cssObjectToString } from "utils/helpers";
import { PropsWithChildren, ReactNode } from "react";

export type TextColor =
  | "blue"
  | "light-blue"
  | "pink"
  | "gray"
  | "med-gray"
  | "black"
  | "white";
export type TextVariant =
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "heading5"
  | "bodyBig"
  | "bodySmall"
  | "helperText"
  | "subtitle";

export interface TextProps extends PropsWithChildren {
  content?: string | number | ReactNode;
  variant?: TextVariant;
  textColor?: TextColor;
  color?: string | TextColor;
  size?: number;
  weight?: number;
}

const setVariant = (variant: TextVariant) => {
  switch (variant) {
    case "bodyBig":
      return cssObjectToString({
        fontWeight: 400,
        fontSize: pxToEm(16),
      });
    case "heading4":
      return cssObjectToString({
        fontWeight: 500,
        fontSize: pxToEm(28),
      });
    default:
      return "";
  }
};

export const TextWrapper = styled.p<TextProps>`
  font-weight: ${({ weight }) => weight && weight};
  font-size: ${({ size }) => size && pxToEm(size)};
  ${({ variant }) =>
    variant &&
    css`
      ${setVariant(variant)}
    `};
  ${({ textColor, color }) =>
    (textColor || color) &&
    css`
      color: ${textColor ? `var(--${textColor})` : color ? `${color};` : ""};
    `};
`;

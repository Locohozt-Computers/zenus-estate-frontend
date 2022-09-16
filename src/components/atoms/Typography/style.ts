/* eslint-disable */
import styled, { css, CSSObject } from "styled-components/macro";
import { pxToEm } from "utils";
import { cssObjectToString } from "utils/helpers";
import { HTMLAttributes, PropsWithChildren, ReactNode } from "react";

export type TextColor =
  | "blue"
  | "light-blue"
  | "pink"
  | "gray"
  | "med-gray"
  | "black"
  | "white"
  | "red"
  | "green";
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

type Text = HTMLAttributes<HTMLParagraphElement> & PropsWithChildren;
export interface TextProps extends Text {
  content?: string | number | ReactNode;
  variant?: TextVariant;
  textColor?: TextColor;
  color?: string | TextColor;
  size?: number;
  weight?: number;
  className?: string;
  transform?: CSSObject["transform"];
}

const setVariant = (variant: TextVariant) => {
  switch (variant) {
    case "bodyBig":
      return cssObjectToString({
        fontWeight: 400,
        fontSize: pxToEm(16),
        color: "var(--black)",
      });
    case "heading3":
      return cssObjectToString({
        fontWeight: 500,
        fontSize: pxToEm(39),
        color: "var(--blue)",
      });
    case "heading4":
      return cssObjectToString({
        fontWeight: 500,
        fontSize: pxToEm(28),
        color: "var(--blue)",
      });
    case "heading5":
      return cssObjectToString({
        fontWeight: 500,
        fontSize: pxToEm(23),
        color: "var(--blue)",
      });
    case "subtitle":
      return cssObjectToString({
        fontWeight: 500,
        fontSize: pxToEm(17),
        color: "var(--black)",
      });
    case "helperText":
      return cssObjectToString({
        fontWeight: 400,
        fontSize: pxToEm(12),
        color: "var(--med-gray)",
      });
    default:
      return "";
  }
};

export const TextWrapper = styled.p<TextProps>`
  font-weight: ${({ weight }) => weight && weight};
  font-size: ${({ size }) => (size ? pxToEm(size) : pxToEm(16))};
  ${({ variant }) =>
    variant &&
    css`
      ${setVariant(variant)}
    `};
  text-transform: ${({ transform }) => transform};
  ${({ textColor, color }) =>
    (textColor || color) &&
    css`
      color: ${textColor
        ? `var(--${textColor})`
        : color
        ? `${color};`
        : "var(--black)"};
    `};
`;

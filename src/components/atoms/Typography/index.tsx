import React, { PropsWithChildren, ReactNode } from "react";
import { TextWrapper, TextVariant, TextColor } from "./style";

interface TextProps extends PropsWithChildren {
  content?: string | number | ReactNode;
  variant?: TextVariant;
  textColor?: TextColor;
  color?: string | TextColor;
}

interface HeadingProps extends TextProps {
  level?: number;
}

export const Typography = ({ content, children, ...rest }: TextProps) => {
  return <TextWrapper {...rest}>{content || children}</TextWrapper>;
};

export const TextHeading = ({
  content,
  children,
  level,
  ...rest
}: HeadingProps) => {
  return React.createElement(
    TextWrapper,
    { ...rest, as: `h${Math.abs(level as number) || 1}` },
    content || children
  );
};

Typography.Heading = TextHeading;

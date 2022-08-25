import React, { PropsWithChildren } from "react";
import { TextWrapper } from "./style";

interface TextProps extends PropsWithChildren {
  content?: any;
}

export const Typography = ({ content, children, ...rest }: TextProps) => {
  return <TextWrapper {...rest}>{content || children}</TextWrapper>;
};

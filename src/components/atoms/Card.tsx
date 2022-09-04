import React, { HTMLAttributes, PropsWithChildren } from "react";
import styled from "styled-components/macro";

const CardStyle = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 8px;
`;

export const Card = ({
  children,
  ...rest
}: PropsWithChildren & HTMLAttributes<HTMLDivElement>) => {
  return <CardStyle {...rest}>{children}</CardStyle>;
};

import React, { PropsWithChildren } from "react";
import styled from "styled-components/macro";
import bgImage from "assets/images/auth_bg.png";
import { pxToEm } from "utils";

const AuthStyling = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 1fr;

  .first-div {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 60px 20px;
  }

  .last-div {
    display: none;
  }

  @media screen and (min-width: ${pxToEm(900, false)}) {
    grid-template-columns: 1fr 1fr;

    .first-div {
      padding: 70px;
    }

    .last-div {
      display: block;
      background-image: url(${bgImage});
      background-position: center;
      background-size: cover;
    }
  }
`;

export const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <AuthStyling>
      <div className="first-div">{children}</div>
      <div className="last-div" />
    </AuthStyling>
  );
};

import React, { PropsWithChildren, useState } from "react";
import styled from "styled-components/macro";
import bgImage from "assets/images/auth_bg.png";
import bgImage0 from "assets/images/auth_bg_0.jpg";
import bgImage1 from "assets/images/auth_bg_1.jpg";
import bgImage2 from "assets/images/auth_bg_2.jpg";
import bgImage3 from "assets/images/auth_bg_3.png";
import bgImage4 from "assets/images/auth_bg_4.png";
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
    height: 100vh;
    width: 100%;
  }

  @media screen and (min-width: ${pxToEm(900, false)}) {
    grid-template-columns: 1fr 1fr;

    .first-div {
      padding: 70px;
    }

    .last-div {
      display: block;
    }
  }
`;

export const AuthLayout = ({ children }: PropsWithChildren) => {
  const images = [bgImage0, bgImage1, bgImage2, bgImage3, bgImage4, bgImage];

  const [pr, setPr] = useState<number>(0);

  return (
    <AuthStyling>
      <div className="first-div">{children}</div>
      <img
        className="last-div"
        alt="modern house with sky"
        src={images[pr] || bgImage}
        onLoad={() => {
          setPr(pr + 1);
        }}
        style={{
          objectFit: "cover",
        }}
      />
    </AuthStyling>
  );
};

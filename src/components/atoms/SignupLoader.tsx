import React from "react";
import styled from "styled-components/macro";

const Loader = styled.div`
  background: #ebf2ff;
  height: 19px;
  width: 100%;
  border-radius: 50px;
  margin-bottom: 45px;
  display: flex;

  .loader {
    background: #003085;
    border-radius: 50px;
    transition: width 0.3s ease;
  }
`;

const progressWidths: Record<number, string> = {
  1: "33%",
  2: "66%",
};

const SignupLoader: React.FC<{
  slide?: number;
  check?: boolean;
}> = ({ slide = 0, check }) => {
  if (slide === 0) return null;

  const width = check ? "100%" : progressWidths[slide] ?? "33%";

  return (
    <Loader>
      <div className="loader" style={{ width }} />
    </Loader>
  );
};

export default SignupLoader;

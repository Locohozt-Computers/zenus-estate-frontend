import React from "react";
import styled from "styled-components/macro";

/*
 *  we have 3 clicks,
 * for every click being made, loader loads.
 * hence we track the loader based on the number of clicks.
 * */

const Loader = styled.div`
  background: #ebf2ff;
  height: 19px;
  width: 100%;
  border-radius: 50px;
  margin-bottom: 45px;
  display: flex;

  .loader {
    background: #003085;
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
  }
`;
const SignupLoader: React.FC<{
  slide?: string | number | undefined;
  check?: boolean;
}> = ({ slide, check }) => {
  return (
    <>
      <div style={{ display: slide === 0 ? "none" : "block" }}>
        <Loader>
          <div
            className="loader"
            style={{ width: check === true && slide === 1 ? "100%" : "370px" }}
          />
        </Loader>
      </div>
    </>
    // <Loader className="">{Array(3).fill(<div className="steps" />)}</Loader>
  );
};

export default SignupLoader;

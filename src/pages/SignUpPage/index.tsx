import React, { FC, useState } from "react";
import CreateAccount from "components/organisms/SignUpForm/createAccount";
import CompleteAccount from "components/organisms/SignUpForm/completeAccount";
import SignupLoader from "components/atoms/SignupLoader";

export interface CreateAccountT {
  setSlide?: (index: number) => void;
  slide?: string | number | undefined;
  onUpdate?: (pos: number) => void;
  skip?: string;
  status?: (verify: boolean) => void;
  check?: boolean;
}
const form = [CreateAccount, CompleteAccount];

const SignUp = () => {
  const [slide, setSlide] = useState(0);
  const [check, unCheck] = useState(false);
  const Components: FC<any> = form[slide];
  const handleClick = (pos: number) => {
    setSlide(slide + pos);
  };
  const handleModal = () => {
    unCheck(true);
  };
  return (
    <div>
      <SignupLoader check={check} slide={slide} />
      <Components status={handleModal} onUpdate={handleClick} />
    </div>
  );
};

export default SignUp;

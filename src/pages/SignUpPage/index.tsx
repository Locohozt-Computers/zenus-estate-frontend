import React, { useState } from "react";
import CreateAccount from "pages/SignUpPage/SignUpForm/createAccount";
import CompleteAccount from "pages/SignUpPage/SignUpForm/completeAccount";
import RegisterAccount from "pages/SignUpPage/SignUpForm/registerAccount";
import SignupLoader from "components/atoms/SignupLoader";

const SignUp = () => {
  const [slide, setSlide] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [complete, setComplete] = useState(false);

  const handleNext = () => setSlide((s) => s + 1);

  return (
    <div>
      <SignupLoader check={complete} slide={slide} />
      {slide === 0 && (
        <CreateAccount onUpdate={handleNext} onPhoneVerified={setPhoneNumber} />
      )}
      {slide === 1 && (
        <CompleteAccount
          onUpdate={handleNext}
          onBack={() => setSlide(0)}
          phoneNumber={phoneNumber}
        />
      )}
      {slide === 2 && (
        <RegisterAccount
          phoneNumber={phoneNumber}
          status={() => setComplete(true)}
        />
      )}
    </div>
  );
};

export default SignUp;

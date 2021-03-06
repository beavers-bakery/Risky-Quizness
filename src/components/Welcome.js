import React, { useState } from "react";
import Login from "./Login";
import PasswordReset from "./PasswordReset";
import Signup from "./Signup";

const Welcome = () => {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <div className={`h-screen relative z-40`}>
      {showSignupModal ? (
        <div className="flex justify-center px-5 absolute z-50 w-full top-28">
          <Signup
            setShowSignupModal={setShowSignupModal}
            showSignupModal={showSignupModal}
          />
        </div>
      ) : null}
      {showResetModal ? (
        <div className="flex top-40 justify-center absolute z-50 w-full">
          <PasswordReset
            setShowResetModal={setShowResetModal}
            showResetModal={showResetModal}
          />
        </div>
      ) : null}
      <div
        className={`flex flex-col items-center lg:flex-row lg:justify-around lg:items-center z-1 ${
          showSignupModal || showResetModal ? "opacity-20" : ""
        }`}
      >
        <div className="mb-4 mt-8 lg:mt-24 ">
          <h2 className="text-center text-purple-200 text-4xl font-bold mb-2">
            Risky Quizness
          </h2>
          <h2 className="text-center text-purple-300 text-xl">
            Test your knowledge and boast your rankings.
          </h2>
        </div>
        <div className="lg:mt-24">
          <Login
            setShowSignupModal={setShowSignupModal}
            showSignupModal={showSignupModal}
            setShowResetModal={setShowResetModal}
            showResetModal={showResetModal}
          />
        </div>
      </div>
    </div>
  );
};

export default Welcome;

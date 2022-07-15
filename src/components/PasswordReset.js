import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const PasswordReset = ({ setShowResetModal, showResetModal }) => {
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const emailRef = useRef();
  const { passwordReset } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setConfirmation("");
      await passwordReset(emailRef.current.value);
      setConfirmation(
        `Password reset email has been sent to ${emailRef.current.value}.`
      );
      emailRef.current.value = "";
    } catch (err) {
      console.err(err);
      setError(err);
    }
  };

  return (
    <div className="border-2 shadow-md rounded-md w-[400px] bg-white">
      <div className="p-4">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold text-center">Reset Password</h2>

          <FontAwesomeIcon
            className="cursor-pointer"
            onClick={() => setShowResetModal(!showResetModal)}
            icon={faXmark}
          />
        </div>
        <hr className="border mt-4" />
        {error && (
          <div className="rounded-md shadow-md border-2 p-2 text-center bg-red-700 text-white">
            {error}
          </div>
        )}
        {confirmation && (
          <div className="rounded-md shadow-md border-2 p-2 text-center bg-green-600 text-sm text-white">
            {confirmation}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center"
        >
          <div>
            <input
              id="signup-email"
              placeholder="Email"
              ref={emailRef}
              className="mt-4 h-10 border-2 rounded-md p-2 w-[350px]"
            />
          </div>

          <div>
            <button className="w-[350px] border-2 rounded-md px-8 py-2 bg-purple-900 text-white mt-2">
              Send Reset Password Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;

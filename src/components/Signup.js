import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Signup = ({ setShowSignupModal, showSignupModal }) => {
  const [error, setError] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const usernameRef = useRef();
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    if (passwordConfirmRef.current.value !== passwordRef.current.value) {
      return setError("Passwords do not match");
    }

    e.preventDefault();
    try {
      setError("");
      await signup(
        emailRef.current.value,
        passwordRef.current.value,
        usernameRef.current.value
      );
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="border-2 shadow-md rounded-md w-[400px] bg-white">
      <div className="p-4">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>

          <FontAwesomeIcon
            className="cursor-pointer"
            onClick={() => setShowSignupModal(!showSignupModal)}
            icon={faXmark}
          />
        </div>
        <hr className="border mt-4" />
        {error && (
          <div className="rounded-md shadow-md border-2 p-2 text-center bg-red-700 text-white">
            {error}
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
            <input
              id="signup-username"
              placeholder="Username"
              ref={usernameRef}
              className="mt-4 h-10 border-2 rounded-md p-2 w-[350px]"
            />
          </div>
          <div>
            <input
              id="signup-password"
              type="password"
              placeholder="Password"
              ref={passwordRef}
              className="m-4 h-10 border-2 rounded-md p-2 w-[350px]"
            />
          </div>
          <div>
            <input
              id="password-confirm"
              type="password"
              placeholder="Confirm Password"
              ref={passwordConfirmRef}
              className="m-4 h-10 border-2 rounded-md p-2 w-[350px]"
            />
          </div>
          <div>
            <button className="w-[350px] border-2 rounded-md px-8 py-2 bg-green-600 text-white mt-2">
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

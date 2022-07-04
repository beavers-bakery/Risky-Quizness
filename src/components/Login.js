import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = ({
  setShowSignupModal,
  showSignupModal,
  setShowResetModal,
  showResetModal,
}) => {
  const [error, setError] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <>
      <div className="border-2 shadow-md rounded-md w-[400px] bg-white">
        <div className="p-4">
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
                id="email"
                placeholder="Email"
                ref={emailRef}
                className="mt-4 h-10 border-2 rounded-md p-2 w-[350px]"
              />
            </div>
            <div>
              <input
                id="password"
                type="password"
                placeholder="Password"
                ref={passwordRef}
                className="m-4 h-10 border-2 rounded-md p-2 w-[350px]"
              />
            </div>
            <div>
              <button
                className="w-[350px] border-2 rounded-md px-8 py-2 bg-green-900 text-white"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
          <h2
            className="text-center mt-4 underline text-blue-500 hover:opacity-60 cursor-pointer"
            onClick={() => setShowResetModal(!showResetModal)}
          >
            Forgot Password?
          </h2>
          <hr className="border mt-4" />
          <div className="flex flex-col justify-center items-center mt-4">
            <h2>Don't have an account yet?</h2>
            <button
              onClick={() => setShowSignupModal(!showSignupModal)}
              className="w-[350px] border-2 rounded-md px-8 py-2 bg-green-600 text-white mt-2"
            >
              Signup
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

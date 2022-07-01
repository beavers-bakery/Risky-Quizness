import { async } from "@firebase/util";
import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [error, setError] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await login(emailRef.current.value, passwordRef.current.value);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <>
      <div className="border-2 rounded-md w-[400px]">
        <div className="p-4">
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
                className="w-[350px] border-2 rounded-md px-8 py-2 bg-blue-600 text-white"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
          <h2 className="text-center mt-4">Forgot Password?</h2>
          <hr className="border mt-4" />
          <div className="flex flex-col justify-center items-center mt-4">
            <h3>Don't have an account yet?</h3>
            <button className="w-[350px] border-2 rounded-md px-8 py-2 bg-green-600 text-white mt-2">
              Signup
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

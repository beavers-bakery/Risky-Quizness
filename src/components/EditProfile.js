import React, { useRef, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const EditProfile = ({ showEditModal, setShowEditModal, setUserInfo }) => {
  const [error, setError] = useState("");
  const nameRef = useRef();
  const emailRef = useRef();
  const displayNameRef = useRef();
  const { editProfile, user } = useAuth();

  useEffect(() => {
    emailRef.current.value = user?.email;
    displayNameRef.current.value = user?.displayName;
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      setError("");
      editProfile(displayNameRef.current.value, emailRef.current.value);
      setUserInfo({
        email: emailRef.current.value,
        displayName: displayNameRef.current.value,
      });
      setShowEditModal(!showEditModal);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="border-2 shadow-md rounded-md w-[400px] bg-white">
      <div className="p-4">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold text-center">Edit Information</h2>
          <p
            onClick={() => setShowEditModal(!showEditModal)}
            className="cursor-pointer"
          >
            X
          </p>
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
              id="edit-name"
              placeholder="Name"
              ref={nameRef}
              className="mt-4 h-10 border-2 rounded-md p-2 w-[350px]"
            />
          </div>
          <div>
            <input
              id="edit-email"
              placeholder="Email"
              ref={emailRef}
              className="mt-4 h-10 border-2 rounded-md p-2 w-[350px]"
            />
          </div>
          <div>
            <input
              id="edit-display-name"
              placeholder="Display Name"
              ref={displayNameRef}
              className="m-4 h-10 border-2 rounded-md p-2 w-[350px]"
            />
          </div>
          <div>
            <button className="w-[350px] border-2 rounded-md px-8 py-2 bg-green-600 text-white mt-2">
              Submit Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

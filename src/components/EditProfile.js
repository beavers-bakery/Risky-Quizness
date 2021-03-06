import React, { useRef, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EditProfile = ({ showEditModal, setShowEditModal, setUserInfo }) => {
  const [error, setError] = useState("");
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
    <div className="border-2 shadow-md rounded-md px-5 w-[400px] bg-white">
      <div className="p-4">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold text-center">Edit Information</h2>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => setShowEditModal(!showEditModal)}
            className="cursor-pointer"
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
          <div className="mt-4">
            <label htmlFor="edit-email" className="ml-1">
              Email
            </label>
            <input
              id="edit-email"
              placeholder="Email"
              ref={emailRef}
              className=" h-10 border-2 rounded-md p-2 w-[350px]"
            />
          </div>
          <div className="my-4">
            <label htmlFor="edit-display-name" className="ml-1">
              Username
            </label>
            <input
              id="edit-display-name"
              placeholder="Display Name"
              ref={displayNameRef}
              className="h-10 border-2 rounded-md p-2 w-[350px]"
            />
          </div>
          <div>
            <button className="w-[350px] drop-shadow-lg rounded-lg px-8 py-2 bg-purple-600 text-white mt-2">
              Submit Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

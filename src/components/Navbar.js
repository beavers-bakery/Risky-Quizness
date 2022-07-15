import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { faUser, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="drop-shadow-lg fixed w-full top-0 left-0 z-50">
      <div className="md:flex  items-center justify-between bg-purple-500 py-4 text-white md:px-10 px-7">
        <div className="font-bold text-2xl">
          <NavLink to={"/"}>Risky Quizness</NavLink>
        </div>
        <div
          className="text-2xl absolute right-8 top-4 cursor-pointer md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <FontAwesomeIcon icon={faXmark} />
          ) : (
            <FontAwesomeIcon icon={faBars} />
          )}
        </div>
        <div
          className={`flex flex-col md:flex-row items-center md:pb-0 pb-6 absolute z-50 md:static bg-purple-500 left-0 w-full md:w-auto transition-all duration-500 ease-in ${
            open ? "top-15" : "top-[-490px]"
          }`}
        >
          <NavLink
            onClick={() => setOpen(false)}
            to="/"
            className="mx-2 hover:text-gray-300 duration-500 md:ml-8 text-xl md:my-0 my-7"
          >
            Home
          </NavLink>
          <NavLink
            onClick={() => setOpen(false)}
            to="/leaderboard"
            className="mx-2 hover:text-gray-300 duration-500 md:ml-8 text-xl md:my-0 my-7"
          >
            Leaderboard
          </NavLink>
          <NavLink
            onClick={() => setOpen(false)}
            to="/profile"
            className="mx-2 hover:text-gray-300 duration-500 md:ml-8 text-xl md:my-0 my-7"
          >
            <FontAwesomeIcon icon={faUser} className="mr-1 " />
            {user?.displayName}
          </NavLink>
          {user ? (
            <button
              onClick={handleLogout}
              className=" hover:text-gray-300 duration-500 md:ml-8 text-xl md:my-0 my-7"
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

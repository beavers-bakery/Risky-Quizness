import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserScores } from "../contexts/StoreContext";
import EditProfile from "./EditProfile";

const UserProfile = () => {
  const [scores, setScores] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    setUserInfo({ email: user?.email, displayName: user?.displayName });
    const getScores = async () => {
      const userScores = await getUserScores(user?.uid);
      setScores(userScores);
    };
    getScores();
  }, [user]);

  const handleClick = () => {
    setShowEditModal(!showEditModal);
  };

  return (
    <>
      {showEditModal && (
        <div className="flex items-center justify-center relative z-40 py-40">
          <EditProfile
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            setUserInfo={setUserInfo}
          />
        </div>
      )}
      <div
        className={`flex justify-center w-screen h-full relative z-40 py-20 ${
          showEditModal ? "opacity-20" : ""
        }`}
      >
        <div className="mt-8 w-[800px]">
          <div
            id="user_info"
            className="border-2 drop-shadow-lg mx-8 mb-8 px-6 py-4 rounded-md bg-white"
          >
            <h2 className="font-bold text-xl mb-4">User Information</h2>
            <h2>Email: {userInfo.email}</h2>
            <h2>Display Name: {userInfo.displayName}</h2>
            <button
              className="rounded-lg px-8 py-2 drop-shadow-lg bg-purple-600 text-white mt-2"
              onClick={handleClick}
            >
              Edit Information
            </button>
          </div>
          <div
            id="user_scores"
            className=" border-2 drop-shadow-lg m-8 px-6 py-4 rounded-lg bg-white"
          >
            <h2 className="font-bold text-xl mb-4">Recent Scores</h2>
            <div className="flex justify-between mb-2">
              <h2 className="font-bold">Score</h2>
              <h2 className="font-bold">Date</h2>
            </div>
            {scores.map((score, i) => {
              const date = new Date(score.createdAt.seconds * 1000);
              return (
                <div key={i} className="flex justify-between">
                  <h2>{score.score}</h2>
                  <h2>{date.toDateString()}</h2>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;

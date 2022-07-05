import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { collection, where, query, getDocs } from "firebase/firestore";

const UserProfile = () => {
  const [scores, setScores] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const scoresRef = collection(db, "scores");
  const userScoresQuery = query(
    scoresRef,
    where("userId", "==", user.uid || "")
  );

  useEffect(() => {
    const getScores = async () => {
      const scoresSnapshot = await getDocs(userScoresQuery);
      const userScores = scoresSnapshot.docs.map((doc) => {
        return doc.data();
      });
      setScores(userScores);
    };
    getScores();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/welcome");
  };

  return (
    <div>
      <div>
        <button className="m-4" onClick={handleLogout}>
          logout
        </button>
      </div>
      <div
        id="user_info"
        className="border drop-shadow-md mx-8 mb-8 px-6 py-4 rounded-md"
      >
        <h2 className="font-bold text-xl mb-4">User Information</h2>
        <h2>Email: {user?.email}</h2>
        <h2>Name: </h2>
        <button className="border-2 rounded-md px-8 py-2 bg-green-600 text-white mt-2">
          Edit Information
        </button>
      </div>
      <div
        id="user_scores"
        className="border drop-shadow-md m-8 px-6 py-4 rounded-md"
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
  );
};

export default UserProfile;

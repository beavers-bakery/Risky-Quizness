import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  addUserScore,
  addOrUpdateUserGameState,
} from "../contexts/StoreContext";
import { useAuth } from "../contexts/AuthContext";
import ConfettiGenerator from "confetti-js";
import "./result.css";

const Result = () => {
  const { state } = useLocation();
  const { points } = state;
  const { user } = useAuth();

  useEffect(() => {
    const confettiSettings = { target: "my-canvas" };
    const confetti = new ConfettiGenerator(confettiSettings);
    if (points > 40) confetti.render();
    addUserScore(user?.uid, points, "General"); // save score in firestore
    addOrUpdateUserGameState(user?.uid, 0, 0); // reset GameState to 0

    return () => confetti.clear();
    // eslint-disable-next-line
  }, []);
  return (
    <div id="popup" className="h-screen">
      <div className="flex flex-col text-5xl py-40 px-4 items-center">
      {points <= 40 ? (
        <p className="text-6xl font-serif text-[#fff]">
          BETTER LUCK NEXT TIME!
        </p>
      ) : (
        <p className="text-7xl font-serif items-center px-5 text-[#fff] py-5">GREAT WORK!</p>
      )}
        <strong className="text-[#fff]">Your Final Score is {points}</strong>
      </div>
    </div>
  );
};

export default Result;

import { useEffect, useState } from "react";
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
  const [canvas, setCanvas] = useState(false);

  const addCanvas = () => {
    const tag = document.createElement("canvas");
    tag.setAttribute("id", "my-canvas");
    document.body.appendChild(tag);
  };

  useEffect(() => {
    if (!canvas) {
      addCanvas();
      setCanvas(true);
    }
    const confettiSettings = { target: "my-canvas" };
    const confetti = new ConfettiGenerator(confettiSettings);
    if (points > 40) confetti.render();
    addUserScore(user?.uid, points, "General"); // save score in firestore
    addOrUpdateUserGameState(user?.uid, 0, 0); // reset GameState to 0

    return () => {
      confetti.clear();
      const canvas = document.getElementById("my-canvas");
      document.body.removeChild(canvas);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div id="popup">
      <div className="flex flex-col text-5xl px-4 items-center">
        {points <= 40 ? (
          <p className="text-6xl font-serif text-center text-[#fff]">
            BETTER LUCK NEXT TIME!
          </p>
        ) : (
          <p className="text-7xl font-serif text-center px-5 text-[#fff] py-5">
            GREAT WORK!
          </p>
        )}
        <strong className="text-[#fff] text-center">
          Your Final Score is {points}
        </strong>
      </div>
    </div>
  );
};

export default Result;

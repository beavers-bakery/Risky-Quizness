import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { getUserScores, hasFinisedToday } from "../contexts/StoreContext";
import { useEffect, useState } from "react";

const Home = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [userhasFinisedToday, setUserhasFinisedToday] = useState([]);

  // define functions to be called in useEffect
  const getHasUserPlayed = async () => {
    const boolean = await hasFinisedToday(user?.uid);
    setUserhasFinisedToday(boolean);
  };
  const getScores = async () => {
    const userScores = await getUserScores(user?.uid);
    setScores(userScores);
  };

  const maxScore = () => {
    const scoreArr = [];
    scores.map((score) => {
      return scoreArr.push(score.score);
    });
    return scoreArr;
  };

  useEffect(() => {
    getScores();
    getHasUserPlayed();
    // eslint-disable-next-line
  }, [user]);

  const latestScore = (scoresArr) => {
    let chosenScore = scoresArr[0];
    scores.forEach((score) => {
      if (score?.createdAt?.seconds > chosenScore?.createdAt?.seconds)
        chosenScore = score;
    });
    return chosenScore?.score;
  };

  return (
    <>
      <div className="relative h-screen px-5 py-20 z-40 flex flex-col items-center">
        <p className="text-[#fff] w-full text-2xl md:text-3xl text-center px-6 mx-8 py-2 font-extrabold">
          Welcome to Risky Quizness, {user?.displayName}!
        </p>
        <div className="border-2 drop-shadow-lg mx-8 mb-2 px-6 py-4 rounded-md w-full md:max-w-[750px]">
          <strong className="text-[#fff] text-3xl">
            Player: {user?.displayName}{" "}
          </strong>
          <hr className="invisible" />
          <strong className="text-[#fff]">
            Best Score:{" "}
            {!maxScore().length ? " No scores yet!" : Math.max(...maxScore())}
          </strong>
          {userhasFinisedToday && (
            <div>
              <strong className="text-[#fff]">
                Today's Score: {latestScore(scores)}
              </strong>
            </div>
          )}
        </div>

        <div className="border-2 drop-shadow-lg mx-8 mb-2 px-6 py-4 rounded-md mt-6 w-full md:max-w-[750px]">
          <strong className="text-[#fff] text-4xl">Rules of the Game</strong>
          <ul className="text-[#fff] list-disc">
            <li>
              You can only play the game{" "}
              <strong className="text-red-400 text-2xl">once a day</strong>.
            </li>
            <li>You are timed on each question.</li>
            <li>New set of 10 questions daily.</li>
            <li>All users get the same set of questions each day.</li>
            <li>The faster you answer a question, the more points you get!</li>
            <li>Good Luck!</li>
          </ul>
        </div>

        {!userhasFinisedToday && (
          <div className="border-2 drop-shadow-lg mx-8 mb-8 px-6 py-4 rounded-md mt-6 w-full md:max-w-[750px]">
            <Link to="/quiz">
              <button
                type="button"
                className="w-full rounded bg-purple-400 text-[#fff] py-3 font-semibold"
              >
                Start Game
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;

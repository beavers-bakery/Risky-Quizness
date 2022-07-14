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

  useEffect(() => {
    getScores();
    getHasUserPlayed();
    // eslint-disable-next-line
  }, [user]);

  const maxScore = () => {
    const scoreArr = [];
    scores.map((score) => {
      return scoreArr.push(score.score);
    });
    return scoreArr;
  };

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
      <div className="relative h-full px-5 py-20 z-40">
        <div>
          <strong className="text-[#fff]">Player: {user?.displayName} </strong>
          <hr />
          <strong className="text-[#fff]">
            Best Score: {Math.max(...maxScore())}{" "}
          </strong>
          {userhasFinisedToday ? (
            <div>
              <strong className="text-[#fff]">
                Today's Score: {latestScore(scores)}
              </strong>
            </div>
          ) : (
            <Link to="/quiz">
              <button
                type="button"
                className="w-full rounded bg-purple-400 text-[#fff] py-3 font-semibold"
              >
                Start Game
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

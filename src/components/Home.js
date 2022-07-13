import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { getUserScores } from "../contexts/StoreContext";
import { useEffect, useState } from "react";

const Home = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const getScores = async () => {
      const userScores = await getUserScores(user?.uid);
      setScores(userScores);
    };
    getScores();
  }, [user]);

  const maxScore = () => {
    const scoreArr = [];
    scores.map((score) => {
      return scoreArr.push(score.score);
    });
    return scoreArr;
  };

  return (
    <>
      <div className="relative h-full px-5 py-20 z-40">
        <div>
          <strong className="text-[#fff]">Player: {user?.displayName} </strong>
          <hr />
          <strong className="text-[#fff]">Best Score: {Math.max(...maxScore())} </strong>
          <Link to="/quiz">
            <button
              type="button"
              className="w-full rounded bg-purple-400 text-[#fff] py-3 font-semibold"
            >
              Start Game
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;

import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getUserScores } from '../contexts/StoreContext';
import { useEffect, useState } from 'react';

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
      <div
      className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
      {/* className='relative flex h-screen w-screen flex-col bg-[#63B4D1] md:items-center md:justify-center md:bg-[#00CC99]'> */}
        <div>
          <strong>Player: {user?.displayName} </strong>
          <hr />
          <strong>Best Score: </strong>
          {Math.max(...maxScore())}
          <Link to='/quiz'>
            <button
              type='button'
              className='w-full rounded bg-[#90FCF9] py-3 font-semibold'
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

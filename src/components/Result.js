import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { addUserScore } from '../contexts/StoreContext';
import { useAuth } from '../contexts/AuthContext';
import ConfettiGenerator from 'confetti-js';
import './result.css';

const Result = () => {
  const { state } = useLocation();
  const { points } = state;
  const { user } = useAuth();

  useEffect(() => {
    const confettiSettings = { target: 'my-canvas' };
    const confetti = new ConfettiGenerator(confettiSettings);
    if(points > 10)
    confetti.render();
    addUserScore(user?.uid, points, 'General');
    return () => confetti.clear();
    // eslint-disable-next-line
  }, []);

  return (
    <div
      id='popup'
      className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900"
      // className='md:flex md:h-screen md:justify-center lg:justify-center'
    >
      {points <= 10 ? (
        <p className='text-6xl font-serif text-[#b457f2]'>
          NOT THE BRIGHTEST!
        </p>
      ) : (
        <p className='text-7xl font-serif text-[#b457f2] mt-10'>CONGRATS!</p>
      )}
      {/* <p className='text-7xl font-serif text-[#b457f2] mt-10'>CONGRATS!</p> */}
      <div className='flex flex-col text-5xl items-center bg-[#00CC99]'>
          <strong className='text-[#b457f2]'>
            Your Final Score is {points}
          </strong>
      </div>
    </div>
  );
};

export default Result;

import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user, logout } = useAuth();
  console.log(user)

  return (
    <>
      <div className='relative flex h-screen w-screen flex-col bg-[#63B4D1] md:items-center md:justify-center md:bg-[#00CC99]'>
        <div>
          <Link to='/profile'>
            <h2 className='text-center mb-4 w-full rounded bg-[#90FCF9] py-3 font-semibold'>
              Profile
            </h2>
          </Link>
          <strong>Player: {user?.displayName} </strong>
          <hr />
          <strong>Best Score:</strong> {user?.scores}
          <hr />
          <strong>Current Score:</strong> {user?.scores}
          <Link to='/quiz'>
            <button
              type='button'
              className='w-full rounded bg-[#90FCF9] py-3 font-semibold'
            >
              Start Game
            </button>
          </Link>
        </div>
        <div className='w-100 text-center mt-2'>
          <Link to='/welcome'>
            <button
              type='button'
              className='w-full rounded bg-[#90FCF9] py-3 font-semibold md:justify-self-end'
              onClick={logout}
            >
              Log Out
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;

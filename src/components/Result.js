import { useState } from 'react';
import {
  collection,
  orderBy,
  query,
  where,
  limit,
} from 'firebase/firestore';
import Table from './Table';
import { db } from '../firebase';

const Result = () => {
  const [finalResult, setFinalResult] = useState(null);
  const scoresRef = collection(db, 'scores');
  const scores = query(
    scoresRef,
    where('scores', '!=', false),
    orderBy('scores', 'desc'),
    limit(3)
  );

  return (
    <div className='h-screen w-screen bg-[#00CC99]'>
      <div className='flex flex-col items-center bg-[#00CC99]'>
        <h1 className='font-serif text-red-200 mt-10'>Results</h1>
        {finalResult === null ? (
          <></>
        ) : (
          <h2>Your Final Score is {finalResult}</h2>
        )}
        <div className='m-10 items-center'>
          <Table scores={scores} />
        </div>
      </div>
    </div>
  );
};

export default Result;

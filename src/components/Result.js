import { useEffect } from "react";
import { collection, orderBy, query, where, limit } from "firebase/firestore";
import Table from "./Table";
import { db } from "../firebase";
import { useLocation } from "react-router-dom";
import { addUserScore } from "../contexts/StoreContext";
import { useAuth } from "../contexts/AuthContext";

const Result = () => {
  const { state } = useLocation();
  const { points } = state;
  const { user } = useAuth();
  const scoresRef = collection(db, "scores");
  const scores = query(
    scoresRef,
    where("scores", "!=", false),
    orderBy("scores", "desc"),
    limit(3)
  );

  useEffect(() => {
    addUserScore(user?.uid, points, "General");
    // eslint-disable-next-line
  }, []);

  return (
    <div className="h-screen w-screen bg-[#00CC99]">
      <div className="flex flex-col items-center bg-[#00CC99]">
        <h1 className="font-serif text-red-200 mt-10">Results</h1>
        {points === null ? <></> : <h2>Your Final Score is {points}</h2>}
        <div className="m-10 items-center">
          <Table scores={scores} />
        </div>
      </div>
    </div>
  );
};

export default Result;

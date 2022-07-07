import React, { useEffect, useState } from "react";
import { getAllScores } from "../contexts/StoreContext";
import LeaderboardRow from "./LeaderboardRow";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [period, setPeriod] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const scores = await getAllScores();
      setScores(scores);
    };
    getData();
  }, []);

  const between = (data, between) => {
    const today = new Date();
    const previous = new Date(today);
    previous.setDate(previous.getDate() - between);

    const filter = data.filter((val) => {
      const userDate = new Date(val.createdAt?.seconds * 1000);
      if (between === "0") return val;
      return previous <= userDate && today >= userDate;
    });

    return filter.sort((a, b) => b.score - a.score);
  };

  const handleClick = (e) => {
    setPeriod(e.target.dataset.id);
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <h2 className="text-center m-4 font-bold text-3xl">Leaderboard</h2>
      <div className="flex justify-center items-center">
        <button
          onClick={handleClick}
          data-id="0"
          value="all_time"
          className="shadow-sm rounded-md py-1 px-4 m-2 bg-green-600 text-white"
        >
          All Time
        </button>
        <button
          onClick={handleClick}
          data-id="7"
          value="this_week"
          className="shadow-sm border-2 rounded-md py-1 px-4 m-2 bg-green-600 text-white"
        >
          This Week
        </button>
        <button
          onClick={handleClick}
          data-id="1"
          value="today"
          className="shadow-sm border-2 rounded-md py-1 px-4 m-2 bg-green-600 text-white"
        >
          Today
        </button>
      </div>
      <table className="w-screen m-4 border-separate border-spacing-y-2 table-auto max-w-[900px]">
        <tbody>
          <tr className="shadow-md">
            <th className="border-y-2 border-l-2 rounded-md rounded-r-none text-center py-4">
              Rank
            </th>
            <th className="border-y-2 rounded-md rounded-l-none rounded-r-none text-center">
              Username
            </th>
            <th className="border-y-2 rounded-md rounded-l-none rounded-r-none text-center">
              Score
            </th>
            <th className="border-y-2 rounded-md border-r-2 rounded-l-none text-center">
              Date
            </th>
          </tr>

          {between(scores, period).map((score, i) => {
            const date = new Date(score.createdAt?.seconds * 1000);

            return (
              <LeaderboardRow
                key={i}
                rank={i + 1}
                username={score.username}
                score={score.score}
                date={date.toDateString()}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;

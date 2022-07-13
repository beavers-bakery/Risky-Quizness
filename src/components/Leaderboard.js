import React, { useEffect, useState } from "react";
import { getAllScores } from "../contexts/StoreContext";
import LeaderboardRow from "./LeaderboardRow";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [period, setPeriod] = useState("0");
  const [selectedButton, setSelectedButton] = useState("today");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      const scores = await getAllScores();
      setScores(scores);
      setLoading(false);
    };
    getData();
  }, []);

  const between = (data, between) => {
    const today = new Date();
    const previous = new Date(today);
    previous.setDate(previous.getDate() - between);

    const filter = data.filter((val) => {
      const userDate = new Date(val.createdAt.seconds * 1000);
      if (between === "1000") return val;
      if (between === "0") {
        return userDate.toDateString() === today.toDateString();
      }
      return previous <= userDate && today >= userDate;
    });

    return filter.sort((a, b) => b.score - a.score);
  };

  const handleClick = (e) => {
    setPeriod(e.target.dataset.id);
    setSelectedButton(e.target.value);
  };

  return (
    <div className="flex w-full justify-center items-center flex-col">
      {loading ? (
        <h2 className="mt-20 font-bold text-3xl text-white">Loading...</h2>
      ) : (
        <>
          <h2 className="text-center m-4 font-bold text-3xl text-white">
            Leaderboard
          </h2>
          <div className="flex justify-center items-center">
            <button
              onClick={handleClick}
              data-id="1000"
              value="all-time"
              className={`shadow-lg  rounded-md py-1 px-4 m-2 bg-[#62226b] text-white hover:border-2 hover:border-white ease-in duration-50 ${
                selectedButton === "all-time" ? "border-2 border-white" : null
              }`}
            >
              All Time
            </button>
            <button
              onClick={handleClick}
              data-id="7"
              value="this-week"
              className={`shadow-lg  rounded-md py-1 px-4 m-2 bg-[#62226b] text-white hover:border-2 hover:border-white ease-in duration-50 ${
                selectedButton === "this-week" ? "border-2 border-white" : null
              }`}
            >
              This Week
            </button>
            <button
              onClick={handleClick}
              data-id="0"
              value="today"
              className={`shadow-lg   rounded-md py-1 px-4 m-2 bg-[#62226b] text-white hover:border-2 hover:border-white ease-in duration-50 ${
                selectedButton === "today" ? "border-2 border-white" : null
              }`}
            >
              Today
            </button>
          </div>
          {between(scores, period).length < 1 ? (
            <h2>No Scores Available Yet</h2>
          ) : (
            <>
              <table className="w-[95%] m-4 border-separate border-spacing-y-2 table-auto max-w-[900px] ">
                <tbody>
                  <tr className="bg-[#62226b] text-white drop-shadow-xl">
                    <th className="rounded-md rounded-r-none text-center py-4 ">
                      Rank
                    </th>
                    <th className="rounded-md rounded-l-none rounded-r-none text-center">
                      Username
                    </th>
                    <th className="rounded-md rounded-l-none rounded-r-none text-center">
                      Score
                    </th>
                    <th className="rounded-md rounded-l-none text-center">
                      Date
                    </th>
                  </tr>

                  {between(scores, period).map((score, i) => {
                    const date = new Date(score.createdAt?.seconds * 1000);

                    return (
                      <LeaderboardRow
                        key={score.id}
                        rank={i + 1}
                        username={score.username}
                        score={score.score}
                        date={date.toDateString()}
                      />
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboard;

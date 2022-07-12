import React, { useEffect, useState } from "react";
import { fetchMore, getAllScores } from "../contexts/StoreContext";
import LeaderboardRow from "./LeaderboardRow";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [lastDoc, setLastDoc] = useState();
  const [period, setPeriod] = useState("0");
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const scores = await getAllScores(setLastDoc);
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

    return filter;
  };

  const handleClick = (e) => {
    setPeriod(e.target.dataset.id);
  };

  const handleLoadMore = async () => {
    setLoadMoreLoading(true);
    const moreScores = await fetchMore(setLastDoc, lastDoc);
    setLoadMoreLoading(false);

    setScores([...scores, ...moreScores]);
  };

  return (
    <div className="flex justify-center items-center flex-col">
      {loading ? (
        <h2 className="mt-20 font-bold text-3xl">Loading...</h2>
      ) : (
        <>
          <h2 className="text-center m-4 font-bold text-3xl">Leaderboard</h2>
          <div className="flex justify-center items-center">
            <button
              onClick={handleClick}
              data-id="1000"
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
              data-id="0"
              value="today"
              className="shadow-sm border-2 rounded-md py-1 px-4 m-2 bg-green-600 text-white"
            >
              Today
            </button>
          </div>
          {between(scores, period).length < 1 ? (
            <h2>No Scores Available Yet</h2>
          ) : (
            <>
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
          <div>
            {loadMoreLoading ? (
              <h2 className="text-white text-lg">Loading More...</h2>
            ) : (
              <button
                onClick={handleLoadMore}
                className="border-2 rounded-lg py-1 px-4 text-white bg-purple-400"
              >
                Load More
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;

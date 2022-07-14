import React, { useEffect, useState } from "react";
import {
  fetchMore,
  getAllScores,
  getTodayScores,
  fetchMoreToday,
} from "../contexts/StoreContext";
import AllTimeLeaderboard from "./AllTimeLeaderboard";
import TodayLeaderboard from "./TodayLeaderboard";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [lastDoc, setLastDoc] = useState();
  const [selectedButton, setSelectedButton] = useState("today");
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      let scores;
      if (selectedButton === "today") {
        scores = await getTodayScores(setLastDoc);
      } else {
        scores = await getAllScores(setLastDoc);
      }
      setScores(scores);
      setLoading(false);
    };
    getData();
  }, [selectedButton]);

  const handleClick = (e) => {
    setSelectedButton(e.target.value);
  };

  const handleLoadMore = async () => {
    setLoadMoreLoading(true);
    const moreScores = await fetchMore(setLastDoc, lastDoc);
    setLoadMoreLoading(false);

    setScores([...scores, ...moreScores]);
  };

  const handleLoadMoreToday = async () => {
    setLoadMoreLoading(true);
    const moreScores = await fetchMoreToday(setLastDoc, lastDoc);
    setLoadMoreLoading(false);

    setScores([...scores, ...moreScores]);
  };

  return (
    <div className="flex relative z-40 py-20 h-full w-full justify-center items-center flex-col">
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
              className={`shadow-lg rounded-md py-2 px-6 m-2 bg-purple-700 text-white hover:border-2 hover:border-white ease-in duration-50 ${
                selectedButton === "all-time" ? "border-2 border-white" : null
              }`}
            >
              All Time
            </button>

            <button
              onClick={handleClick}
              data-id="0"
              value="today"
              className={`shadow-lg rounded-md py-2 px-6 m-2 bg-purple-700 text-white hover:border-2 hover:border-white ease-in duration-50 ${
                selectedButton === "today" ? "border-2 border-white" : null
              }`}
            >
              Today
            </button>
          </div>
          {scores.length < 1 ? (
            <h2>No Scores Available Yet</h2>
          ) : (
            <>
              <table className="w-[95%] m-4 border-separate border-spacing-y-2 table-auto max-w-[900px] ">
                <tbody>
                  <tr className="bg-purple-700 text-white drop-shadow-xl">
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
                  {selectedButton === "today" ? (
                    <TodayLeaderboard scores={scores} />
                  ) : (
                    <AllTimeLeaderboard scores={scores} />
                  )}
                </tbody>
              </table>
              <div>
                {loadMoreLoading ? (
                  <h2 className="text-white text-lg">Loading More...</h2>
                ) : (
                  <button
                    onClick={
                      selectedButton === "today"
                        ? handleLoadMoreToday
                        : handleLoadMore
                    }
                    className="drop-shadow-lg rounded-lg py-2 px-6 text-white bg-purple-400"
                  >
                    Load More
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboard;

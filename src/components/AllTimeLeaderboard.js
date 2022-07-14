import React from "react";
import LeaderboardRow from "./LeaderboardRow";

const AllTimeLeaderboard = ({ scores }) => {
  return (
    <>
      {scores.map((score, i) => {
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
    </>
  );
};

export default AllTimeLeaderboard;

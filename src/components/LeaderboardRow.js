import React from "react";

const LeaderboardRow = ({ rank, username, score, date }) => {
  return (
    <tr className="bg-purple-400 text-white text-lg drop-shadow-xl">
      <td className="rounded-md rounded-r-none text-center py-4">{rank}</td>
      <td className="rounded-md rounded-l-none rounded-r-none text-center">
        {username}
      </td>
      <td className="rounded-md rounded-l-none rounded-r-none text-center">
        {score}
      </td>
      <td className="rounded-md rounded-l-none text-center">{date}</td>
    </tr>
  );
};

export default LeaderboardRow;

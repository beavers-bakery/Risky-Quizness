import React from "react";

const LeaderboardRow = ({ rank, username, score, date }) => {
  return (
    <tr className="bg-purple-500 text-white md:text-lg drop-shadow-xl">
      <td className="rounded-md rounded-r-none text-center py-2 md:py-4">
        {rank}
      </td>
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

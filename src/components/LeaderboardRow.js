import React from "react";

const LeaderboardRow = ({ rank, username, score, date }) => {
  return (
    <tr className="shadow-md">
      <td className="border-y-2 border-l-2 rounded-md rounded-r-none text-center py-4">
        {rank}
      </td>
      <td className="border-y-2 rounded-md rounded-l-none rounded-r-none text-center">
        {username}
      </td>
      <td className="border-y-2 rounded-md rounded-l-none rounded-r-none text-center">
        {score}
      </td>
      <td className="border-y-2 rounded-md border-r-2 rounded-l-none text-center">
        {date}
      </td>
    </tr>
  );
};

export default LeaderboardRow;

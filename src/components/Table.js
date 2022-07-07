const Table = ({ scores }) => {
  return (
    <table className='bg-[#00CC99]'>
      <div className='bg-[#00CC99]' sx={{ minWidth: 650 }}>
        {scores?.length > 0 && (
          <header className='bg-[#00CC99]'>
            <tr>
              <th className='font-serif text-red-200 items-center justify-center'>Today's Top 3 Scores</th>
            </tr>
          </header>
        )}
        {scores.length > 0 ? (
          scores.map((score) => {
            return (
              <tr className="font-serif text-gray-500 mt-44">
                <td className="p-20 m-15 h-120">Player Score: {score}</td>
              </tr>
            );
          })
        ) : (
          <div className='bg-[#00CC99]'>
            <p>No Data to Show</p>
          </div>
        )}
      </div>
    </table>
  );
};

export default Table;

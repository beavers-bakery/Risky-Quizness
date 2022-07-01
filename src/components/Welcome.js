import React from "react";
import Login from "./Login";

const Welcome = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 mt-8">
        <h2 className="text-center">Risky Quizness</h2>
        <h4 className="text-center">
          Test your knowledge and boast your rankings
        </h4>
      </div>
      <div className="">
        <Login />
      </div>
    </div>
  );
};

export default Welcome;

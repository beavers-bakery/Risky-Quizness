import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { addUserScore } from "../../contexts/StoreContext";

const CreateScore = () => {
  const scoreRef = useRef();
  const categoryRef = useRef();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async function (evt) {
    evt.preventDefault();
    await addUserScore(
      user.uid,
      scoreRef.current.value,
      categoryRef.current.value
    );
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      {console.log(user)}
      <label htmlFor="score">Score:</label>
      <input placeholder="score 0" ref={scoreRef} />
      <label htmlFor="category">Category:</label>
      <input placeholder="input" ref={categoryRef} />
      <button className="submit-button" type="submit">
        Submit
      </button>
    </form>
  );
};

export default CreateScore;

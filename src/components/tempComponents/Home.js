import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getTodaysQuestions, getUserScores } from "../../contexts/StoreContext";

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log(user);

  const clickHandler = async (evt) => {
    evt.preventDefault();
    await logout();
    alert("you have logged out");
    navigate("/welcome");
  };

  const scoreHandler = async (evt) => {
    evt.preventDefault();
    const scores = await getUserScores(user.uid);
    console.log(scores);
  };

  const queryTest = async (evt) => {
    evt.preventDefault();
    await getTodaysQuestions();
  };

  return (
    <div>
      <div>
        <button onClick={clickHandler}> clickhere to logout</button>
      </div>
      <div>
        <button onClick={queryTest}>clickhere to test function</button>
      </div>
      <div>
        <button onClick={scoreHandler}> clickhere to console log scores</button>
      </div>
      <div>You are at the home landing page {user.email} </div>
    </div>
  );
}

export default Home;

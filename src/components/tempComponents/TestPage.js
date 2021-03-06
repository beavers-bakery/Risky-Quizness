import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  hasFinisedToday,
  getTodaysQuestions,
  seedAllQuestions,
} from "../../contexts/StoreContext";

function Testpage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log(user);

  const clickHandler = async (evt) => {
    evt.preventDefault();
    await logout();
    alert("you have logged out");
    navigate("/welcome");
  };

  const hasPlayed = async (evt) => {
    evt.preventDefault();
    console.log(await hasFinisedToday(user.uid));
  };

  const getQuestions = async (evt) => {
    evt.preventDefault();
    console.log(await getTodaysQuestions(user.uid));
  };

  return (
    <div>
      <div>
        <button onClick={clickHandler}> clickhere to logout</button>
      </div>
      <div>
        <button onClick={hasPlayed}>clickhere to test hasplayed today</button>
      </div>
      <div>
        <button onClick={getQuestions}>
          clickhere to test questions retrieved
        </button>
      </div>
      <div>
        <button onClick={seedAllQuestions}>
          clickhere to test the funciton
        </button>
      </div>
      <div>
        You are at the Testpage landing page, Welcome Mrs./Mr. {user.email}{" "}
      </div>
    </div>
  );
}

export default Testpage;

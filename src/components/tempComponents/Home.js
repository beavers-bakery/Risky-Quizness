import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUserScore } from "../../contexts/StoreContext";

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
    const scores = await getUserScore(user.uid);
    console.log(scores);
  };

  return (
    <div>
      <div>
        <button onClick={clickHandler}> clickhere to logout</button>
      </div>
      <div>
        <button onClick={scoreHandler}> clickhere to console log scores</button>
      </div>
      <div>You are at the home landing page {user.email} </div>
    </div>
  );
}

export default Home;

import Welcome from "./components/Welcome";
import UserProfile from "./components/UserProfile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Quizpage from "./components/Quizpage";
import Navbar from "./components/Navbar";
import { useAuth } from "./contexts/AuthContext";
import Leaderboard from "./components/Leaderboard";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      {user && <Navbar />}

      <Routes>
        <Route path="/" element={user ? <Home /> : <Welcome />} />
        <Route path="/profile" element={user ? <UserProfile /> : <Welcome />} />
        <Route path="/quiz" element={user ? <Quizpage /> : <Welcome />} />
        <Route path="/leaderboard" element={user ? <Leaderboard /> : <Welcome />} />
      </Routes>
    </Router>
  );
}

export default App;

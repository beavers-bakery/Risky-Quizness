import Welcome from "./components/Welcome";
import UserProfile from "./components/UserProfile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Quizpage from "./components/Quizpage";
import Navbar from "./components/Navbar";
import Result from "./components/Result";
import { useAuth } from "./contexts/AuthContext";
import Leaderboard from "./components/Leaderboard";
import Testpage from "./components/tempComponents/TestPage";

function App() {
  const { user } = useAuth();

  return (
    <div className="h-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Home /> : <Welcome />} />
        <Route path="/profile" element={user ? <UserProfile /> : <Welcome />} />
        <Route path="/quiz" element={user ? <Quizpage /> : <Welcome />} />
        <Route
          path="/leaderboard"
          element={user ? <Leaderboard /> : <Welcome />}
        />
        <Route path="/result" element={user ? <Result /> : <Welcome />} />
        <Route path="/testpage" element={<Testpage />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;

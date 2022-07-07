import Welcome from "./components/Welcome";
import UserProfile from "./components/UserProfile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Quizpage from "./components/Quizpage";
import Home from "./components/tempComponents/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/quiz" element={<Quizpage />} />
      </Routes>
    </Router>
  );
}

export default App;

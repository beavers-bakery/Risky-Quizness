import Welcome from "./components/Welcome";
import UserProfile from "./components/UserProfile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Quizpage from "./components/Quizpage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/quiz" element={<Quizpage />} />
      </Routes>
    </Router>
  );
}

export default App;


import Welcome from "./components/Welcome";
import UserProfile from "./components/UserProfile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Quizpage from "./components/Quizpage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/quiz" element={<Quizpage />} />
      </Routes>
    </Router>
  );
}

export default App;

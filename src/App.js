import Welcome from "./components/Welcome";
import Home from "./components/tempComponents/Home";
import CreateScore from "./components/tempComponents/CreateScore";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/createScore" element={<CreateScore />} />
      </Routes>
    </Router>
  );
}

export default App;

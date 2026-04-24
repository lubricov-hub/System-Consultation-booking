import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Dashboard from "./Pages/dashboard";


function NotFound() {
  return <h1>❌ 404 Not Found</h1>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
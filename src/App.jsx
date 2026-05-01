import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import "./App.css";

import About from "./Pages/About";
import HomePage from "./Pages/HomePage";
import BookingPage from "./Pages/BookingPage";
import ConfirmedPage from "./Pages/ConfirmedPage";
import AppointmentsPage from "./Pages/AppointmentsPage";
import loginPage from "./Pages/LoginPage";




function NotFound() {
  return <h1>❌ 404 Not Found</h1>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/about" element={<About/>}/>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/booking" element={<BookingPage/>}/>
        <Route path="/confirmed" element={<confirmendPage/>}/>
        <Route path="/appointments" element={<AppointmentsPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
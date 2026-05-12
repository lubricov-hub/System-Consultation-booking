import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

import About from "./Pages/About";
import HomePage from "./Pages/HomePage";
import BookingPage from "./Pages/BookingPage";
import ConfirmedPage from "./Pages/ConfirmedPage";
import AppointmentsPage from "./Pages/AppointmentPage";
import LoginPage from "./Pages/LoginPage";
import TeacherModule from "./Teacher/TeacherModule";
import AdminModule from "./Admin/AdminModule";
import Register from "./Pages/Register";

import ProtectedRoute from "./ProtectedRoute";

function NotFound() {
  return <h1>❌ 404 Not Found</h1>;
}

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/confirmed" element={<ConfirmedPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />

        {/* Admin Only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminModule />
            </ProtectedRoute>
          }
        />

        {/* Teacher Only */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherModule />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
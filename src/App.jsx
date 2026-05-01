import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import "./App.css";

import About from "./Pages/About";
import HomePage from "./Pages/HomePage";
import BookingPage from "./Pages/BookingPage";
import ConfirmedPage from "./Pages/ConfirmedPage";
import AppointmentsPage from "./Pages/AppointmentPage";
import LoginPage from "./Pages/LoginPage";
import TeacherModule from "./Pages/TeacherModule";
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

        {/* Home (must be logged in) */}
        <Route
          path="/"
          element={
            <ProtectedRoute requiredRole="student">
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Booking (must be logged in) */}
        <Route
          path="/booking"
          element={
            <ProtectedRoute requiredRole="student">
              <BookingPage />
            </ProtectedRoute>
          }
        />

        {/* Confirmed (must be logged in) */}
        <Route
          path="/confirmed"
          element={
            <ProtectedRoute requiredRole="student">
              <ConfirmedPage />
            </ProtectedRoute>
          }
        />

        {/* Appointments (must be logged in) */}
        <Route
          path="/appointments"
          element={
            <ProtectedRoute requiredRole="student">
              <AppointmentsPage />
            </ProtectedRoute>
          }
        />

        {/* Teacher ONLY */}
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
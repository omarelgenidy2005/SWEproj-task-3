import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ForgotPassword from "./components/auth/ForgotPassword";
import ProfilePage from "./components/auth/ProfilePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home.jsx";

import EventList from "./components/events/EventList";
import EventDetails from "./components/events/EventDetails";
import EventForm from "./components/events/EventForm";
import MyEventsPage from "./components/events/MyEventsPage";
import EventAnalytics from "./components/events/EventAnalytics";
import AdminEventsPage from "./components/events/AdminEventsPage"; // ✅ Admin page
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetails />} />

          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/my-events" element={<ProtectedRoute><MyEventsPage /></ProtectedRoute>} />
          <Route path="/my-events/new" element={<ProtectedRoute><EventForm /></ProtectedRoute>} />
          <Route path="/my-events/:id/edit" element={<ProtectedRoute><EventForm editMode={true} /></ProtectedRoute>} />
          <Route path="/my-events/:id/analytics" element={<ProtectedRoute><EventAnalytics /></ProtectedRoute>} />

          {/* Admin-only */}
          <Route path="/admin/events" element={<ProtectedRoute><AdminEventsPage /></ProtectedRoute>} />
        </Routes>
         {/* ✅ Add this just below Routes */}
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPassword from './components/auth/ForgotPassword';
import ProfilePage from './components/ProfilePage';
import ProtectedRoute from './routes/ProtectedRoute';
import EventDetails from './pages/EventDetails';
import UserBookingsPage from "./pages/UserBookingsPage";
import { AuthProvider } from './context/AuthContext';
import EventList from "./components/events/EventList";
import EventDetails from "./components/events/EventDetails";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/*  Public Event Routes */}
          <Route path="/events" element={<EventList />} />

         
          
          <Route path="/events/:id" element={<EventDetails />} />
          {/* ✅ Protected route for authenticated users */}
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/bookings"
      element={
        <ProtectedRoute>
          <UserBookingsPage />
        </ProtectedRoute>
      }
    />
        </Routes>
      </Router>
    </AuthProvider>
  );
  
}

export default App;

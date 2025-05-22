import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ForgotPassword from "./components/auth/ForgotPassword";
import ProfilePage from "./components/auth/ProfilePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

// Event components
import EventList from "./components/events/EventList";
import EventDetails from "./components/events/EventDetails";
import EventForm from "./components/events/EventForm"; // Add this import

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Public Event Routes */}
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetails />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          
          {/* New Event Form Routes - Add these exactly as shown below */}
          <Route path="/my-events/new" element={<ProtectedRoute><EventForm /></ProtectedRoute>}/>
          <Route path="/my-events/:id/edit" element={<ProtectedRoute><EventForm editMode={true} /></ProtectedRoute>}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
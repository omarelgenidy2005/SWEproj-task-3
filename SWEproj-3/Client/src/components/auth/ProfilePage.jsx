import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UpdateProfileForm from "./UpdateProfileForm";
import NavBar from '../common/NavBar';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/v1/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p style={styles.error}>{error}</p>;
  if (!userData) return <p style={styles.loading}>Loading profile...</p>;

  return (
    <>
      <NavBar />
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.leftSection}>
            <div style={styles.patternOverlay}></div>
            <div style={styles.decorativeShape}>
              <div style={styles.logo}>
                <span style={styles.logoText}>mate</span>
                <span style={styles.logoNumber}>7</span>
                <span style={styles.logoText}>gez</span>
              </div>
              <p style={styles.tagline}>Your gateway to amazing events</p>
            </div>
          </div>
          <div style={styles.rightSection}>
            <div style={styles.profileContainer}>
              <h2 style={styles.title}>My Profile</h2>
              {!editing ? (
                <div style={styles.infoContainer}>
                  <div style={styles.infoRow}>
                    <strong style={styles.label}>Name</strong>
                    <span style={styles.value}>{userData.name}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <strong style={styles.label}>Email</strong>
                    <span style={styles.value}>{userData.email}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <strong style={styles.label}>Role</strong>
                    <span style={styles.value}>{userData.role}</span>
                  </div>

                  <div style={styles.buttonGroup}>
                    {userData.role === "Organizer" && (
                      <>
                        <button onClick={() => navigate("/my-events")} style={styles.button}>
                          My Events
                        </button>
                        <button onClick={() => navigate("/my-events/new")} style={styles.button}>
                          Create New Event
                        </button>
                      </>
                    )}
                    {userData.role === "System Admin" && (
                      <>
                        <button onClick={() => navigate("/admin/events")} style={styles.button}>
                          View All Events
                        </button>
                        <button onClick={() => navigate("/admin/users")} style={styles.button}>
                          View All Users
                        </button>
                      </>
                    )}
                    <button onClick={() => setEditing(true)} style={styles.button}>
                      Edit Profile
                    </button>
                  </div>
                </div>
              ) : (
                <UpdateProfileForm
                  initialData={userData}
                  onCancel={() => setEditing(false)}
                  onUpdate={(updatedUser) => {
                    setUserData(updatedUser);
                    setEditing(false);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingTop: '60px',
  },
  container: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#ffffff',
  },
  leftSection: {
    flex: '0.4',
    backgroundColor: '#1FCBB5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    position: 'relative',
    overflow: 'hidden',
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    background: `
      linear-gradient(45deg, transparent 45%, #fff 45%, #fff 55%, transparent 55%),
      linear-gradient(-45deg, transparent 45%, #fff 45%, #fff 55%, transparent 55%),
      linear-gradient(135deg, transparent 45%, #fff 45%, #fff 55%, transparent 55%),
      linear-gradient(-135deg, transparent 45%, #fff 45%, #fff 55%, transparent 55%)
    `,
    backgroundSize: '40px 40px',
    backgroundPosition: '0 0, 20px 0, 0 20px, 20px 20px',
    transform: 'rotate(15deg) scale(2)',
    pointerEvents: 'none',
  },
  decorativeShape: {
    textAlign: 'center',
    color: '#ffffff',
    position: 'relative',
    zIndex: 1,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '3.5rem',
    fontWeight: '600',
    marginBottom: '20px',
    letterSpacing: '-0.02em',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  logoText: {
    color: '#4A4A4A',
    textTransform: 'lowercase',
    fontWeight: '600',
  },
  logoNumber: {
    color: '#ffffff',
    margin: '0 1px',
    fontWeight: '600',
  },
  tagline: {
    fontSize: '1.4rem',
    opacity: '1',
    color: '#ffffff',
    fontWeight: '500',
    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
    lineHeight: '1.4',
  },
  rightSection: {
    flex: '0.6',
    padding: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  profileContainer: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '2rem',
    color: '#1e1e1e',
    marginBottom: '30px',
    fontWeight: '600',
    textAlign: 'center',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  label: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: '1rem',
    color: '#1e1e1e',
    fontWeight: '500',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#1FCBB5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#1ab4a0',
      transform: 'translateY(-1px)',
    },
  },
  error: {
    color: '#dc3545',
    textAlign: 'center',
    padding: '20px',
    fontSize: '1rem',
  },
  loading: {
    color: '#1FCBB5',
    textAlign: 'center',
    padding: '20px',
    fontSize: '1rem',
  },
};

export default ProfilePage;

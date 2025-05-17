import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);

    if (res.success) {
      navigate('/profile');
    } else {
      setError(res.message);
    }
  };

  return (
  <div style={styles.page}>
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Login</button>

        {/* 🔗 Forgot Password Link */}
        <Link to="/forgot-password" style={styles.link}>Forgot Password?</Link>
      </form>
    </div>
  </div>
);

}

const styles = {
  page: {
  height: '100vh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'radial-gradient(circle at top left, #0f2027, #203a43, #2c5364)',
},

  container: {
    maxWidth: '400px',
    width: '100%',
    padding: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
    textAlign: 'center',
    fontFamily: 'Inter, sans-serif',
  },
  title: {
    marginBottom: '25px',
    fontSize: '28px',
    fontWeight: '600',
    color: '#1f1f1f',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
  padding: '14px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f8f8f8',
  color: '#000',
 outline: 'none',
 
},

  button: {
    padding: '14px',
    fontSize: '16px',
    backgroundColor: '#0077cc',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.3s',
  },
  link: {
    fontSize: '14px',
    marginTop: '8px',
    color: '#0077cc',
    textDecoration: 'none',
    fontWeight: '500',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
};

export default LoginForm;

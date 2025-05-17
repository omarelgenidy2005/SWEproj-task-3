import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.put('/api/v1/forgetPassword', {
        email,
        newPassword,
      });

      const successMsg = res.data.msg || 'Password updated successfully!';
      setMessage(successMsg);
      setSuccess(successMsg);

      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const errMsg =
        err.response?.data?.message || err.response?.data?.msg || 'Error resetting password';
      setError(errMsg);
    }
  };
  return (
  <div style={styles.page}>
    <div style={styles.container}>
      <h2 style={styles.title}>Reset Password</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}
        <button type="submit" style={styles.button}>Reset Password</button>
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
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
    textAlign: 'center',
    fontFamily: 'Inter, sans-serif',
  },
  title: {
    marginBottom: '25px',
    fontSize: '26px',
    fontWeight: '600',
    color: '#1f1f1f',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
input: {
  padding: '12px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  color: '#000',           
  backgroundColor: '#fff'   
  
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
  error: {
    color: 'red',
    fontSize: '14px',
  },
  success: {
    color: 'green',
    fontSize: '14px',
  },
};

export default ForgotPassword;

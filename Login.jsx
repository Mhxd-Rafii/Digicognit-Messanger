import React, { useState } from 'react';
import './Login.css';
import Developer from '../assets/software.jpg';
import axios from 'axios';

const LoginForm = ({ setIsLoggedIn, setUser, onUserSignup }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = {
      email,
      password,
      ...(isSignup && { name }),
    };
  
    try {
      const endpoint = isSignup ? 'http://localhost:5000/api/signup' : 'http://localhost:5000/api/login';
      const response = await axios.post(endpoint, formData);
  
      if (response.status === 200 || response.status === 201) {
        if (isSignup) {
          alert('Signup successful! You can now log in.');
          setIsSignup(false);
          onUserSignup(); // Refresh user list if needed
        } else {
          alert('Login successful!');
          localStorage.setItem('token', response.data.token); // Store token
          setIsLoggedIn(true);
          setUser(response.data.user);
        }
      }
    } catch (error) {
      console.error('Request error:', error);
      alert(error.response?.data?.message || 'An error occurred');
    }
  };
  
  

  const toggleForm = () => {
    setIsSignup(prev => !prev);
  };

  return (
    <div className={`login-form-container ${isSignup ? 'signup-mode' : ''}`}>
      <input type="checkbox" id="login-toggle" className="login-toggle" checked={isSignup} onChange={toggleForm} />

      <div className="login-forms">
        <div className="image-section">
          <img src={Developer} alt="Developer" />
        </div>
        <div className="form-section">
          {!isSignup ? (
            <div className="login-form">
              <div className="title">Login</div>
              <form onSubmit={handleSubmit}>
                <div className="input-boxes">
                  <div className="input-box">
                    <i className="fas fa-envelope"></i>
                    <input
                      type="text"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <i className="fas fa-lock"></i>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="text"><a href="#">Forgot password?</a></div>
                  <div className="button input-box">
                    <input type="submit" value="Submit" />
                  </div>
                  <div className="text signup-text">
                    Don't have an account? <label htmlFor="login-toggle">Signup now</label>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="signup-form">
              <div className="title">Signup</div>
              <form onSubmit={handleSubmit}>
                <div className="input-boxes">
                  <div className="input-box">
                    <i className="fas fa-user"></i>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <i className="fas fa-envelope"></i>
                    <input
                      type="text"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <i className="fas fa-lock"></i>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="button input-box">
                    <input type="submit" value="Submit" />
                  </div>
                  <div className="text signup-text">
                    Already have an account? <label htmlFor="login-toggle">Login now</label>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
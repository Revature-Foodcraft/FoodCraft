import React, { useState } from 'react';
import '../css/Login.css';
import foodCraftLogo from '../assets/FoodCraft-Logo.png';
import backgroundVideo from '../assets/login-background.mp4';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Button Click')
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem('token', data.token);
      alert('Login successful!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <video autoPlay loop muted className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      <div className="login-box">
        <div>
          <img src={foodCraftLogo} alt="FoodCraft Logo" className="logo" />
        </div>

        <h2 id="loginWords">Login to FoodCraft</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleLogin}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              required
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="button-container">
            <button type="submit">Login</button>
            <button type="button" className="register-button">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

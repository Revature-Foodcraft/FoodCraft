import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Register.module.css';
import foodCraftLogo from '../assets/FoodCraft-Logo.png';
import backgroundVideo from '../assets/backroundRegister.mp4';
import { AuthContext } from '../Components/Contexts';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const {setLogInStatus} = useContext(AuthContext)
  const nav = useNavigate()
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password,
          email,
          firstname,
          lastname
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      try{
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        localStorage.setItem('token', (await response.json()).token)
        setLogInStatus(true)
        nav('/')
        
      } catch(err:any){
        setError(err)
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <video autoPlay loop muted className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="login-box">
        <div>
          <img src={foodCraftLogo} alt="FoodCraft Logo" className="logo" />
        </div>

        <h2 id="loginWords">Register to FoodCraft</h2>

        {error && <p className="error">{error}</p>}
        {/* {success && <p className="success">{success}</p>} */}

        <form onSubmit={handleRegister}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              required
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
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
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@example.com"
            />
          </div>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="firstname"
              required
              className="input-field"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="John"
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastname"
              required
              className="input-field"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Doe"
            />
          </div>
          <div className="button-container">
            <button type="submit" className="auth-button">Register</button>
            <Link to="/login" className="auth-button-link">
              <button type="button" className="auth-button">Login</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

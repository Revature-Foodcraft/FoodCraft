import React, { useContext, useState } from 'react';
import '../css/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import foodCraftLogo from '../assets/FoodCraft-Logo.png';
import backgroundVideo from '../assets/login-background.mp4';
import { AuthContext } from '../Components/Contexts';
import { GoogleLogin } from '@react-oauth/google';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {setLogInStatus} = useContext(AuthContext)
  const nav = useNavigate()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      
      setLogInStatus(true)
      nav('/')
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSuccess =  async (credentialResponse:any) => {
    try{
      const response = await fetch('http://localhost:5000/auth/google',{
        method: 'POST',
        headers:{"Authorization": `Bearer ${credentialResponse.credential}`}
      })
      
      if(response.status == 200){
        const data = await response.json()
        localStorage.setItem('token', data.token);
        setLogInStatus(true)
        nav('/')
      }
    }catch(error:any){
      setError(error.message)
    }
  };

  const handleError = () => {
    console.error("Login Failed");
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
            <button type="submit" className="auth-button">Login</button>
            <Link to="/register" className="auth-button-link">
              <button type="button" className="auth-button register-button">Register</button>
            </Link>
          </div>
          <div >
            <p className='mt-3'>or</p>
            <div className='d-flex justify-content-center'>
              <GoogleLogin onSuccess={handleSuccess} onError={handleError}/>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

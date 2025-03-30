// src/Login.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div>
      <h1>Login to FoodCraft</h1>
      <form>
        <div>
          <label>Username:</label>
          <input type="text" name="username" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <Link to="/register">
        <button>Register</button>
      </Link>
    </div>
  );
};

export default Login;

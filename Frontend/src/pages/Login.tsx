// src/Login.tsx
import React from 'react';

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
    </div>
  );
};

export default Login;

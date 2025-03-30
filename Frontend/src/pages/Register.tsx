import React from 'react';

const Register: React.FC = () => {
  return (
    <div>
      <h1>Register to FoodCraft</h1>
      <form>
        <div>
          <label>Username:</label>
          <input type="text" name="username" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

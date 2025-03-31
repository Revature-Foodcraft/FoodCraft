import React from 'react';
import styles from '../css/Register.module.css';
import foodcraftLogo from '../assets/FoodCraft-Logo.png';
import backgroundVideo from '../assets/backroundRegister.mp4';

const Register: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      <video autoPlay loop muted className={styles.bgVideo}>
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay element */}
      <div className={styles.overlay}></div>

      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <img src={foodcraftLogo} alt="FoodCraft Logo" className={styles.logo} />
          <h2 className={styles.title}>Register to FoodCraft</h2>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                required
              />
            </div>
            <button type="submit" className={styles.button}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

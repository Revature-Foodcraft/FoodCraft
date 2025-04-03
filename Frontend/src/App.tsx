
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Home from "./pages/Home";
<<<<<<< HEAD
import Reviews from './pages/Reviews';
// Main App component with routing
=======
import Ratings from './pages/Ratings';
import Header from './Components/Header';
import Profile from './pages/Profile';
import Recipe from './pages/Recipe';
import { AuthContext } from './Components/Contexts';

>>>>>>> 9b60d7f6a86a3f63817359be56f7ca7938ab8e44
const App: React.FC = () => {
  const [isLoggedIn,setLogInStatus] = useState(false)

  return (
<<<<<<< HEAD
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/reviews" element={<Reviews />} />
      </Routes>
    </Router>
=======
    <div>
      <AuthContext.Provider value={{isLoggedIn,setLogInStatus}}>
        <div className="d-grid container-fluid" style={{backgroundColor:"lightblue"}}>
          <div className="row mb-0">
            <Header/>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/profile' element={<Profile/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/recipe" element={<Recipe />} />
        </Routes>
      </AuthContext.Provider>
    </div>

>>>>>>> 9b60d7f6a86a3f63817359be56f7ca7938ab8e44
  );
};

export default App;

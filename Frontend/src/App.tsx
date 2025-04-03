
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Home from "./pages/Home"
import Header from './Components/Header';
import Profile from './pages/Profile';
import { AuthContext } from './Components/Contexts';

const App: React.FC = () => {
  const [isLoggedIn,setLogInStatus] = useState(false)

  return (
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
        </Routes>
      </AuthContext.Provider>
    </div>

  );
};

export default App;

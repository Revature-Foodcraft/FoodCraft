
import React, { useState,useEffect } from 'react';
import { Navigate, Route, Routes} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Home from "./pages/Home";
import Header from './Components/Header';
import Profile from './pages/Profile';
import Recipe from './pages/Recipe';
import SaveRecipe from './pages/saveRecipe';
import Reviews from './pages/Reviews'
import { AuthContext } from './Components/Contexts';
import { ProtectedRoute } from './Components/ProtectedRoutes';

// function ProtectedRoute( isLoggedIn:boolean, children:any ) {
//   return isLoggedIn ? children : <Navigate to="/" />;
// }

const App: React.FC = () => {
  const [isLoggedIn,setLogInStatus] = useState(false)
  
  useEffect(()=>{
    if(localStorage.getItem("token")){
        setLogInStatus(true)
    }
  })

  return (
    <div>
      <AuthContext.Provider value={{isLoggedIn,setLogInStatus}}>
        <div className="d-grid container-fluid" style={{backgroundColor:"lightblue"}}>
          <div className="row mb-0">
            <Header/>
          </div>
        </div>
        <Routes>
          <Route path="/recipe/:source/:id" element={<Recipe />} />
          <Route path="/" element={<Home />} />
          <Route path='/profile' element={<ProtectedRoute isLoggedIn={isLoggedIn}><Profile/></ProtectedRoute>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipes" element={<Recipe />} />
          <Route path="/recipes/reviews" element={<Reviews />}/>
          <Route path="/account" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Account/></ProtectedRoute>}>
            <Route path="saveRecipe" element={<SaveRecipe />} />
          </Route>
          <Route path="/recipe/:id" element={<Recipe/>}/>
          {/* <Route path='*' element={<Navigate to="/404"/>}/> */}
        </Routes>
      </AuthContext.Provider>
    </div>

  );
};

export default App;

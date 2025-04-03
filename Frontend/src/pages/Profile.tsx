import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Components/Contexts";

const Profile: React.FC = () => {
    const nav = useNavigate()
      const {setLogInStatus} = useContext(AuthContext)
    
    const handleLogout = ()=>{
        
        localStorage.removeItem("token")
        setLogInStatus(false)
        nav('/')
      }
    
      return (
        <>
        Profile
        <button onClick={handleLogout}>Logout</button>
        </>
      );
    };
  
  export default Profile
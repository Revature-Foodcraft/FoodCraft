import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Components/Contexts";
import UpdatePopup from "../Components/Profile/UpdatePopup";
import { GoogleLogin } from "@react-oauth/google";

const Profile: React.FC = () => {
  const [profileInfo,setProfileInfo] = useState<any>(null)
  const nav = useNavigate()
  const {setLogInStatus} = useContext(AuthContext)

  const handleLogout = ()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("userInfo")
    setLogInStatus(false)
    nav('/')
  }

  async function getUserInfo() {
    try{
      const cachedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "null")
      if(cachedUserInfo){
        setProfileInfo(cachedUserInfo)
      }else{
        const userInfo = await fetch("http://localhost:5000/user/profile",{
          method:"GET",
          headers:{"Authorization": `Bearer ${localStorage.getItem('token')}`}
        })
        
        const data = await userInfo.json()
        if(userInfo.status == 200){
          localStorage.setItem("userInfo",JSON.stringify(data))
          setProfileInfo(data)
        }else{
          setProfileInfo(null)
        }
      }
    }catch (err){
      console.log("Failed to fetch from user/profile")
      console.log(err)
    }
  }

  useEffect(()=>{
    getUserInfo()
    
  },[])

  const handleSuccess = async (credentialResponse:any) => {
    try{
      const response = await fetch('http://localhost:5000/auth/google',{
        method: 'PUT',
        headers:{"Authorization": `Bearer ${localStorage.getItem('token')}`,
          "googleToken": `Bearer ${credentialResponse.credential}`}
      })

      if(response.status == 200){
        localStorage.removeItem('userInfo')
        getUserInfo()
      }
    }catch(error:any){
      console.log(error.message)
    }
  }

  const handleError = () => {
    console.error("Login Failed");
  };

  return (
    <>
    <div className="card container mt-3">
      <div className="card-body">
        <div className="d-flex justify-content-center">
          <img className="rounded mt-3" src={profileInfo?.picture ? profileInfo.picture: "/src/assets/user.png"} style={{ width: "30%", height: "auto", objectFit:"contain" }}/>
        </div>
        <div className="container">
          <ul className="list-group">
            <li className="list-group-item">
              <strong>Name</strong> <br/>
              {profileInfo ? `${profileInfo.account.firstname} ${profileInfo.account.lastname}` : "Loading"}
            </li>
            <li className="list-group-item">
            <strong>Username</strong> <br/>
            {profileInfo ? `${profileInfo.username}` : "Loading"} 
            </li>
            <li className="list-group-item">
              <strong>Email</strong> <br/>
              {profileInfo ? `${profileInfo.account.email}` : "Loading"} 
            </li>
            <li className="list-group-item">
              <strong>Google</strong> <br/>
              {profileInfo?.googleId ? `Connected` : <GoogleLogin text="signin" size="large" onSuccess={handleSuccess} onError={handleError}/>} 
            </li>
          </ul>
        </div>
        <div className="mt-4 d-flex justify-content-around align-item-center">
          <UpdatePopup onUpdate={getUserInfo}/>
          <button className="btn btn-danger col-2" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile
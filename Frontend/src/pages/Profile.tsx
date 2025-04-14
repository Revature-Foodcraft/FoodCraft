import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Components/Contexts";
import UpdatePopup from "../Components/Profile/UpdatePopup";

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

  return (
    <>
    <div className="card container mt-3">
      <div className="card-body">
        <div className="d-flex justify-content-center">
          <img className="rounded mt-3" src={profileInfo?.picture ? profileInfo.picture: "/src/assets/boy.png"} style={{ width: "30%", height: "auto", objectFit:"contain" }}/>
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
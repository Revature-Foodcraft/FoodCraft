import React from "react";
import { Link, useNavigate } from "react-router-dom";
import foodCraftLogo from '../assets/FoodCraft-Logo.png';
import Header from '../Components/Header'
import Sidebar from "../Components/Homepage/Sidebar";
import Dropdown from "../Components/Homepage/SortByDropdown";
// Define the Home component

const handleLogout = ()=>{
  let nav = useNavigate()
  localStorage.removeItem("token")
  nav('/')
}

const Home: React.FC = () => {
    return (
      <div className="d-grid vh-100 container-fluid">
        <div className="row mb-0">
          <Header/>
        </div>
        
        <div className="row" style={{backgroundColor:"green"}}>
          <div className=" d-flex col-2 flex-grow-1" style={{ height: "calc(100vh - 5rem)" }}>
            <Sidebar/>

          </div>
          <div className="col-10 d-flex">
            <div className="card d-flex m-2 rounded flex-grow-1 flex-column">
              <div className="row mw-100 ms-3 me-3 mt-4">
                    <div className="col-6 ">
                    <input type="text" className="form-control" aria-label="Text input with dropdown button"/>
                    </div>
                    <div className=" col-6 d-flex justify-content-end">
                      <Dropdown/>
                    </div>
              </div>
              <hr className="my-2"/>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default Home
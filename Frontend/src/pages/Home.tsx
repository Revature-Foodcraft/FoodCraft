import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import Header from '../Components/Header'
import Sidebar from "../Components/Homepage/Sidebar";
import Dropdown from "../Components/Homepage/SortByDropdown";
import DisplayRecipe from "../Components/Homepage/DisplayRecipes";
import "../assets/search.svg"
import { DisplayContext } from "../Components/Contexts";
// Define the Home component

const handleLogout = ()=>{
  let nav = useNavigate()
  localStorage.removeItem("token")
  nav('/')
}

const Home: React.FC = () => {
  const [searchQuery,setSearchQuery] = useState<null|string>(null)

  const [sortBy, setSortBy] = useState<string>("Recently Added");
  const [invert, setInvert] = useState<boolean>(false);
  const [selectedCuisine, setSelectedCuisine] = useState<string>("");
  const [mealType, setMealTypeSelect] = useState<string>("");

  const handleSearchEvent = (event:React.KeyboardEvent<HTMLInputElement>) =>{
    if(event.key === "Enter"){
      setSearchQuery(event.currentTarget.value)
    }
  }

  const handleSearchButtonClick = () =>{
    let input = document.querySelector<HTMLInputElement>(".form-control")
    if(input){
      setSearchQuery(input.value)
    }
  }
  
    return (
      <div className="d-grid vh-100 container-fluid" style={{backgroundColor:"lightblue"}}>
        <div className="row mb-0">
          <Header/>
        </div>
        <DisplayContext.Provider value={{sortBy,setSortBy,invert,setInvert,selectedCuisine,setSelectedCuisine,mealType,setMealTypeSelect}}>
          <div className="row">
            <div className=" d-flex col-2 flex-grow-1" style={{ height: "calc(100vh - 5rem)" }}>
              <Sidebar/>
            </div>
            <div className="col-10 d-flex" >
              <div className="card d-flex m-2 rounded flex-grow-1 flex-column" style={{ height: "calc(100vh - 6rem)" }}>
                <div className="row mw-100 ms-3 me-3 mt-4">
                  <div className="col-6 ">
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="What recipe are you searching for?" id="searchInputBar" onKeyDown={handleSearchEvent}/>
                        <button className="btn btn-outline-secondary" type="button" onClick={handleSearchButtonClick}><img src="./src/assets/search.svg" alt="Search Icon" /></button>
                    </div>
                  </div>
                  <div className=" col-6 d-flex justify-content-end">
                    <Dropdown/>
                  </div>
                </div>
                <hr className="my-2"/>
                <DisplayRecipe searchQuery={searchQuery}/>
              </div>
            </div>
          </div>
        </DisplayContext.Provider>
      </div>
    );
  };

export default Home
import React, { useState,useContext } from "react";
import { DisplayContext } from "../Contexts";

const SortByDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { sortBy, setSortBy, invert,setInvert } = useContext(DisplayContext);
    
    const sortByOptions: string[]=[
        "Recently Added", "Rating", "Alphabetically"
    ]

    const handleSortBySelect= (sortId:string)=>{
        setSortBy(sortId)
    }

    const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    };
    
    const closeDropdown = () => {
        setIsOpen(false);
    };

    return (
        <div className="d-flex col-5"style={{ position: "relative", display: "inline-block" }}>
            <button className="btn btn-outline-secondary p-0 m-0" onClick={()=>{setInvert(!invert)}}><img className="p-0" src="../../src/assets/filter-circle.svg" style={{width:"1rem"}} alt="Filter Icon" /></button>
            <button className="btn btn-info dropdown-toggle w-100" onClick={toggleDropdown}>Sort by: {sortBy}</button>
            {isOpen && (<ul className="list-group border border-light" style={{position: "absolute",top: "100%", width:"100%",listStyle: "none",boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",zIndex: 1050,}}  onClick={(e) => e.stopPropagation()}>
                {sortByOptions.map((option)=>{
                    return(
                        <li className="list-group-item">
                        <div className="form-check" key={option}>
                        <input className="form-check-input" type="checkbox" id={option} checked={sortBy === option} onChange={()=> handleSortBySelect(option)}/>
                        <label className="form-check-label" htmlFor={option}>{option}</label>
                        </div></li>
                    )
                })}
                </ul>
            )}
            {isOpen && (
                <div
                    style={{position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "transparent", zIndex: 1040}} onClick={closeDropdown}>
                </div>
            )}
        </div>
    );
};

export default SortByDropdown;
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CuisineSelect from "./CuisineSelect";
import MealCategorySelect from "./MealCategorySelect";
import "../../css/Homepage.css"
const Sidebar: React.FC = () => {
    
    return (
        <div className="bg-white p-3 rounded card m-2 flex-grow-1 d-flex flex-column scrollbar" style={{overflowY:"auto",}}>
            <h5>Cuisines</h5>
            <hr className="my-0"></hr>
            <CuisineSelect/>
            <h5 className="mt-3">Meal Categories</h5>
            <hr className="my-0"></hr>
            <MealCategorySelect/>
        </div>
    )
};

export default Sidebar;
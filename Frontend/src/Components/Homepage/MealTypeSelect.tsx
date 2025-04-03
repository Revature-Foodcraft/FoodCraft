import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { DisplayContext } from "../Contexts";

const MealTypeSelect: React.FC = () => {
    const {mealType, setMealTypeSelect} = useContext(DisplayContext)
    const mealOptions: string[]=[
        "Breakfast", "Lunch", "Dinner", "Snack", "Dessert"
    ]

    const handleSelect = (mealId:string) =>{
        setMealTypeSelect((prev)=>(prev===mealId?"":mealId))
    }

    return (
        <div>
            {mealOptions.map((type)=>{
                return (
                    <div className="form-check" key={type}>
                        <input className="form-check-input" type="checkbox" id={type} checked={mealType === type} onChange={()=> handleSelect(type)}/>
                        <label className="form-check-label" htmlFor={type}>{type}</label>
                    </div>
                )
            })}
        </div>
    )
};

export default MealTypeSelect;
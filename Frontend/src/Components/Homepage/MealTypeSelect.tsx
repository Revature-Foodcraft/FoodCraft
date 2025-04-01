import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface Meal{
    id:string;
    value:string;
}
const MealTypeSelect: React.FC = () => {
    const [mealType, setMealTypeSelect] = useState<string|null>()

    const meals: Meal[] = [
        { id: "breakfast", value: "Breakfast" },
        { id: "lunch", value: "Lunch" },
        { id: "dinner", value: "Dinner" },
        { id: "snack", value: "Snack" },
        { id: "dessert", value: "Dessert"}
    ]

    const handleSelect = (mealId:string) =>{
        setMealTypeSelect((prev)=>(prev===mealId?null:mealId))
    }

    // useEffect(()=>{
    //     if(setMealTypeSelect != null){
    //         alert(`Selected Meal: ${mealType}`)
    //     }else{
    //         alert("No Type Selected");
    //     }
    // },[mealType])

    return (
        <div>
            {meals.map((type)=>{
                return (
                    <div className="form-check" key={type.value}>
                        <input className="form-check-input" type="checkbox" id={type.value} checked={mealType === type.value} onChange={()=> handleSelect(type.value)}/>
                        <label className="form-check-label" htmlFor={type.value}>{type.value}</label>
                    </div>
                )
            })}
        </div>
    )
};

export default MealTypeSelect;
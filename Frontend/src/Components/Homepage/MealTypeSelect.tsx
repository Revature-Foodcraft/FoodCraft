import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { DisplayContext } from "../Contexts";

const MealTypeSelect: React.FC = () => {
    const { mealType, setMealTypeSelect } = useContext(DisplayContext);
    const mealOptions: string[] = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];

    const handleSelect = (mealId: string) => {
        setMealTypeSelect(prev => (prev === mealId ? "" : mealId));
    };

    return (
        <div className="meal-type-tabs">
            {mealOptions.map((type) => (
                <button
                    key={type}
                    className={`meal-tab ${mealType === type ? "active" : ""}`}
                    onClick={() => handleSelect(type)}
                >
                    {type}
                </button>
            ))}
        </div>
    );
};


export default MealTypeSelect;
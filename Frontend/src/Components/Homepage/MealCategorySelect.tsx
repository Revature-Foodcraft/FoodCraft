import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { DisplayContext } from "../Contexts";

interface Categories {
    strCategory: string;
}

const MealCategorySelect: React.FC = () => {
    const { mealCategory, setMealCategorySelect } = useContext(DisplayContext);
    const [categories, setCategories] = useState<Categories[]>([]);

    const getCategories = async () => {
        try {
            const data = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list", {
                method: "GET"
            });
            const json = await data.json();
            setCategories(json.meals);
        } catch (err) {
            console.log(`Error: ${err}`);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const handleSelect = (mealId: string) => {
        setMealCategorySelect(prev => (prev === mealId ? "" : mealId));
    };

    return (
        <div className="container">
            <div className="row g-2">
                {categories.map((type) => (
                    <div className="col-6 col-md-4 col-lg-3" key={type.strCategory}>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={type.strCategory}
                                checked={mealCategory === type.strCategory}
                                onChange={() => handleSelect(type.strCategory)}
                            />
                            <label className="form-check-label" htmlFor={type.strCategory}>
                                {type.strCategory}
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MealCategorySelect;

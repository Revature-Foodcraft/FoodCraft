import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { DisplayContext } from "../Contexts";

interface Cuisine {
    strArea: string;
}

const CuisineSelect: React.FC = () => {
    const { selectedCuisine, setSelectedCuisine } = useContext(DisplayContext);
    const [cuisines, setCuisines] = useState<Cuisine[]>([]);

    const getCuisines = async () => {
        try {
            const data = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list", {
                method: "GET"
            });
            const json = await data.json();
            setCuisines(json.meals);
        } catch (err) {
            console.log(`Error: ${err}`);
        }
    };

    useEffect(() => {
        getCuisines();
    }, []);
    // useEffect(() => {
    //         console.log("Selected Cuisine:", selectedCuisine);
    //     }, [selectedCuisine]);
    const handleSelect = (cuisineId: string) => {
        setSelectedCuisine((prev: string) => (prev === cuisineId ? "" : cuisineId));
    };

    return (
        <div className="container">
            <div className="row g-2">
                {cuisines.map((cuisine) => (
                    <div className="col-6 col-md-4 col-lg-3" key={cuisine.strArea}>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={cuisine.strArea}
                                checked={selectedCuisine === cuisine.strArea}
                                onChange={() => handleSelect(cuisine.strArea)}
                            />
                            <label className="form-check-label" htmlFor={cuisine.strArea}>
                                {cuisine.strArea}
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CuisineSelect;

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface Cuisine{
    id:string;
    value:string;
}
const CuisineSelect: React.FC = () => {
    const [selectedCuisine, setSelectedCuisine] = useState<string|null>()

    const cuisines: Cuisine[] = [
        { id: "americanCuisine", value: "American" },
        { id: "britishCuisine", value: "British" },
        { id: "indianCuisine", value: "Indian" },
        { id: "frenchCuisine", value: "French" },
    ]

    const handleSelect = (cuisineId:string) =>{
        setSelectedCuisine((prev)=>(prev===cuisineId?null:cuisineId))
    }

    // useEffect(()=>{
    //     if(selectedCuisine != null){
    //         alert(`Selected Cuisine: ${selectedCuisine}`)
    //     }else{
    //         alert("No Cuisine Selected");
    //     }
    // },[selectedCuisine])

    return (
        <div>
            {cuisines.map((cuisine)=>{
                return (
                    <div className="form-check" key={cuisine.value}>
                        <input className="form-check-input" type="checkbox" id={cuisine.value} checked={selectedCuisine === cuisine.value} onChange={()=> handleSelect(cuisine.value)}/>
                        <label className="form-check-label" htmlFor={cuisine.value}>{cuisine.value}</label>
                    </div>
                )
            })}
        </div>
    )
};

export default CuisineSelect;
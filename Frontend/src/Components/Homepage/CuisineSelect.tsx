import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { DisplayContext } from "../Contexts";

interface Cuisine{
    strArea:string;
}

const CuisineSelect: React.FC = () => {
    const {selectedCuisine, setSelectedCuisine} = useContext(DisplayContext)
    const [cuisines,setCuisines] = useState<Cuisine[]>([])

    const getCuisines = async () => {
        try{
            const data = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list",{
                method:"GET",
            })

            setCuisines((await data.json()).meals)

        }catch(err){
            console.log(`Error: ${err}`)
        }
    }
    
    useEffect(()=>{
        getCuisines()
    },[])

    const handleSelect = (cuisineId:string) =>{
        setSelectedCuisine((prev:string)=>(prev===cuisineId?"":cuisineId))
    }

    return (
        <div>
            {cuisines.map((cuisine)=>{
                return (
                    <div className="form-check" key={cuisine.strArea}>
                        <input className="form-check-input" type="checkbox" id={cuisine.strArea} checked={selectedCuisine === cuisine.strArea} onChange={()=> handleSelect(cuisine.strArea)}/>
                        <label className="form-check-label" htmlFor={cuisine.strArea}>{cuisine.strArea}</label>
                    </div>
                )
            })}
        </div>
    )
};

export default CuisineSelect;
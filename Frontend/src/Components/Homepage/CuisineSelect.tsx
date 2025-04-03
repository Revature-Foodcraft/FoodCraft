import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { DisplayContext } from "../Contexts";

const CuisineSelect: React.FC = () => {
    const {selectedCuisine, setSelectedCuisine} = useContext(DisplayContext)

    const cuisines: string[]=["American","British", "Indian", "French"]

    const handleSelect = (cuisineId:string) =>{
        setSelectedCuisine((prev:string)=>(prev===cuisineId?"":cuisineId))
    }

    return (
        <div>
            {cuisines.map((cuisine)=>{
                return (
                    <div className="form-check" key={cuisine}>
                        <input className="form-check-input" type="checkbox" id={cuisine} checked={selectedCuisine === cuisine} onChange={()=> handleSelect(cuisine)}/>
                        <label className="form-check-label" htmlFor={cuisine}>{cuisine}</label>
                    </div>
                )
            })}
        </div>
    )
};

export default CuisineSelect;
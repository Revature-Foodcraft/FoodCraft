import React, { createContext } from "react";

// Define the SortByContext
interface SortByContextType {
    sortBy: string;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
    invert: boolean;
    setInvert: React.Dispatch<React.SetStateAction<boolean>>;
    selectedCuisine:string;
    setSelectedCuisine:React.Dispatch<React.SetStateAction<string>>;
    mealType:string;
    setMealTypeSelect:React.Dispatch<React.SetStateAction<string>>;
}

export const DisplayContext = createContext<SortByContextType>({
  sortBy: "Recently Added", 
  setSortBy: () => {},      
  invert:false,
  setInvert: () => {},
  selectedCuisine: "", 
  setSelectedCuisine: () => {} ,
  mealType:"",
  setMealTypeSelect:() => {} 
});




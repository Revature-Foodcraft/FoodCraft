import React, { createContext } from "react";

// Define the SortByContext
interface SortByContextType {
    sortBy: string;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
    invert: boolean;
    setInvert: React.Dispatch<React.SetStateAction<boolean>>;
    selectedCuisine:string;
    setSelectedCuisine:React.Dispatch<React.SetStateAction<string>>;
    mealCategory:string;
    setMealCategorySelect:React.Dispatch<React.SetStateAction<string>>;
}

export const DisplayContext = createContext<SortByContextType>({
  sortBy: "Recently Added", 
  setSortBy: () => {},      
  invert:false,
  setInvert: () => {},
  selectedCuisine: "", 
  setSelectedCuisine: () => {} ,
  mealCategory:"",
  setMealCategorySelect:() => {} 
});

interface AuthContextType{
  isLoggedIn:boolean;
  setLogInStatus:React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext= createContext<AuthContextType>({
  isLoggedIn:false,
  setLogInStatus:() => {} 
})



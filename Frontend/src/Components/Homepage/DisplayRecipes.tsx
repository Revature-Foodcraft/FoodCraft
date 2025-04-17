import React, { useContext, useEffect, useRef, useState } from "react";
import {Pagination} from "react-bootstrap";
import Fuse from "fuse.js";
import { DisplayContext } from "../Contexts";
import { Link } from "react-router-dom";
import StarRating from "../StarRating";

interface SearchProp{
    searchQuery:string|null;
}



const DisplayRecipe: React.FC<SearchProp> = ({searchQuery})=>{
    const { sortBy,invert,selectedCuisine,mealCategory } = useContext(DisplayContext);
    const [recipes, setRecipes] = useState<any[]>([])
    const[currentPage,setCurrentPage] = useState(1)
    const itemsPerPage = 18
    const hasSearched = useRef(false)

    const getRecipes = async () => {
        try {
            const searchParam = new URLSearchParams()
            if(selectedCuisine){
                searchParam.append("cuisine",selectedCuisine)
            }
            if(mealCategory){
                searchParam.append("category",mealCategory)
            }

            const dbRes = await fetch(`http://localhost:5000/recipes?${searchParam.toString()}`, {
                method: "GET",
            });

            const dbRecipes = await dbRes.json()
            console.log(dbRecipes.recipes)
            if(dbRecipes.recipes.length <= 0){
                console.log("here")
                getRecipesFromAPI()
            }else{
                setRecipes(dbRecipes.recipes);
            }

        } catch (err) {
            console.log(`Error: ${err}`);
        }
    };

    const getRecipesFromAPI = async () => {
        const searchParam = new URLSearchParams
        let baseURL = 'https://www.themealdb.com/api/json/v1/1/filter.php'
        if(searchQuery){
            searchParam.append("s", searchQuery)  
            baseURL = 'https://www.themealdb.com/api/json/v1/1/search.php'
        }else{
            if(selectedCuisine){
                searchParam.append("a",selectedCuisine)
            }
            if(mealCategory){
                searchParam.append("c",mealCategory)
            }
        }
        
        
        try{
            const data = await fetch(`${baseURL}?${searchParam.toString()}`,{
            method:"GET"
            })

            const response = await data.json()

            const apiRecipes:any = []
            console.log(response)
            response.meals.forEach( (meal:any)  => {
                apiRecipes.push({
                    PK: meal.idMeal,
                    name: meal.strMeal,
                    dateCreated: meal.dateModified || "2024-01-01",
                    rating: 3,
                    source: "api",
                });
            });

            setRecipes(apiRecipes)
        }catch (err){
            console.log(err)
        }

    }
    useEffect(()=>{
        console.log("call from cuisine effect")
        getRecipes()
    },[selectedCuisine,mealCategory])

    useEffect(()=>{
        hasSearched.current = false
        if(!searchQuery){
            getRecipes()
            console.log("call from search")
            hasSearched.current = true
        }
    },[searchQuery])
    
    const fuseOptions = {
        keys:['name'],
        threshold:0.4
    }
    const fuse = new Fuse(recipes,fuseOptions)
    const filteredRecipes = searchQuery ? fuse.search(searchQuery).map((result)=>result.item):recipes
    
    useEffect(() => {
        if (searchQuery && filteredRecipes.length === 0 && !hasSearched.current) {
            console.log("Filtered recipes are empty. Automatically searching MealDB.");
            hasSearched.current = true;
            getRecipesFromAPI();
        } 
    }, [filteredRecipes, searchQuery]);

    const totalPages = Math.ceil(filteredRecipes.length/itemsPerPage)
    const currentRecipes = filteredRecipes.slice((currentPage - 1) * itemsPerPage,currentPage * itemsPerPage);
    if(sortBy == "Rating"){
        currentRecipes.sort((a, b) => b.rating - a.rating)
    }else if(sortBy == "Alphabetically"){
        currentRecipes.sort((a, b) => a.name.localeCompare(b.name))
    }else{
        currentRecipes.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
    }
    if(invert){
        currentRecipes.reverse()
    }

    const handlePageChange = (page:number)=>{
        setCurrentPage(page)
    }

    return(
        <div style={{ position: "relative", height: "100%" }} >
            <div className="p-3" style={{background: "inherit"}}>
                {currentRecipes.map((recipes)=>{
                    return(
                        <div className="card m-2"  key={recipes.id}>
                            <div className="card-header m-2 p-0">
                                <div className="d-flex align-item-center">
                                    <div className="card-title m-0">
                                        <Link to={`/recipe/${recipes?.source ? recipes.source : "db"}/${recipes.PK}`}>
                                            <h5>{recipes.name}</h5>
                                        </Link>
                                    </div>
                                    <div className="ms-auto">
                                        
                                    <StarRating rating={recipes.rating} outOf={5}/></div>
                                </div>
                            </div>
                            <div className="card-body">
                                {recipes.dateCreated}<br></br>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="d-flex justify-content-center align-content-center" style={{position: "absolute",width: "100%",background: "inherit"}}>
            <Pagination className="m-1">
                <Pagination.First onClick={() => handlePageChange(1)}/>
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}/>
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item key={index + 1} active={currentPage === index + 1} onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}/>
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}/>
            </Pagination></div>
        </div>
    )
}

export default DisplayRecipe
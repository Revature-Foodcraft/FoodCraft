import React, { useContext, useEffect, useState } from "react";
import {Pagination} from "react-bootstrap";
import Fuse from "fuse.js";
import { DisplayContext } from "../Contexts";
import { Link } from "react-router-dom";
import StarRating from "../StarRating";
import { CiSaveDown2 } from "react-icons/ci";
// interface Recipes{
//     PK:string,
//     SK:string,
//     name:string,
//     description:string,
    
//     macros:{},
//     pictures:[],
//     dateCreated:string,
//     rating:number
// }

interface SearchProp{
    searchQuery:string|null;
}



const DisplayRecipe: React.FC<SearchProp> = ({searchQuery})=>{
    const { sortBy,invert,selectedCuisine,mealCategory } = useContext(DisplayContext);
    const [recipes, setRecipes] = useState<any[]>([])
    const[currentPage,setCurrentPage] = useState(1)
    const itemsPerPage = 18
    
    const getRecipes = async () => {
        try {
          const dbRes = await fetch("http://localhost:5000/recipes/", {
            method: "GET",
          });
          const dbRecipes = (await dbRes.json()).recipes.map((r: any) => ({
            ...r,
            source: "db", 
            id: r.PK,
          }));
      
          const apiRecipes: any[] = [];
          for (let i = 0; i < 10; i++) {
            const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
            const data = await res.json();
            const meal = data.meals?.[0];
            if (meal) {
              apiRecipes.push({
                id: meal.idMeal,
                name: meal.strMeal,
                description: meal.strArea + " " + meal.strCategory,
                dateCreated: meal.dateModified || "2024-01-01",
                rating: Math.floor(Math.random() * 5) + 1, // optional: fake rating
                source: "api",
              });
            }
          }
      
          setRecipes([...dbRecipes, ...apiRecipes]);
      
        } catch (err) {
          console.log(`Error: ${err}`);
        }
      };
      

    useEffect(()=>{
        getRecipes()
        
    },[])
    // useEffect(() => {
    //     console.log(`SortBy changed to: ${selectedCuisine}`);
    // }, [selectedCuisine]);
    // useEffect(() => {
    //     console.log(`SortBy changed to: ${mealCategory}`)
    // }, [mealCategory]);

    const fuseOptions = {
        keys:['name'],
        threshold:0.4
    }
    const fuse = new Fuse(recipes,fuseOptions)
    const filteredRecipes = searchQuery ? fuse.search(searchQuery).map((result)=>result.item):recipes
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
            <div className=" d-flex flex-wrap p-3" style={{background: "inherit"}}>
                {currentRecipes.map((recipes)=>{
                    return(
                        <div className="card m-2" style={{maxWidth:"24%",flex: "1 1 calc(25% - 1rem)"}} key={recipes.id}>
                            <div className="card-header">
                                <div className="d-flex align-item-center">
                                    <div className="card-title">
                                        <Link to={`/recipe/${recipes.source}/${recipes.id}`}>
                                            <h5>{recipes.name}</h5>
                                        </Link>
                                    </div>
                                    <button className="btn btn-primary-outline ms-auto"><img src="/src/assets/floppy.svg" alt="" /></button>
                                </div>
                            </div>
                            <div className="card-body">
                                {recipes.description}<br></br>{recipes.dateCreated}<br></br><StarRating rating={recipes.rating} outOf={5}/>
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
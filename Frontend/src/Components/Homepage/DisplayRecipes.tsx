import React, { useContext, useEffect, useState } from "react";
import {Pagination} from "react-bootstrap";
import Fuse from "fuse.js";
import { DisplayContext } from "../Contexts";
interface Recipes{
    id:string,
    name:string,
    description:string,
    dateAdded:string,
    rating:number
}

interface SearchProp{
    searchQuery:string|null;
}

const recipes: Recipes[] = [
    { id: "1", name: "Spaghetti Carbonara", description: "A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.", dateAdded: "2025-04-01", rating: 4.6 },
    { id: "2", name: "Chicken Curry", description: "A flavorful Indian-style curry made with tender chicken, spices, and creamy sauce.", dateAdded: "2025-03-28", rating: 4.8 },
    { id: "3", name: "Vegetable Stir-Fry", description: "A quick and healthy dish featuring fresh vegetables stir-fried with soy sauce and garlic.", dateAdded: "2025-03-25", rating: 4.3 },
    { id: "4", name: "Beef Tacos", description: "Mexican-inspired tacos filled with seasoned ground beef and topped with salsa and cheese.", dateAdded: "2025-03-26", rating: 4.5 },
    { id: "5", name: "Greek Salad", description: "A refreshing salad with cucumbers, tomatoes, olives, feta cheese, and olive oil dressing.", dateAdded: "2025-03-29", rating: 4.2 },
    { id: "6", name: "Caprese Salad", description: "A simple Italian salad made with fresh mozzarella, tomatoes, basil, and olive oil.", dateAdded: "2025-03-27", rating: 4.4 },
    { id: "7", name: "Butter Chicken", description: "A creamy Indian dish made with marinated chicken simmered in a spiced tomato sauce.", dateAdded: "2025-03-31", rating: 4.7 },
    { id: "8", name: "Miso Soup", description: "A light Japanese soup made with miso paste, tofu, seaweed, and scallions.", dateAdded: "2025-03-30", rating: 4.1 },
    { id: "9", name: "Lasagna", description: "A layered Italian pasta dish with marinara sauce, ground beef, and melted cheese.", dateAdded: "2025-04-02", rating: 4.8 },
    { id: "10", name: "Avocado Toast", description: "A quick breakfast option with mashed avocado on toast and seasonings.", dateAdded: "2025-03-29", rating: 4.2 },
    { id: "11", name: "Grilled Salmon", description: "A healthy dish featuring salmon grilled with herbs and olive oil.", dateAdded: "2025-04-01", rating: 4.9 },
    { id: "12", name: "Pancakes", description: "A breakfast favorite made with fluffy batter and topped with syrup or fruits.", dateAdded: "2025-03-28", rating: 4.6 },
    { id: "13", name: "Caesar Salad", description: "A classic salad with romaine lettuce, croutons, and Caesar dressing.", dateAdded: "2025-03-27", rating: 4.3 },
    { id: "14", name: "Tomato Soup", description: "A creamy, comforting soup made from fresh tomatoes and herbs.", dateAdded: "2025-03-31", rating: 4.4 },
    { id: "15", name: "Stuffed Bell Peppers", description: "Bell peppers filled with rice, veggies, and seasoned meat.", dateAdded: "2025-03-30", rating: 4.6 },
    { id: "16", name: "Chili Con Carne", description: "A hearty dish made with beans, ground beef, and spices.", dateAdded: "2025-03-29", rating: 4.7 },
    { id: "17", name: "Garlic Bread", description: "Toasted bread with garlic butter, perfect as a side dish.", dateAdded: "2025-03-26", rating: 4.2 },
    { id: "18", name: "Shrimp Scampi", description: "A seafood dish cooked with shrimp, garlic, and white wine sauce.", dateAdded: "2025-03-28", rating: 4.7 },
    { id: "19", name: "Banana Bread", description: "Moist bread made with ripe bananas and baked to perfection.", dateAdded: "2025-03-25", rating: 4.5 },
    { id: "20", name: "Chicken Alfredo", description: "Pasta tossed in creamy Alfredo sauce with grilled chicken.", dateAdded: "2025-04-01", rating: 4.8 }
];

const DisplayRecipe: React.FC<SearchProp> = ({searchQuery})=>{
    const { sortBy,invert,selectedCuisine,mealType } = useContext(DisplayContext);
    const[currentPage,setCurrentPage] = useState(1)
    const itemsPerPage = 18

    useEffect(() => {
        console.log(`SortBy changed to: ${selectedCuisine}`);
    }, [selectedCuisine]);
    useEffect(() => {
        console.log(`SortBy changed to: ${mealType}`)
    }, [mealType]);

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
        currentRecipes.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
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
                        <div className="card m-2" style={{maxWidth:"15%",flex: "1 1 calc(20% - 1rem)"}} key={recipes.id}>
                            <div className="card-header">
                                <div className="card-title">
                                    {recipes.name}
                                </div>
                            </div>
                            <div className="card-body">
                                {recipes.description}<br></br>{recipes.dateAdded}<br></br>{recipes.rating}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="d-flex justify-content-center align-content-center" style={{position: "absolute",bottom:"2%",width: "100%",background: "inherit"}}>
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
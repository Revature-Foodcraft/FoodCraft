import React, { useState } from 'react';
//import '../css/createRecipe.css';

const CreateRecipe: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState([{ category: '', name: '', amount: '' }]);
    const [macros, setMacros] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    const [instructions, setInstructions] = useState(['']);
    const [review_id, setReviewId] = useState('');
    const [pictures, setPictures] = useState<{ name: string; link: string }[]>([]);
    //const [rating, setRating] = useState<number | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const uploadedFiles = Array.from(event.target.files).map(file => ({
                name: file.name,
                link: URL.createObjectURL(file),
            }));
            setPictures(uploadedFiles);
        }
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { category: '', name: '', amount: '' }]);
    };

    const handleAddInstruction = () => {
        setInstructions([...instructions, '']);
    };

    const handleSubmit = async () => {
        const recipeData = {
            name,
            description,
            ingredients,
            macros,
            instructions,
            review_id,
            pictures,
            
        };

        try {
            const response = await fetch('http://localhost:5000/recipe/addRecipe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipeData),
            });
            
            const data = await response.json();
            if (data.success) {
                alert('Recipe created successfully!');
            } else {
                alert('Failed to create recipe: ' + data.message);
            }
        } catch (error) {
            console.error('Error submitting recipe:', error);
            alert('An error occurred while creating the recipe.');
        }
    };

    return (
        <div className="recipe-container">
            <h1>Create Recipe</h1>
            <input className="recipe-input" type="text" placeholder="Recipe Name" value={name} onChange={e => setName(e.target.value)} />
            <input className="recipe-input" type="text" placeholder="reviewID" value={review_id} onChange={e => setReviewId(e.target.value)} />
            <textarea className="recipe-textarea" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            
            <h3>Ingredients</h3>
            {ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-inputs">
                    <input type="text" placeholder="Category" value={ingredient.category} onChange={e => {
                        const newIngredients = [...ingredients];
                        newIngredients[index].category = e.target.value;
                        setIngredients(newIngredients);
                    }} />
                    <input type="text" placeholder="Name" value={ingredient.name} onChange={e => {
                        const newIngredients = [...ingredients];
                        newIngredients[index].name = e.target.value;
                        setIngredients(newIngredients);
                    }} />
                    <input type="text" placeholder="Amount" value={ingredient.amount} onChange={e => {
                        const newIngredients = [...ingredients];
                        newIngredients[index].amount = e.target.value;
                        setIngredients(newIngredients);
                    }} />
                </div>
            ))}
            <button className="add-button" onClick={handleAddIngredient}>Add Ingredient</button>
            
            <h3>Instructions</h3>
            {instructions.map((instruction, index) => (
                <div key={index}>
                    <textarea className="recipe-textarea" placeholder={`Step ${index + 1}`} value={instruction} onChange={e => {
                        const newInstructions = [...instructions];
                        newInstructions[index] = e.target.value;
                        setInstructions(newInstructions);
                    }} />
                </div>
            ))}
            <button className="add-button" onClick={handleAddInstruction}>Add Instruction</button>
            
            <h3>Macros</h3>
            <label>Calories</label>
            <input className="macro-input" type="number" value={macros.calories} onChange={e => setMacros({...macros, calories: Number(e.target.value)})} />
            <label>Protein</label>
            <input className="macro-input" type="number" value={macros.protein} onChange={e => setMacros({...macros, protein: Number(e.target.value)})} />
            <label>Carbs</label>
            <input className="macro-input" type="number" value={macros.carbs} onChange={e => setMacros({...macros, carbs: Number(e.target.value)})} />
            <label>Fat</label>
            <input className="macro-input" type="number" value={macros.fat} onChange={e => setMacros({...macros, fat: Number(e.target.value)})} />
            
            <input type="file" multiple onChange={handleImageUpload} />
            <button className="submit-button" onClick={handleSubmit}>Submit Recipe</button>
        </div>
    );
};

export default CreateRecipe;

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CreateRecipe: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState([{ name: '', amount: '' }]);
    const [macros, setMacros] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    const [instructions, setInstructions] = useState(['']);
    const [picture, setPicture] = useState<{ name: string; link: string } | null>(null);
    const [ingredientList, setIngredientList] = useState<string[]>([]);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
                const data = await response.json();
                const names = data.meals.map((item: any) => item.strIngredient).filter(Boolean);
                setIngredientList(names);
            } catch (error) {
                console.error('Failed to fetch ingredients:', error);
            }
        };
        fetchIngredients();
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        if (!file.type.startsWith('image/')) {
            alert('Only image files are allowed.');
            return;
        }
    
        const uploadedImage = {
            name: file.name,
            link: URL.createObjectURL(file),
        };
    
        setPicture(uploadedImage);
    };
    
    

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', amount: '' }]);
    };

    const handleAddInstruction = () => {
        setInstructions([...instructions, '']);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
    
        const recipeData = {
            name,
            description,
            ingredients,
            macros,
            instructions,
            pictures: picture ? [picture] : [],
        };
    
        try {
            const response = await fetch('http://localhost:5000/recipes/addRecipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // <-- attach JWT here
                },
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
        <div className="container mt-4 mb-5">
            <h1 className="text-center mb-4">Create Recipe</h1>

            <div className="mb-3">
                <input
                    className="form-control"
                    type="text"
                    placeholder="Recipe Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </div>

            <h4>Ingredients</h4>
            {ingredients.map((ingredient, index) => (
    <div key={index} className="row mb-3 g-2 align-items-center">
        <div className="col-md-5">
            <Select
                placeholder="Search Ingredient"
                options={ingredientList.map(name => ({ label: name, value: name }))}
                value={ingredient.name ? { label: ingredient.name, value: ingredient.name } : null}
                onChange={selected => {
                    const newIngredients = [...ingredients];
                    newIngredients[index].name = selected?.value || '';
                    setIngredients(newIngredients);
                }}
                isClearable
                isSearchable
            />
        </div>
        <div className="col-md-4">
            <input
                className="form-control"
                type="text"
                placeholder="Amount"
                value={ingredient.amount}
                onChange={e => {
                    const newIngredients = [...ingredients];
                    newIngredients[index].amount = e.target.value;
                    setIngredients(newIngredients);
                }}
            />
        </div>
        {ingredients.length > 1 && (
            <div className="col-md-2 d-flex justify-content-start">
                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => {
                        const updated = ingredients.filter((_, i) => i !== index);
                        setIngredients(updated);
                    }}
                >
                    <i className="bi bi-trash"></i>
                </button>
            </div>
        )}
    </div>
))}

            <button className="btn btn-outline-primary mb-4" onClick={handleAddIngredient}>
                + Add Ingredient
            </button>

            <h4>Instructions</h4>
            {instructions.map((instruction, index) => (
    <div key={index} className="row mb-3 g-2 align-items-center">
        <div className="col-md-10">
            <textarea
                className="form-control"
                rows={2}
                placeholder={`Step ${index + 1}`}
                value={instruction}
                onChange={e => {
                    const newInstructions = [...instructions];
                    newInstructions[index] = e.target.value;
                    setInstructions(newInstructions);
                }}
            />
        </div>
        {instructions.length > 1 && (
            <div className="col-md-2 d-flex justify-content-start">
                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => {
                        const updated = instructions.filter((_, i) => i !== index);
                        setInstructions(updated);
                    }}
                >
                    <i className="bi bi-trash"></i>
                </button>
            </div>
        )}
    </div>
))}


            <button className="btn btn-outline-secondary mb-4" onClick={handleAddInstruction}>
                + Add Instruction
            </button>

            <h4>Macros</h4>
            <div className="row mb-4 g-3">
                <div className="col-6 col-md-3">
                    <label className="form-label">Calories</label>
                    <input
                        className="form-control"
                        type="number"
                        value={macros.calories}
                        onChange={e => setMacros({ ...macros, calories: Number(e.target.value) })}
                    />
                </div>
                <div className="col-6 col-md-3">
                    <label className="form-label">Protein</label>
                    <input
                        className="form-control"
                        type="number"
                        value={macros.protein}
                        onChange={e => setMacros({ ...macros, protein: Number(e.target.value) })}
                    />
                </div>
                <div className="col-6 col-md-3">
                    <label className="form-label">Carbs</label>
                    <input
                        className="form-control"
                        type="number"
                        value={macros.carbs}
                        onChange={e => setMacros({ ...macros, carbs: Number(e.target.value) })}
                    />
                </div>
                <div className="col-6 col-md-3">
                    <label className="form-label">Fat</label>
                    <input
                        className="form-control"
                        type="number"
                        value={macros.fat}
                        onChange={e => setMacros({ ...macros, fat: Number(e.target.value) })}
                    />
                </div>
            </div>
            <div className="mb-4">
    <label className="form-label">Upload Image</label>
    <input
        className="form-control"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
    />

    {picture && (
        <div className="mt-3 position-relative" style={{ maxWidth: '200px' }}>
            <img
                src={picture.link}
                alt={picture.name}
                className="img-thumbnail"
                style={{ width: '100%', height: 'auto' }}
            />
            <button
                type="button"
                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                onClick={() => setPicture(null)}
            >
                <i className="bi bi-x-lg"></i>
            </button>
        </div>
    )}
</div>


            <button className="btn btn-success w-100" onClick={handleSubmit}>
                Submit Recipe
            </button>
        </div>
    );
};

export default CreateRecipe;

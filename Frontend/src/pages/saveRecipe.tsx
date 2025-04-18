import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CreateRecipe: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
    const [macros, setMacros] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    const [instructions, setInstructions] = useState(['']);
    const [picture, setPicture] = useState<{ name: string; link: string } | null>(null);
    const [ingredientList, setIngredientList] = useState<string[]>([]);
    const [category, setCategory] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [categoryList, setCategoryList] = useState<string[]>([]);
    const [cuisineList, setCuisineList] = useState<string[]>([]);

    const quantityOptions = [
        '1/8', '1/4', '1/3', '1/2', '2/3', '3/4', '1', '2', '3', '4', '5', 'a pinch', 'to taste'
    ];
    
    const unitOptions = [
        'tsp', 'tbsp', 'cup', 'oz', 'lb', 'gram(s)', 'kg', 'ml', 'liter', 'quart', 'pinch', 'clove(s)', 'slice(s)', 'piece(s)', 'can', 'bottle'
    ];
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ingredientRes, categoryRes, cuisineRes] = await Promise.all([
                    fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list'),
                    fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list'),
                    fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
                ]);
    
                const ingredientData = await ingredientRes.json();
                const categoryData = await categoryRes.json();
                const cuisineData = await cuisineRes.json();
    
                const ingredients = ingredientData.meals.map((item: any) => item.strIngredient).filter(Boolean);
                const categories = categoryData.meals.map((item: any) => item.strCategory).filter(Boolean);
                const cuisines = cuisineData.meals.map((item: any) => item.strArea).filter(Boolean);
    
                setIngredientList(ingredients);
                setCategoryList(categories);
                setCuisineList(cuisines);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
    
        fetchData();
    }, []);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        if (!file.type.startsWith('image/')) {
            alert('Only image files are allowed.');
            return;
        }
    
        try {
            const res = await fetch(`http://localhost:5000/s3/generate-upload-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`);
            const { uploadUrl, publicUrl } = await res.json();
            console.log("Signed upload URL:", uploadUrl);

            await fetch(uploadUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file,
            });
    
            setPicture({ name: file.name, link: publicUrl });
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Image upload failed");
        }
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
    };

    const handleAddInstruction = () => {
        setInstructions([...instructions, '']);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");

        const formattedIngredients = ingredients.map(ing => ({
            name: ing.name,
            amount: [ing.quantity, ing.unit].filter(Boolean).join(' ')
        }));
        
        const recipeData = {
            name,
            // description,
            ingredients: formattedIngredients,
            macros,
            instructions,
            category,
            cuisine,
            pictures: picture ? [{ link: picture.link }] : [],
        };
        console.log("Submitting recipe with picture URL:", recipeData.pictures[0]?.link);
        try {
            const response = await fetch('http://localhost:5000/recipes/addRecipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
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

            {/* <div className="mb-4">
                <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </div> */}

            <div className="row mb-3 g-3">
                <h4>Type</h4>
                <div className="col-md-6">
                    <Select
                        placeholder="Select Cuisine"
                        options={cuisineList.map(area => ({ label: area, value: area }))}
                        value={cuisine ? { label: cuisine, value: cuisine } : null}
                        onChange={selected => setCuisine(selected?.value || '')}
                        isClearable
                        isSearchable
                    />
                </div>
                <div className="col-md-6">
                    <Select
                        placeholder="Select Category"
                        options={categoryList.map(cat => ({ label: cat, value: cat }))}
                        value={category ? { label: category, value: category } : null}
                        onChange={selected => setCategory(selected?.value || '')}
                        isClearable
                        isSearchable
                    />
                </div>
            </div>

            <h4>Ingredients</h4>
            {ingredients.map((ingredient, index) => (
                <div key={index} className="row mb-3 g-2 align-items-center">
                    <div className="col-md-4">
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
                    <div className="col-md-3">
                        <Select
                            placeholder="Qty"
                            options={quantityOptions.map(q => ({ label: q, value: q }))}
                            value={ingredient.quantity ? { label: ingredient.quantity, value: ingredient.quantity } : null}
                            onChange={selected => {
                                const updated = [...ingredients];
                                updated[index].quantity = selected?.value || '';
                                setIngredients(updated);
                            }}
                            isClearable
                        />
                    </div>
                    <div className="col-md-3">
                        <Select
                            placeholder="Unit"
                            options={unitOptions.map(u => ({ label: u, value: u }))}
                            value={ingredient.unit ? { label: ingredient.unit, value: ingredient.unit } : null}
                            onChange={selected => {
                                const updated = [...ingredients];
                                updated[index].unit = selected?.value || '';
                                setIngredients(updated);
                            }}
                            isClearable
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
                {['calories', 'protein', 'carbs', 'fat'].map((key) => (
                    <div key={key} className="col-6 col-md-3">
                        <label className="form-label">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                        <input
                            className="form-control"
                            type="number"
                            value={macros[key as keyof typeof macros]}
                            onChange={e =>
                                setMacros({ ...macros, [key]: Number(e.target.value) })
                            }
                        />
                    </div>
                ))}
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

import React, { FormEvent, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/SmartFridge/SmartFridge.css";
import { IngredientCategory } from "../../Types/Ingredient";

interface AddIngredientModalProps {
    onSubmit: (newIngredient: {
        id: string;
        amount: string;
    }) => void;
    onCancel: () => void;
}

function AddIngredientModal({ onSubmit, onCancel }: AddIngredientModalProps) {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        category: IngredientCategory.Meat,
        amount: "",
    });
    const [suggestions, setSuggestions] = useState<
        Array<{ id: string; name: string }>
    >([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
        null
    );

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, name: value, id: "" }));

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const timer = setTimeout(() => {
            if (value.length > 1) {
                fetchSuggestions(value);
            } else {
                setSuggestions([]);
            }
        }, 300);

        setDebounceTimer(timer);
    };

    const fetchSuggestions = async (query: string) => {
        setSuggestionsLoading(true);
        try {
            const response = await fetch(
                `http://localhost:5000/ingredients?search=${encodeURIComponent(query)}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to fetch suggestions");

            const data = await response.json();
            setSuggestions(
                data.ingredients.map((ingredient: any) => ({
                    id: ingredient.PK,
                    name: ingredient.name,
                }))
            );
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
        } finally {
            setSuggestionsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion: { id: string; name: string }) => {
        setFormData((prev) => ({
            ...prev,
            name: suggestion.name,
            id: suggestion.id,
        }));
        setSuggestions([]);
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData.id || !formData.amount) {
            console.error(
                "Please select a suggested ingredient and fill all required fields."
            );
            return;
        }
        onSubmit({ id: formData.id, amount: formData.amount });
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h5 className="modal-title">Add Ingredient</h5>
                    <div className="modal-close" onClick={onCancel}>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                        ></button>
                    </div>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleFormSubmit}>
                        <div className="form-group" style={{ position: "relative" }}>
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleNameChange}
                                className="input-field"
                                autoComplete="off"
                                title=""
                                required
                            />
                            {suggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {suggestions.map((suggestion, index) => (
                                        <li
                                            key={suggestion.id || index}
                                            className="suggestion-item"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            {suggestion.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {suggestionsLoading && (
                                <div className="suggestions-loading">Loading...</div>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Category:</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        category: e.target.value as IngredientCategory,
                                    }))
                                }
                                className="input-field"
                            >
                                {Object.values(IngredientCategory).map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Amount:</label>
                            <input
                                type="text"
                                name="amount"
                                value={formData.amount}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, amount: e.target.value }))
                                }
                                className="input-field"
                                autoComplete="off"
                                title=""
                                required
                            />
                        </div>
                        <div className="modal-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddIngredientModal;
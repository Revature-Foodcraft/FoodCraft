import React, { useState } from 'react';
import '../../css/MacroTracker.css';
import '../../css/GoalInput.css';
import 'bootstrap/dist/css/bootstrap.min.css';


interface GoalInputProps {
    currentGoals: Record<string, number>;
    onSave: (newGoals: Record<string, number>) => void;
    setGoalsVisible: (visible: boolean) => void; // Added setGoalsVisible prop
}

const GoalInput: React.FC<GoalInputProps> = ({ currentGoals, onSave, setGoalsVisible }) => {
    const [goals, setGoals] = useState(currentGoals);

    const handleInputChange = (label: string, value: number) => {
        setGoals(prev => ({
            ...prev,
            [label]: value,
        }));
    };

    const handleSave = () => {
        onSave(goals);
        setGoalsVisible(false); // Use setGoalsVisible prop to update visibility
    };

    return (
        <div className="goal-inputs">
            <div className="macro-inputs-row">
                {Object.keys(goals).map(label => (
                    <div key={label} className="macro-input">
                        <label htmlFor={label}>{label}</label>
                        <input
                            id={label}
                            type="number"
                            value={goals[label]}
                            onChange={e => handleInputChange(label, parseInt(e.target.value) || 0)}
                        />
                    </div>
                ))}
            </div>
            <button className="btn btn-warning btn-lg rounded-pill shadow-sm btn-custom" onClick={handleSave}>Save Goals</button>
        </div>
    );
};

export default GoalInput;
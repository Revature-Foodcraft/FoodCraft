import React, { useState } from 'react';
import './MacroTracker.css';

interface GoalInputProps {
    currentGoals: Record<string, number>;
    onSave: (newGoals: Record<string, number>) => void;
}

const GoalInput: React.FC<GoalInputProps> = ({ currentGoals, onSave }) => {
    const [goals, setGoals] = useState(currentGoals);

    const handleInputChange = (label: string, value: number) => {
        setGoals(prev => ({
            ...prev,
            [label]: value,
        }));
    };

    const handleSave = () => {
        onSave(goals);
    };

    return (
        <div className="goal-inputs">
            {Object.keys(goals).map(label => (
                <div key={label}>
                    <label htmlFor={label}>{label}</label>
                    <input
                        id={label}
                        type="number"
                        value={goals[label]}
                        onChange={e => handleInputChange(label, parseInt(e.target.value) || 0)}
                    />
                </div>
            ))}
            <button onClick={handleSave}>Save Goals</button>
        </div>
    );
};

export default GoalInput;
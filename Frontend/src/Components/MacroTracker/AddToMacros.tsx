import React from 'react';

interface MacroData {
    label: string;
    amount: number;
    goal: number;
}

interface AddToMacrosProps {
    macros: MacroData[];
    inputValues: Record<string, number>;
    onInputChange: (label: string, value: number) => void;
    onSubmit: () => void;
}

const AddToMacros: React.FC<AddToMacrosProps> = ({
    macros,
    inputValues,
    onInputChange,
    onSubmit,
}) => {
    return (
        <div className="macro-inputs">
            {macros.map(macro => (
                <div key={macro.label}>
                    <label htmlFor={macro.label}>{macro.label}</label>
                    <input
                        id={macro.label}
                        type="number"
                        value={inputValues[macro.label]}
                        onChange={e =>
                            onInputChange(
                                macro.label,
                                parseInt(e.target.value) || 0
                            )
                        }
                    />
                </div>
            ))}
            <button onClick={onSubmit}>Add</button>
        </div>
    );
};

export default AddToMacros;

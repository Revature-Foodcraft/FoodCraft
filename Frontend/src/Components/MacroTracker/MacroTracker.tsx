import React from 'react';
import './MacroTracker.css';
import AddToMacros from './AddToMacros';
import MacroCircle, { MacroData } from './MacroCircle';
import { useMacros } from './useMacros';

const MacroTracker: React.FC = () => {
  const {
    macros,
    loading,
    error,
    inputValues,
    setInputValues,
    showInputs,
    setShowInputs,
    updateMacros,
  } = useMacros();

  // Updates input values from the AddToMacros component.
  const handleInputChange = (label: string, value: number) => {
    setInputValues(prev => ({
      ...prev,
      [label]: value,
    }));
  };

  return (
    <div className="macro-tracker">
      <h4>Today's Macros</h4>
      {loading && <p>Loading macros...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="macro-circle-container">
        {macros.map((macro: MacroData) => (
          <div key={macro.label} className="macro-item">
            <MacroCircle {...macro} />
          </div>
        ))}
      </div>

      <div className="macro-controls-wrapper">
        <div className="macro-add-button">
          <button onClick={() => setShowInputs(prev => !prev)}>
            Add to macros
          </button>
        </div>
        <div className={`macro-inputs-wrapper ${showInputs ? 'show' : ''}`}>
          <AddToMacros
            macros={macros}
            inputValues={inputValues}
            onInputChange={handleInputChange}
            onSubmit={updateMacros}
          />
        </div>
      </div>
    </div>
  );
};

export default MacroTracker;

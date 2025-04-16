import React, { useEffect } from 'react';
import './MacroTracker.css';
import AddToMacros from './AddToMacros';
import MacroCircle, { MacroData } from './MacroCircle';
import GoalInput from './GoalInput';
import { useMacros } from './useMacros';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

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
    goals,
    updateGoals,
    fetchMacros,
  } = useMacros();

  const handleInputChange = (label: string, value: number) => {
    setInputValues(prev => ({
      ...prev,
      [label]: value,
    }));
  };

  // Ensure macros are fetched only once when the component mounts
  useEffect(() => {
    fetchMacros();
  }, []);

  return (
    <div className="macro-tracker">
      <h4>Today's Macros</h4>
      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="macro-circle-container">
        {macros.map((macro: MacroData) => (
          <MacroCircle key={macro.label} {...macro} />
        ))}
      </div>

      <div className="macro-controls-wrapper">
        <button className="macro-add-button" onClick={() => setShowInputs(!showInputs)}>
          Add Macros
        </button>
        {showInputs && (
          <AddToMacros
            macros={macros}
            inputValues={inputValues}
            onInputChange={handleInputChange}
            onSubmit={updateMacros}
          />
        )}
      </div>

      <div className="goal-input-wrapper">
        <h5>Set Your Daily Goals</h5>
        <GoalInput currentGoals={goals} onSave={updateGoals} />
      </div>
    </div>
  );
};

export default MacroTracker;

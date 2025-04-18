import React, { useEffect } from 'react';
import '../../css/MacroTracker.css';
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
    goalsVisible,
    setGoalsVisible
  } = useMacros();

  const handleToggleInputs = () => {
    if (showInputs) {
      setShowInputs(false);
    } else {
      setShowInputs(true);
      setGoalsVisible(false);
    }
  };

  const handleToggleGoals = () => {
    if (goalsVisible) {
      setGoalsVisible(false);
    } else {
      setGoalsVisible(true);
      setShowInputs(false);
    }
  };

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

      <div>
        <div className="macro-controls-wrapper d-flex justify-content-between">
          <button className="btn btn-warning btn-lg rounded-pill shadow-sm btn-custom" onClick={handleToggleInputs}>
            Add Macros
          </button>
          <button className="btn btn-warning btn-lg rounded-pill shadow-sm btn-custom" onClick={handleToggleGoals}>
            Change Daily Goals
          </button>
        </div>

        {showInputs && (
          <AddToMacros
            macros={macros}
            inputValues={inputValues}
            onInputChange={(label, value) => setInputValues(prev => ({ ...prev, [label]: value }))}
            onSubmit={updateMacros}
          />
        )}

        {goalsVisible && (
          <div className="goal-input-wrapper">
            <GoalInput currentGoals={goals} onSave={updateGoals} setGoalsVisible={setGoalsVisible} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MacroTracker;

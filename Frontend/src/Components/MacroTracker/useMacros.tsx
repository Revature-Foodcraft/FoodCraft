// useMacros.ts
import { useState, useEffect } from 'react';
import { MacroData } from './MacroCircle';

interface DailyMacros {
  protein: number;
  fats: number;
  carbs: number;
  proteinGoal: number;
  fatsGoal: number;
  carbsGoal: number;
  date: string;
}

interface UseMacrosReturn {
  macros: MacroData[];
  loading: boolean;
  error: string;
  inputValues: Record<string, number>;
  setInputValues: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  showInputs: boolean;
  setShowInputs: React.Dispatch<React.SetStateAction<boolean>>;
  fetchMacros: () => Promise<void>;
  updateMacros: () => Promise<void>;
}

export const useMacros = (): UseMacrosReturn => {
  // Retrieve token from local storage
  const token = localStorage.getItem('token');

  const [macros, setMacros] = useState<MacroData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [inputValues, setInputValues] = useState<Record<string, number>>({
    Protein: 0,
    Fats: 0,
    Carbs: 0,
  });
  const [showInputs, setShowInputs] = useState<boolean>(false);

  // Transforms the backend daily_macros object into an array used by UI.
  const transformDailyMacros = (daily: DailyMacros): MacroData[] => [
    { label: 'Protein', amount: daily.protein, goal: daily.proteinGoal },
    { label: 'Fats', amount: daily.fats, goal: daily.fatsGoal },
    { label: 'Carbs', amount: daily.carbs, goal: daily.carbsGoal },
  ];

  // Fetch macros from the backend.
  const fetchMacros = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/macros', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch macros, status: ${res.status}`);
      }
      const data = await res.json();
      if (data.daily_macros) {
        setMacros(transformDailyMacros(data.daily_macros));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update macros by adding new input values to current values.
  const updateMacros = async () => {
    setError('');
    // Get current macro values (default to 0 if not present)
    const currentProtein = macros.find(m => m.label === 'Protein')?.amount || 0;
    const currentFats = macros.find(m => m.label === 'Fats')?.amount || 0;
    const currentCarbs = macros.find(m => m.label === 'Carbs')?.amount || 0;

    // Sum up current values with new inputs.
    const newProtein = currentProtein + inputValues.Protein;
    const newFats = currentFats + inputValues.Fats;
    const newCarbs = currentCarbs + inputValues.Carbs;

    try {
      const res = await fetch('http://localhost:5000/macros', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          protein: newProtein,
          fats: newFats,
          carbs: newCarbs,
        }),
      });
      if (!res.ok) {
        throw new Error(`Failed to update macros, status: ${res.status}`);
      }
      const data = await res.json();
      if (data.daily_macros) {
        setMacros(transformDailyMacros(data.daily_macros));
      }
      // Reset inputs and hide input fields.
      setInputValues({ Protein: 0, Fats: 0, Carbs: 0 });
      setShowInputs(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Fetch macros on hook initialization.
  useEffect(() => {
    fetchMacros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    macros,
    loading,
    error,
    inputValues,
    setInputValues,
    showInputs,
    setShowInputs,
    fetchMacros,
    updateMacros,
  };
};

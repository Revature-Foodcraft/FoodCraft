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
  calories: number;
  caloriesGoal: number;
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
  goals: Record<string, number>;
  updateGoals: (newGoals: Record<string, number>) => Promise<void>;
  goalsVisible: boolean;
  setGoalsVisible: React.Dispatch<React.SetStateAction<boolean>>;

}

export const useMacros = (): UseMacrosReturn => {
  const token = localStorage.getItem('token');

  const [goalsVisible, setGoalsVisible] = useState<boolean>(false);
  const [macros, setMacros] = useState<MacroData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [inputValues, setInputValues] = useState<Record<string, number>>({
    Protein: 0,
    Fats: 0,
    Carbs: 0,
    Calories: 0, // Added Calories to ensure it is initialized
  });
  const [showInputs, setShowInputs] = useState<boolean>(false);
  const [goals, setGoals] = useState<Record<string, number>>({
    Protein: 120,
    Fats: 70,
    Carbs: 200,
    Calories: 2000,
  });

  const transformDailyMacros = (daily: DailyMacros): MacroData[] => [
    { label: 'Protein', amount: daily.protein, goal: daily.proteinGoal },
    { label: 'Fats', amount: daily.fats, goal: daily.fatsGoal },
    { label: 'Carbs', amount: daily.carbs, goal: daily.carbsGoal },
    { label: 'Calories', amount: daily.calories, goal: daily.caloriesGoal },
  ];

  const fetchMacros = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/macros', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch macros, status: ${res.status}`);
      }
      const data = await res.json();
      if (data.daily_macros) {
        setMacros(transformDailyMacros(data.daily_macros));
        setGoals({
          Protein: data.daily_macros.proteinGoal,
          Fats: data.daily_macros.fatsGoal,
          Carbs: data.daily_macros.carbsGoal,
          Calories: data.daily_macros.caloriesGoal,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateMacros = async () => {
    setError('');

    // Check if at least one field has been modified
    const hasChanges = Object.keys(inputValues).some(
      key => inputValues[key] !== 0
    );

    if (!hasChanges) {
      setError('Please modify at least one field before submitting.');
      return;
    }

    const currentProtein = macros.find(m => m.label === 'Protein')?.amount || 0;
    const currentFats = macros.find(m => m.label === 'Fats')?.amount || 0;
    const currentCarbs = macros.find(m => m.label === 'Carbs')?.amount || 0;
    const currentCalories = macros.find(m => m.label === 'Calories')?.amount || 0;

    const newProtein = currentProtein + inputValues.Protein;
    const newFats = currentFats + inputValues.Fats;
    const newCarbs = currentCarbs + inputValues.Carbs; // Corrected calculation
    const newCalories = currentCalories + inputValues.Calories;

    try {
      const res = await fetch('http://localhost:5000/macros', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          protein: newProtein,
          fats: newFats,
          carbs: newCarbs,
          calories: newCalories,
        }),
      });
      if (!res.ok) {
        throw new Error(`Failed to update macros, status: ${res.status}`);
      }
      const data = await res.json();
      if (data.daily_macros) {
        setMacros(transformDailyMacros(data.daily_macros));
      }
      setInputValues({ Protein: 0, Fats: 0, Carbs: 0, Calories: 0 });
      setShowInputs(false);
    } catch (err: any) {
      console.error("Error updating macros:", err);
      setError(err.message);
    }
  };

  const updateGoals = async (newGoals: Record<string, number>) => {
    setError('');
    try {
      // Transform keys to match backend schema
      const transformedGoals = {
        proteinGoal: newGoals.Protein,
        fatsGoal: newGoals.Fats,
        carbsGoal: newGoals.Carbs,
        caloriesGoal: newGoals.Calories, // Include caloriesGoal
      };

      const res = await fetch('http://localhost:5000/macros/goals', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedGoals),
      });
      if (!res.ok) {
        throw new Error(`Failed to update goals, status: ${res.status}`);
      }

      // Fetch updated macros after successful update
      await fetchMacros();
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMacros();
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
    goals,
    updateGoals,
    goalsVisible,
    setGoalsVisible
  };
};

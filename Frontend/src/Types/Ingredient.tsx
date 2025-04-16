export enum IngredientCategory {
  Meat = 'Meat',
  Vegetables = 'Vegetables',
  Dairy = 'Dairy',
  Fruits = 'Fruits',
  Sauses = "Sauses",
  Spices = "Spices",
  Cerials = "Cerials",
  Other = "Other"
  // add additional categories as needed
}

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  amount: number; // Changed from string to number
  unit: string; // Added unit explicitly
}



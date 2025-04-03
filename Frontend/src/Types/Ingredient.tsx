
export enum IngredientCategory {
  Meat = 'Meat',
  Vegetables = 'Vegetables',
  Dairy = 'Dairy',
  Fruits = 'Fruits',
  // add additional categories as needed
}

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  amount: string; 
}



// External API endpoints
export const API_ENDPOINTS = {
  WEATHER: '/api/weather',
  NEWS: '/api/news',
  CURRENCY: '/api/currency',
  TUTORIALS: '/api/tutorials',
  RECIPES: '/api/recipes',
  TIPS: '/api/tips',
  TIP_OF_DAY: '/api/tips/daily'
};

// Currency list
export const CURRENCIES = [
  { value: "USD", label: "US Dollar" },
  { value: "EUR", label: "Euro" },
  { value: "GBP", label: "British Pound" },
  { value: "JPY", label: "Japanese Yen" },
  { value: "GEL", label: "Georgian Lari" },
  { value: "AUD", label: "Australian Dollar" },
  { value: "CAD", label: "Canadian Dollar" },
  { value: "CHF", label: "Swiss Franc" },
  { value: "CNY", label: "Chinese Yuan" },
  { value: "INR", label: "Indian Rupee" },
  { value: "RUB", label: "Russian Ruble" },
  { value: "TRY", label: "Turkish Lira" },
];

// News categories
export const NEWS_CATEGORIES = [
  "Business",
  "Entertainment",
  "General",
  "Health",
  "Science",
  "Sports",
  "Technology"
];

// Tutorial categories
export const TUTORIAL_CATEGORIES = [
  "Finance",
  "Personal Development",
  "Technology",
  "Health",
  "Cooking",
  "Home Improvement",
  "Education"
];

// Recipe cuisines
export const RECIPE_CUISINES = [
  "American",
  "British",
  "Canadian",
  "Chinese", 
  "Croatian",
  "Dutch",
  "Egyptian",
  "Filipino",
  "French",
  "Georgian", // ქართული სამზარეულო
  "Greek",
  "Indian",
  "Irish",
  "Italian",
  "Jamaican",
  "Japanese",
  "Kenyan",
  "Malaysian",
  "Mexican",
  "Moroccan",
  "Polish",
  "Portuguese",
  "Russian",
  "Spanish",
  "Thai",
  "Tunisian",
  "Turkish",
  "Vietnamese"
];

// MealDB API ტიპები
export interface MealDBResponse {
  meals: Meal[] | null;
  error?: boolean;
  message?: string;
}

export interface MealDBCategoriesResponse {
  categories: MealCategory[] | null;
  error?: boolean;
  message?: string;
}

export interface MealCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface Meal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
}

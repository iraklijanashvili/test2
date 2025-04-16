import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Clock, ChefHat } from "lucide-react";

// ქართული რეცეპტების ტიპები და მონაცემები
type RecipeCategory = "მთავარი კერძი" | "სალათი" | "დესერტი" | "საუზმე" | "სუპი" | "ხაჭაპური და პური";

type Recipe = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: RecipeCategory;
  prepTime: number; // წუთებში
  cookTime: number; // წუთებში
  servings: number;
  difficulty: "მარტივი" | "საშუალო" | "რთული";
  ingredients: string[];
  steps: string[];
};

// ქართული რეცეპტების მონაცემთა ბაზა - აღარ ვიყენებთ სტატიკურ მონაცემებს
const GEORGIAN_RECIPES: Recipe[] = [];

// კატეგორიების სია
const CATEGORIES: RecipeCategory[] = [
  "მთავარი კერძი", 
  "სალათი", 
  "დესერტი", 
  "საუზმე", 
  "სუპი", 
  "ხაჭაპური და პური"
];

export default function Recipes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  // ბაზიდან რეცეპტების მოთხოვნა Supabase-ის გამოყენებით
  useEffect(() => {
    async function fetchRecipes() {
      try {
        setIsLoading(true);
        setLoading(true);
        
        // Supabase-დან რეცეპტების მოთხოვნა
        const { data: recipeService } = await import('@/services/supabaseService');
        const recipes = await recipeService.recipeService.getAll();
        
        // რეცეპტების ფორმატირება კომპონენტის ტიპებთან შესაბამისობაში
        const formattedRecipes = recipes.map((recipe: any) => ({
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          imageUrl: recipe.image_url || 'https://placehold.co/600x400?text=Recipe',
          category: recipe.category as RecipeCategory,
          prepTime: recipe.prep_time,
          cookTime: recipe.cook_time,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          ingredients: recipe.ingredients ? recipe.ingredients.map((ing: any) => `${ing.amount} ${ing.unit} ${ing.name}`) : [],
          steps: recipe.steps ? recipe.steps.map((step: any) => step.instruction) : []
        }));
        
        console.log("Supabase-დან მიღებული რეცეპტები:", formattedRecipes);
        setRecipes(formattedRecipes);

      } catch (error) {
        console.error("რეცეპტების მოთხოვნის შეცდომა:", error);
        toast({
          title: "შეცდომა",
          description: "რეცეპტების ჩატვირთვა ვერ მოხერხდა.",
          variant: "destructive"
        });
        setRecipes([]);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    }

    fetchRecipes();
  }, [toast]);

  // რეცეპტების ფილტრაცია
  const filteredRecipes = recipes.filter(recipe => {
    // კატეგორიის ფილტრი
    if (selectedCategory && recipe.category !== selectedCategory) {
      return false;
    }

    // ძებნის ფილტრი
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        (recipe.ingredients && recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query)))
      );
    }

    return true;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? "" : value);
  };

  // დეტალების გახსნა და მისამართზე გადასვლა
  const handleViewRecipe = (recipe: Recipe) => {
    // Wouter-ის ნავიგაციის გამოყენება ბრაუზერის გადატვირთვის გარეშე
    setLocation(`/recipe/${recipe.id}`);
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-primary px-4 py-3 text-white">
        <h3 className="text-lg font-semibold">ქართული რეცეპტები</h3>
      </div>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  id="recipeSearch"
                  placeholder="მოძებნეთ რეცეპტები..."
                  className="w-full pl-10 pr-4 py-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Button 
                  type="submit" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-2"
                >
                  ძებნა
                </Button>
              </div>
            </form>
          </div>

          <div>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="კატეგორია" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ყველა კატეგორია</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center p-10">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">რეცეპტების ჩატვირთვა...</p>
          </div>
        ) : isLoading ? ( //Added loading state
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-3">რეცეპტები იტვირთება...</span>
          </div>
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div 
                key={recipe.id} 
                className="rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-white shadow-sm border-0"
                onClick={() => handleViewRecipe(recipe)}
              >
                <div className="h-56 bg-gray-200 relative">
                  <div 
                    style={{ 
                      backgroundImage: `url('${recipe.imageUrl}')`, 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center'
                    }}
                    className="w-full h-full"
                  ></div>
                  <div className="absolute top-3 right-3">
                    <div className="px-3 py-1.5 bg-primary rounded-full text-white text-xs font-medium">
                      {recipe.category}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <div className="flex items-center text-white text-sm font-medium">
                      <ChefHat className="h-4 w-4 mr-2" />
                      <span>{recipe.difficulty}</span>
                      <div className="mx-2 w-1 h-1 bg-white rounded-full"></div>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{recipe.prepTime + recipe.cookTime} წთ</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg text-gray-800 mb-2">{recipe.title}</h4>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-3">{recipe.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {recipe.ingredients && recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
                      <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {ingredient.split(' ')[0]}
                      </span>
                    ))}
                    {recipe.ingredients && recipe.ingredients.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                        +{recipe.ingredients.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 text-gray-500">
            <p>რეცეპტები ვერ მოიძებნა</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
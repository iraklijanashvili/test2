import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Clock, Users, ChefHat } from "lucide-react";
import { recipeService } from "@/services/supabaseService";
import SEO from "@/components/layout/SEO";

type Ingredient = {
  name: string;
  amount: string;
  unit: string;
};

type Step = {
  stepNumber: number;
  instruction: string;
};

type Recipe = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  ingredients: Ingredient[];
  steps: Step[];
};

export default function RecipeDetailPage() {
  const [, params] = useRoute("/recipe/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params?.id) {
      fetchRecipe(parseInt(params.id));
    }
  }, [params?.id]);

  const fetchRecipe = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await recipeService.getById(id);
      setRecipe(data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setError("რეცეპტის ჩატვირთვა ვერ მოხერხდა");
      toast({
        title: "შეცდომა",
        description: "რეცეპტის ჩატვირთვა ვერ მოხერხდა",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // სირთულის ინდიკატორი
  const DifficultyIndicator = ({ difficulty }: { difficulty: string }) => {
    const levels = {
      "მარტივი": 1,
      "საშუალო": 2,
      "რთული": 3
    };
    
    const level = levels[difficulty as keyof typeof levels] || 1;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full ${i < level ? 'bg-accent' : 'bg-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm">{difficulty}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/recipes")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            უკან დაბრუნება
          </Button>
          
          <Card className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">შეცდომა</h2>
            <p className="text-gray-600">{error || "რეცეპტი ვერ მოიძებნა"}</p>
            <Button 
              onClick={() => navigate("/recipes")} 
              className="mt-4"
            >
              რეცეპტების გვერდზე დაბრუნება
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <SEO 
        title={`${recipe.title} | უნივერსალური ხელსაწყოები`}
        description={recipe.description}
        ogType="article"
        keywords={`რეცეპტი, კულინარია, ${recipe.category}, ${recipe.title}`}
      />
      <Header />
      
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/recipes")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          უკან დაბრუნება
        </Button>
        
        <article className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={recipe.imageUrl || "https://placehold.co/600x400?text=Recipe"} 
                alt={recipe.title} 
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            
            <div className="p-6 md:p-8 md:w-1/2">
              <div className="mb-2">
                <span className="inline-block bg-accent/10 text-accent rounded-full px-3 py-1 text-sm font-medium">
                  {recipe.category}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                {recipe.title}
              </h1>
              
              <p className="text-gray-600 mb-6">
                {recipe.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-accent mb-1" />
                  <span className="text-xs text-gray-500">მომზადება</span>
                  <span className="font-medium">{recipe.prepTime} წთ</span>
                </div>
                
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-accent mb-1" />
                  <span className="text-xs text-gray-500">მომზადება</span>
                  <span className="font-medium">{recipe.cookTime} წთ</span>
                </div>
                
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-accent mb-1" />
                  <span className="text-xs text-gray-500">პორციები</span>
                  <span className="font-medium">{recipe.servings}</span>
                </div>
                
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <ChefHat className="h-5 w-5 text-accent mb-1" />
                  <span className="text-xs text-gray-500">სირთულე</span>
                  <DifficultyIndicator difficulty={recipe.difficulty} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="md:flex md:gap-12">
              <div className="md:w-1/3 mb-8 md:mb-0">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  ინგრედიენტები
                </h2>
                
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-accent/10 text-accent rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                        •
                      </div>
                      <span>
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  მომზადების წესი
                </h2>
                
                <div className="space-y-6">
                  {recipe.steps.map((step, index) => (
                    <div key={index} className="flex">
                      <div className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 mr-4">
                        {step.stepNumber}
                      </div>
                      <div>
                        <p className="text-gray-700">{step.instruction}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>
        
        <div className="mt-8 flex justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/recipe-edit/${recipe.id}`)}
          >
            რეცეპტის რედაქტირება
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
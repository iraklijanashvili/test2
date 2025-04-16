import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { recipeService } from "@/services/recipeService";
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

export default function RecipeEditPage() {
  const [, params] = useRoute("/recipe-edit/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<Recipe>({
    id: 0,
    title: "",
    description: "",
    imageUrl: "",
    category: "მთავარი კერძი",
    prepTime: 30,
    cookTime: 30,
    servings: 4,
    difficulty: "საშუალო",
    ingredients: [{ name: "", amount: "", unit: "" }],
    steps: [{ stepNumber: 1, instruction: "" }]
  });

  useEffect(() => {
    if (params?.id) {
      fetchRecipe(parseInt(params.id));
    } else {
      setLoading(false);
    }
  }, [params?.id]);

  const fetchRecipe = async (id: number) => {
    try {
      setLoading(true);
      const data = await recipeService.getById(id);
      
      // თუ ინგრედიენტები და ნაბიჯები არ არის მასივები, შევქმნათ ცარიელი მასივები
      const ingredients = Array.isArray(data.ingredients) ? data.ingredients : [{ name: "", amount: "", unit: "" }];
      const steps = Array.isArray(data.steps) ? data.steps : [{ stepNumber: 1, instruction: "" }];
      
      setRecipe({
        ...data,
        ingredients,
        steps
      });
    } catch (error) {
      console.error('Error fetching recipe:', error);
      toast({
        title: "შეცდომა",
        description: "რეცეპტის ჩატვირთვა ვერ მოხერხდა",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // შევამოწმოთ აუცილებელი ველები
      if (!recipe.title.trim() || !recipe.description.trim() || !recipe.category) {
        toast({
          title: "შეცდომა",
          description: "გთხოვთ შეავსოთ ყველა აუცილებელი ველი",
          variant: "destructive",
        });
        return;
      }
      
      // ვალიდური ინგრედიენტები და ნაბიჯები
      const validIngredients = recipe.ingredients.filter(ing => ing.name.trim() !== '');
      const validSteps = recipe.steps.filter(step => step.instruction.trim() !== '');
      
      if (validIngredients.length === 0 || validSteps.length === 0) {
        toast({
          title: "შეცდომა",
          description: "გთხოვთ დაამატოთ მინიმუმ ერთი ინგრედიენტი და ერთი ნაბიჯი",
          variant: "destructive",
        });
        return;
      }
      
      // რეცეპტის მონაცემების მომზადება
      const recipeData = {
        title: recipe.title,
        description: recipe.description,
        image_url: recipe.imageUrl || "https://placehold.co/600x400?text=Recipe",
        category: recipe.category,
        prep_time: recipe.prepTime,
        cook_time: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty
      };
      
      if (recipe.id) {
        // არსებული რეცეპტის განახლება
        await recipeService.update(recipe.id, recipeData);
        
        // წავშალოთ არსებული ინგრედიენტები და ნაბიჯები
        const { supabase } = await import('@/lib/supabase');
        
        await supabase
          .from('ingredients')
          .delete()
          .eq('recipe_id', recipe.id);
          
        await supabase
          .from('steps')
          .delete()
          .eq('recipe_id', recipe.id);
        
        // დავამატოთ ახალი ინგრედიენტები
        if (validIngredients.length > 0) {
          await supabase
            .from('ingredients')
            .insert(
              validIngredients.map(ingredient => ({
                recipe_id: recipe.id,
                name: ingredient.name,
                amount: ingredient.amount,
                unit: ingredient.unit,
                created_at: new Date().toISOString()
              }))
            );
        }
        
        // დავამატოთ ახალი ნაბიჯები
        if (validSteps.length > 0) {
          await supabase
            .from('steps')
            .insert(
              validSteps.map((step, index) => ({
                recipe_id: recipe.id,
                step_number: index + 1,
                instruction: step.instruction,
                created_at: new Date().toISOString()
              }))
            );
        }
      } else {
        // ახალი რეცეპტის შექმნა
        const newRecipe = await recipeService.create(recipeData);
        
        // დავამატოთ ინგრედიენტები
        if (validIngredients.length > 0) {
          await supabase
            .from('ingredients')
            .insert(
              validIngredients.map(ingredient => ({
                recipe_id: newRecipe.id,
                name: ingredient.name,
                amount: ingredient.amount,
                unit: ingredient.unit,
                created_at: new Date().toISOString()
              }))
            );
        }
        
        // დავამატოთ ნაბიჯები
        if (validSteps.length > 0) {
          await supabase
            .from('steps')
            .insert(
              validSteps.map((step, index) => ({
                recipe_id: newRecipe.id,
                step_number: index + 1,
                instruction: step.instruction,
                created_at: new Date().toISOString()
              }))
            );
        }
      }
      
      toast({
        title: "წარმატება",
        description: `რეცეპტი ${recipe.id ? 'განახლდა' : 'დაემატა'} წარმატებით`,
      });
      
      navigate("/recipes");
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "შეცდომა",
        description: `რეცეპტის შენახვა ვერ მოხერხდა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        variant: "destructive",
      });
    }
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: "", amount: "", unit: "" }]
    });
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const removeIngredient = (index: number) => {
    if (recipe.ingredients.length <= 1) return;
    
    const updatedIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const addStep = () => {
    const newStepNumber = recipe.steps.length > 0 
      ? Math.max(...recipe.steps.map(s => s.stepNumber)) + 1 
      : 1;
      
    setRecipe({
      ...recipe,
      steps: [...recipe.steps, { stepNumber: newStepNumber, instruction: "" }]
    });
  };

  const updateStep = (index: number, instruction: string) => {
    const updatedSteps = [...recipe.steps];
    updatedSteps[index] = { ...updatedSteps[index], instruction };
    setRecipe({ ...recipe, steps: updatedSteps });
  };

  const removeStep = (index: number) => {
    if (recipe.steps.length <= 1) return;
    
    const updatedSteps = recipe.steps.filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, stepNumber: i + 1 }));
    
    setRecipe({ ...recipe, steps: updatedSteps });
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

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <SEO 
        title={`${recipe.id ? 'რეცეპტის რედაქტირება' : 'ახალი რეცეპტი'} | უნივერსალური ხელსაწყოები`}
        description="რეცეპტის რედაქტირების გვერდი"
        ogType="website"
        keywords="რეცეპტი, რედაქტირება, კულინარია"
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

        <h1 className="text-3xl font-bold mb-6">
          {recipe.id ? 'რეცეპტის რედაქტირება' : 'ახალი რეცეპტი'}
        </h1>
        
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">ძირითადი ინფორმაცია</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">სათაური</Label>
                  <Input
                    id="title"
                    value={recipe.title}
                    onChange={(e) => setRecipe({...recipe, title: e.target.value})}
                    placeholder="შეიყვანეთ რეცეპტის სახელი"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">აღწერა</Label>
                  <Textarea
                    id="description"
                    value={recipe.description}
                    onChange={(e) => setRecipe({...recipe, description: e.target.value})}
                    placeholder="მოკლე აღწერა რეცეპტის შესახებ"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="imageUrl">სურათის URL</Label>
                  <Input
                    id="imageUrl"
                    value={recipe.imageUrl}
                    onChange={(e) => setRecipe({...recipe, imageUrl: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">კატეგორია</Label>
                    <Select
                      value={recipe.category}
                      onValueChange={(value) => setRecipe({...recipe, category: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="აირჩიეთ კატეგორია" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="მთავარი კერძი">მთავარი კერძი</SelectItem>
                        <SelectItem value="სალათი">სალათი</SelectItem>
                        <SelectItem value="დესერტი">დესერტი</SelectItem>
                        <SelectItem value="საუზმე">საუზმე</SelectItem>
                        <SelectItem value="სუპი">სუპი</SelectItem>
                        <SelectItem value="ხაჭაპური და პური">ხაჭაპური და პური</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="difficulty">სირთულე</Label>
                    <Select
                      value={recipe.difficulty}
                      onValueChange={(value) => setRecipe({...recipe, difficulty: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="აირჩიეთ სირთულე" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="მარტივი">მარტივი</SelectItem>
                        <SelectItem value="საშუალო">საშუალო</SelectItem>
                        <SelectItem value="რთული">რთული</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="prepTime">მომზადების დრო (წუთი)</Label>
                    <Input
                      id="prepTime"
                      type="number"
                      min="1"
                      value={recipe.prepTime}
                      onChange={(e) => setRecipe({...recipe, prepTime: parseInt(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cookTime">მომზადების დრო (წუთი)</Label>
                    <Input
                      id="cookTime"
                      type="number"
                      min="1"
                      value={recipe.cookTime}
                      onChange={(e) => setRecipe({...recipe, cookTime: parseInt(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="servings">პორციების რაოდენობა</Label>
                    <Input
                      id="servings"
                      type="number"
                      min="1"
                      value={recipe.servings}
                      onChange={(e) => setRecipe({...recipe, servings: parseInt(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">ინგრედიენტები</h2>
                <Button type="button" onClick={addIngredient} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  დამატება
                </Button>
              </div>
              
              <div className="space-y-4">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      placeholder="ინგრედიენტი"
                      className="flex-grow"
                    />
                    <Input
                      value={ingredient.amount}
                      onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                      placeholder="რაოდენობა"
                      className="w-24"
                    />
                    <Input
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                      placeholder="ერთეული"
                      className="w-24"
                    />
                    <Button 
                      type="button" 
                      onClick={() => removeIngredient(index)} 
                      variant="ghost" 
                      size="icon"
                      disabled={recipe.ingredients.length <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">მომზადების ნაბიჯები</h2>
                <Button type="button" onClick={addStep} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  დამატება
                </Button>
              </div>
              
              <div className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <div key={index} className="flex items-
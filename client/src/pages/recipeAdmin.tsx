import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Minus, Trash2, Save, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// რეცეპტის ფორმის სქემა (ვალიდაციის გარეშე)
const recipeFormSchema = z.object({
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().optional().or(z.literal("")),
  category: z.enum(["მთავარი კერძი", "სალათი", "დესერტი", "საუზმე", "სუპი", "ხაჭაპური და პური"]),
  prepTime: z.coerce.number(),
  cookTime: z.coerce.number(),
  servings: z.coerce.number(),
  difficulty: z.enum(["მარტივი", "საშუალო", "რთული"])
});

type RecipeFormValues = z.infer<typeof recipeFormSchema>;

export default function RecipeAdminPage() {
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // ფორმის ინიციალიზაცია
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      category: "მთავარი კერძი",
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      difficulty: "საშუალო"
    }
  });

  // ინგრედიენტის დამატება
  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  // ინგრედიენტის შეცვლა
  const changeIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  // ინგრედიენტის წაშლა
  const removeIngredient = (index: number) => {
    if (ingredients.length <= 1) return; // მინიმუმ ერთი ინგრედიენტი მაინც უნდა დარჩეს
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  // მომზადების ნაბიჯის დამატება
  const addStep = () => {
    setSteps([...steps, ""]);
  };

  // მომზადების ნაბიჯის შეცვლა
  const changeStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  // მომზადების ნაბიჯის წაშლა
  const removeStep = (index: number) => {
    if (steps.length <= 1) return; // მინიმუმ ერთი ნაბიჯი მაინც უნდა დარჩეს
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  // რეცეპტის შენახვა
  const onSubmit = async (data: RecipeFormValues) => {
    // ინგრედიენტები და ნაბიჯები (ცარიელებიც დაშვებულია)
    const validIngredients = ingredients.filter(ing => ing.trim() !== '');
    const validSteps = steps.filter(step => step.trim() !== '');

    // თუ ინგრედიენტები ან ნაბიჯები არ არის, დავამატოთ ცარიელი
    if (validIngredients.length === 0) {
      validIngredients.push("ინგრედიენტი");
    }

    if (validSteps.length === 0) {
      validSteps.push("მომზადების ნაბიჯი");
    }

    try {
      // ვამზადებთ მონაცემებს გასაგზავნად
      const recipeData = {
        recipe: {
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl || "https://placehold.co/600x400?text=Recipe", // თუ სურათი არ არის, გამოვიყენოთ placeholder
          category: data.category,
          prepTime: data.prepTime,
          cookTime: data.cookTime,
          servings: data.servings,
          difficulty: data.difficulty
        },
        ingredients: validIngredients.map(text => ({ name: text || "ინგრედიენტი", amount: "1", unit: "ცალი" })),
        steps: validSteps.map((instructions, index) => ({ 
          stepNumber: index + 1, 
          instruction: instructions || `ნაბიჯი ${index + 1}`
        }))
      };

      // გვაგზავნის მონაცემებს სერვერზე
      const response = await fetch("/api/georgian-recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(recipeData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save recipe");
      }

      const savedRecipe = await response.json();

      toast({
        title: "რეცეპტი შენახულია",
        description: `"${data.title}" წარმატებით დაემატა`,
      });

      // გადავიდეთ ახალი რეცეპტის გვერდზე
      navigate(`/recipe/${savedRecipe.id}`);
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast({
        title: "შეცდომა",
        description: `რეცეპტის შენახვა ვერ მოხერხდა: ${error instanceof Error ? error.message : "უცნობი შეცდომა"}`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">რეცეპტის დამატება</h1>
            <p className="text-gray-600 mt-1">შეავსეთ ფორმა ახალი რეცეპტის დასამატებლად</p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate("/recipes")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            უკან დაბრუნება
          </Button>
        </div>
        
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>რეცეპტის დეტალები</CardTitle>
            <CardDescription>შეიყვანეთ ყველა საჭირო ინფორმაცია თქვენი რეცეპტის შესახებ</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  {/* ძირითადი ინფორმაცია */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>სათაური</FormLabel>
                        <FormControl>
                          <Input name="სათაური" placeholder="მაგ. ხინკალი" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>აღწერა</FormLabel>
                        <FormControl>
                          <Textarea 
                            name="აღწერა"
                            placeholder="მოკლე აღწერა თქვენი რეცეპტის შესახებ" 
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>სურათის URL</FormLabel>
                        <FormControl>
                          <Input name="სურათის URL" placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          ჩასვით სურათის ბმული. თუ ცარიელს დატოვებთ, გამოყენებული იქნება სტანდარტული გამოსახულება.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>კატეგორია</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue name="კატეგორია" placeholder="აირჩიეთ კატეგორია" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="მთავარი კერძი">მთავარი კერძი</SelectItem>
                              <SelectItem value="სალათი">სალათი</SelectItem>
                              <SelectItem value="დესერტი">დესერტი</SelectItem>
                              <SelectItem value="საუზმე">საუზმე</SelectItem>
                              <SelectItem value="სუპი">სუპი</SelectItem>
                              <SelectItem value="ხაჭაპური და პური">ხაჭაპური და პური</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>სირთულე</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-6"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="მარტივი" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  მარტივი
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="საშუალო" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  საშუალო
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="რთული" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  რთული
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="prepTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>მომზადების დრო (წუთი)</FormLabel>
                          <FormControl>
                            <Input name="მომზადების დრო" type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cookTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>მომზადების დრო (წუთი)</FormLabel>
                          <FormControl>
                            <Input name="თბობის დრო" type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="servings"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>პორციების რაოდენობა</FormLabel>
                          <FormControl>
                            <Input name="პორციები" type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* ინგრედიენტები */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">ინგრედიენტები</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                      <Plus className="h-4 w-4 mr-1" />
                      დამატება
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={ingredient}
                          onChange={(e) => changeIngredient(index, e.target.value)}
                          placeholder={`ინგრედიენტი ${index + 1}`}
                          className="flex-grow"
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeIngredient(index)}
                          disabled={ingredients.length <= 1}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* მომზადების ნაბიჯები */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">მომზადების ნაბიჯები</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addStep}>
                      <Plus className="h-4 w-4 mr-1" />
                      დამატება
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {steps.map((step, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex items-center justify-center bg-primary text-primary-foreground rounded-full w-6 h-6 flex-shrink-0 mt-2">
                          {index + 1}
                        </div>
                        <div className="flex-grow">
                          <Textarea
                            value={step}
                            onChange={(e) => changeStep(index, e.target.value)}
                            placeholder={`ნაბიჯი ${index + 1}`}
                            className="w-full"
                          />
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeStep(index)}
                          disabled={steps.length <= 1}
                          className="mt-2"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <CardFooter className="flex justify-end px-0 pt-4">
                  <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                        შენახვა...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        რეცეპტის შენახვა
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
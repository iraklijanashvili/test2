
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";

export default function RecipeManagerPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState([]);
  
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/georgian-recipes');
      if (response.ok) {
        const data = await response.json();
        // შევამოწმოთ, რომ მიღებული მონაცემები არის მასივი
        if (Array.isArray(data)) {
          setRecipes(data);
        } else {
          console.error('მიღებული მონაცემები არ არის მასივი:', data);
          setRecipes([]);
        }
      }
    } catch (error) {
      console.error('შეცდომა რეცეპტების მიღებისას:', error);
      setRecipes([]);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('ნამდვილად გსურთ რეცეპტის წაშლა?')) return;
    
    try {
      console.log(`Sending DELETE request to /api/georgian-recipes/${id}`);
      const response = await fetch(`/api/georgian-recipes/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast({
          title: "რეცეპტი წაიშალა",
          description: "რეცეპტი წარმატებით წაიშალა",
        });
        fetchRecipes();
      } else {
        console.error(`Delete failed with status: ${response.status}`);
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      toast({
        title: "შეცდომა",
        description: "რეცეპტის წაშლა ვერ მოხერხდა",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/recipes")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          უკან დაბრუნება
        </Button>

        <h1 className="text-3xl font-bold mb-6">რეცეპტების მართვა</h1>
        
        <div className="grid gap-4">
          {recipes.map((recipe: any) => (
            <Card key={recipe.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">{recipe.title}</h3>
                  <p className="text-gray-600">{recipe.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setLocation(`/recipe-edit/${recipe.id}`)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    რედაქტირება
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(recipe.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    წაშლა
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import { Clock, Utensils, Users, ChevronDown } from 'lucide-react';

interface Recipe {
  id: number;
  title: string;
  description: string;
  image?: string;
  category: string;
  cookingTime: number;
  difficulty: string;
  servings: number;
}

export default function Recipes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recipesPerPage = 6;
  const { toast } = useToast();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/recipes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
      setError("რეცეპტების ჩატვირთვა ვერ მოხერხდა");
      toast({
        title: "შეცდომა",
        description: "რეცეპტების ჩატვირთვა ვერ მოხერხდა",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "all" || 
        recipe.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchQuery, selectedCategory]);

  const displayedRecipes = filteredRecipes.slice(0, currentPage * recipesPerPage);
  const hasMorePages = displayedRecipes.length < filteredRecipes.length;

  const categories = [
    { id: "all", name: "ყველა" },
    { id: "breakfast", name: "საუზმე" },
    { id: "appetizer", name: "ორცხობილა" },
    { id: "main", name: "მთავარი კერძი" },
    { id: "dessert", name: "დესერტი" },
    { id: "drink", name: "სასმელი" }
  ];

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} წთ`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours} სთ ${remainingMinutes} წთ` 
      : `${hours} სთ`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="recipe-card rounded-xl overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-5">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="flex gap-2 mt-4">
                <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                <div className="h-8 w-8 rounded-full bg-gray-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={fetchRecipes} 
          className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded"
        >
          სცადეთ ხელახლა
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      <div className="filter-section bg-translucent rounded-xl shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="მოძებნეთ რეცეპტები..."
              className="input flex-grow"
            />
            <button type="submit" className="btn md:w-auto">
              ძებნა
            </button>
          </div>
        </form>
        
        <div className="mt-4">
          <h3 className="text-md font-medium mb-3">კატეგორიები:</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors 
                  ${selectedCategory === category.id 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl shadow-inner">
          <div className="text-7xl mb-4">🍽️</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">რეცეპტები ვერ მოიძებნა</h3>
          <p className="text-gray-500 mb-4">სცადეთ სხვა საძიებო სიტყვები ან კატეგორია</p>
          {(searchQuery || selectedCategory !== "all") && (
            <div className="space-x-3">
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="btn-outline"
                >
                  ძიების გასუფთავება
                </button>
              )}
              {selectedCategory !== "all" && (
                <button 
                  onClick={() => setSelectedCategory('all')} 
                  className="btn-outline"
                >
                  ყველა კატეგორიის ჩვენება
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRecipes.map((recipe) => (
              <Link key={recipe.id} to={`/recipe/${recipe.id}`}>
                <div className="recipe-card hover-up transition-all duration-300 h-full flex flex-col">
                  <div className="relative overflow-hidden rounded-t-xl">
                    <img
                      src={recipe.image || "https://placehold.co/600x400?text=Recipe"}
                      alt={recipe.title}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="badge bg-translucent text-primary backdrop-blur-sm">
                        {categories.find(c => c.id === recipe.category)?.name || recipe.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-grow">
                    <h3 className="title text-xl font-bold mb-2 line-clamp-2">{recipe.title}</h3>
                    <p className="paragraph text-gray-600 line-clamp-3 mb-4">{recipe.description}</p>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-primary" />
                          <span>{formatTime(recipe.cookingTime)}</span>
                        </div>
                        <div className="flex items-center">
                          <Utensils className="h-4 w-4 mr-1 text-primary" />
                          <span>{recipe.difficulty}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-primary" />
                        <span>{recipe.servings} პორცია</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {hasMorePages && (
            <div className="text-center mt-8">
              <button 
                onClick={() => setCurrentPage(prev => prev + 1)} 
                className="btn-secondary"
              >
                მეტის ჩვენება
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 
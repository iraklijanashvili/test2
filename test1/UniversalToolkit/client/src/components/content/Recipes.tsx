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

// ქართული რეცეპტების მონაცემთა ბაზა
const GEORGIAN_RECIPES: Recipe[] = [
  {
    id: 1,
    title: "ხაჭაპური აჭარული",
    description: "გემრიელი გადახსნილი ხაჭაპური კვერცხით და კარაქით.",
    imageUrl: "https://media.istockphoto.com/id/1225304748/photo/adjarian-khachapuri-with-egg-is-traditional-georgian-dish.jpg",
    category: "ხაჭაპური და პური",
    prepTime: 40,
    cookTime: 15,
    servings: 4,
    difficulty: "საშუალო",
    ingredients: [
      "500გრ ფქვილი",
      "1 ჩ/კ მარილი",
      "300მლ თბილი წყალი",
      "7გრ საფუარი",
      "2 ს/კ ზეითუნის ზეთი",
      "400გრ სულგუნი",
      "100გრ იმერული ყველი",
      "4 კვერცხი",
      "50გრ კარაქი"
    ],
    steps: [
      "გახსენით საფუარი თბილ წყალში და დაუმატეთ მარილი.",
      "დაუმატეთ ფქვილი და მოზილეთ ცომი.",
      "დაასვენეთ ცომი 1 საათის განმავლობაში.",
      "გააბრტყელეთ ცომი ნავის ფორმით.",
      "დაუმატეთ დაჭრილი ყველი შუაში.",
      "გამოაცხვეთ 180°C ტემპერატურაზე 15 წუთი.",
      "გამოღებისას ჩაარტყით კვერცხი შუაში და დაუმატეთ კარაქი."
    ]
  },
  {
    id: 2,
    title: "ჩაქაფული",
    description: "ტრადიციული საგაზაფხულო კერძი ბატკნის ხორცით, მწვანილებით და ღვინით.",
    imageUrl: "https://media.istockphoto.com/id/1183254296/photo/georgian-cuisine-restaurant-chakapuli-stewed-spicy-boiled-lamp-meat-with-greens-lemon-marinade.jpg",
    category: "მთავარი კერძი",
    prepTime: 30,
    cookTime: 120,
    servings: 6,
    difficulty: "საშუალო",
    ingredients: [
      "1კგ ბატკნის ხორცი",
      "500გრ მწვანე ტყემალი",
      "1 კონა თავშანი (ესტრაგონი)",
      "1 კონა ომბალო",
      "1 კონა ქინძი",
      "4 ცალი ხახვი",
      "250მლ თეთრი ღვინო",
      "მარილი და პილპილი გემოვნებით"
    ],
    steps: [
      "დაჭერით ხორცი პატარა ნაჭრებად.",
      "მოათავსეთ ხორცი ქვაბში ხახვთან ერთად.",
      "დაასხით ღვინო და წყალი.",
      "დაამატეთ მწვანე ტყემალი და ადუღეთ 1 საათი.",
      "დაამატეთ მწვანილები და ადუღეთ კიდევ 30 წუთი.",
      "მიირთვით ცხლად პურთან ერთად."
    ]
  },
  {
    id: 3,
    title: "ხინკალი",
    description: "ქართული სამზარეულოს სიამაყე - ცომის პარკუჭები ხორცის წვნიანი შიგთავსით.",
    imageUrl: "https://media.istockphoto.com/id/623271730/photo/traditional-georgian-khinkali.jpg",
    category: "მთავარი კერძი",
    prepTime: 60,
    cookTime: 20,
    servings: 6,
    difficulty: "რთული",
    ingredients: [
      "500გრ ფქვილი",
      "250მლ წყალი",
      "1/2 ჩ/კ მარილი",
      "500გრ დაკეპილი საქონლის ხორცი",
      "200გრ დაკეპილი ღორის ხორცი",
      "2 ხახვი",
      "3 ნიორის კბილი",
      "1 ჩ/კ კუმინი",
      "1 ჩ/კ წითელი პილპილი",
      "200მლ ცივი წყალი ფარშისთვის",
      "მარილი და პილპილი გემოვნებით"
    ],
    steps: [
      "მოზილეთ ცომი წყლით, მარილით და დაასვენეთ 30 წუთი.",
      "მოამზადეთ ფარში ხორცის, ხახვის, ნიორის და სანელებლების შერევით.",
      "დაუმატეთ ფარშს ცივი წყალი და კარგად აურიეთ.",
      "გააბრტყელეთ ცომი და დაჭერით წრეებად.",
      "მოათავსეთ ფარში ცომის წრეებზე და შეკარით კოხტად.",
      "ადუღეთ ხინკალი მარილიან წყალში 7-8 წუთი.",
      "მიირთვით შავი პილპილით."
    ]
  },
  {
    id: 4,
    title: "ხარჩო",
    description: "არომატული ცხარე წვნიანი საქონლის ხორცით და ბრინჯით.",
    imageUrl: "https://media.istockphoto.com/id/1217286341/photo/kharcho-georgian-beef-soup-with-rice-and-sour-plums-sauce.jpg",
    category: "სუპი",
    prepTime: 30,
    cookTime: 120,
    servings: 8,
    difficulty: "საშუალო",
    ingredients: [
      "1კგ საქონლის ხორცი",
      "2 ხახვი",
      "3 ნიორის კბილი",
      "200გრ ბრინჯი",
      "3 ს/კ ტომატის პასტა",
      "2 ს/კ ტყემლის საწებელი",
      "1 ჩ/კ ხმელი სუნელი",
      "1 ჩ/კ უცხო სუნელი",
      "1 ჩ/კ საფერავის პილპილი",
      "1 კონა ქინძი",
      "მარილი გემოვნებით"
    ],
    steps: [
      "მოხარშეთ ხორცი 2 ლიტრ წყალში 1 საათის განმავლობაში.",
      "დაამატეთ დაჭრილი ხახვი და ნიორი.",
      "დაამატეთ ტომატის პასტა და ტყემალი.",
      "დაამატეთ სანელებლები და ბრინჯი.",
      "ადუღეთ კიდევ 20 წუთი.",
      "დაამატეთ დაჭრილი ქინძი მოხარშვის ბოლოს."
    ]
  },
  {
    id: 5,
    title: "ბადრიჯნის ფხალი",
    description: "ცივი საუზმე დამუშავებული ბადრიჯნით, კაკლით და სანელებლებით.",
    imageUrl: "https://media.istockphoto.com/id/1190450602/photo/eggplant-paste-rolls-with-walnut-filling-on-a-plate-badrijani-traditional-georgian-cuisine.jpg",
    category: "სალათი",
    prepTime: 40,
    cookTime: 20,
    servings: 4,
    difficulty: "მარტივი",
    ingredients: [
      "3 ბადრიჯანი",
      "200გრ კაკალი",
      "3 ნიორის კბილი",
      "1 ჩ/კ უცხო სუნელი",
      "1/2 ჩ/კ საფერავის პილპილი",
      "1 კონა ქინძი",
      "მარილი გემოვნებით",
      "ბროწეული გასაფორმებლად"
    ],
    steps: [
      "შეწვით ბადრიჯნები მთლიანად, შემდეგ გააცივეთ და გაათავისუფლეთ კანისგან.",
      "დაფქვით კაკალი ნიორთან და ქინძთან ერთად.",
      "შეურიეთ სანელებლები და მარილი კაკლის ნარევს.",
      "მოათავსეთ ბადრიჯნები ბრტყელ თეფშზე და გაუსწორეთ.",
      "წაუსვით ზედაპირს კაკლის ნარევი და მოაყარეთ ბროწეულის მარცვლები."
    ]
  },
  {
    id: 6,
    title: "შოთის პური",
    description: "ტრადიციული ქართული პური თონეში გამომცხვარი.",
    imageUrl: "https://media.istockphoto.com/id/968331250/photo/shoti-bread-georgian-puri-clay-oven-bread.jpg",
    category: "ხაჭაპური და პური",
    prepTime: 60,
    cookTime: 15,
    servings: 2,
    difficulty: "საშუალო",
    ingredients: [
      "600გრ ფქვილი",
      "350მლ თბილი წყალი",
      "7გრ საფუარი",
      "1 ჩ/კ მარილი",
      "1 ჩ/კ შაქარი",
      "2 ს/კ ზეითუნის ზეთი"
    ],
    steps: [
      "გახსენით საფუარი თბილ წყალში შაქართან ერთად.",
      "დაუმატეთ ფქვილი, მარილი და მოზილეთ ცომი.",
      "დაასვენეთ ცომი 1 საათის განმავლობაში.",
      "გააბრტყელეთ ცომი ტრადიციული ფორმით.",
      "გამოაცხვეთ მაღალ ტემპერატურაზე (250°C) 15 წუთი."
    ]
  }
];

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

  // ბაზიდან რეცეპტების მოთხოვნა
  useEffect(() => {
    async function fetchRecipes() {
      try {
        setIsLoading(true); // Set loading state to true
        setLoading(true);
        // ბაზიდან ჯერ მოვითხოვოთ რეცეპტები
        const response = await fetch("/api/georgian-recipes");

        if (!response.ok) {
          throw new Error("რეცეპტების მოთხოვნისას მოხდა შეცდომა");
        }

        const dbRecipes = await response.json();
        console.log("ბაზიდან მიღებული რეცეპტები:", dbRecipes);

        // გავაერთიანოთ ბაზიდან მიღებული რეცეპტები და სტატიკური
        setRecipes([...dbRecipes, ...GEORGIAN_RECIPES]);

      } catch (error) {
        console.error("რეცეპტების მოთხოვნის შეცდომა:", error);
        toast({
          title: "შეცდომა",
          description: "რეცეპტების ჩატვირთვა ვერ მოხერხდა. იყენება სტატიკური რეცეპტები.",
          variant: "destructive"
        });
        // შეცდომისას მხოლოდ სტატიკურ რეცეპტებს ვაჩვენებთ
        setRecipes(GEORGIAN_RECIPES);
      } finally {
        setLoading(false);
        setIsLoading(false); // Set loading state to false
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
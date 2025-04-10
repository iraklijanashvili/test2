import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/layout/SEO";
import { 
  Clock, ChefHat, ArrowLeft, Utensils, 
  CheckCircle2, ChevronRight, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export default function RecipeDetailPage() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>(GEORGIAN_RECIPES);
  const [activeTab, setActiveTab] = useState("ingredients");

  // ყველა რეცეპტის მოძიება ბაზიდან
  useEffect(() => {
    async function fetchAllRecipes() {
      try {
        const response = await fetch("/api/georgian-recipes");

        if (response.ok) {
          const dbRecipes = await response.json();
          console.log("ბაზიდან მიღებული რეცეპტები:", dbRecipes);

          // ბაზის და სტატიკური რეცეპტების გაერთიანება
          // გავფილტრავთ დუბლიკატებს ID-ის მიხედვით
          const staticIds = new Set(GEORGIAN_RECIPES.map(r => r.id));
          const uniqueDbRecipes = dbRecipes.filter((r: Recipe) => !staticIds.has(r.id));

          setAllRecipes([...uniqueDbRecipes, ...GEORGIAN_RECIPES]);
        }
      } catch (error) {
        console.error("რეცეპტების მოთხოვნისას მოხდა შეცდომა:", error);
      }
    }

    fetchAllRecipes();
  }, []);

  // რეცეპტის მოძებნა ID-ით ბაზიდან
  useEffect(() => {
    async function fetchRecipeById() {
      if (!params.id) return;

      try {
        const id = parseInt(params.id);

        // ჯერ ვცდილობთ ბაზიდან მიღებას
        const response = await fetch(`/api/georgian-recipes/${id}`);

        if (response.ok) {
          const dbRecipe = await response.json();
          console.log("ბაზიდან მიღებული რეცეპტი:", dbRecipe);
          setRecipe(dbRecipe);
          return;
        }

        // თუ ბაზიდან ვერ მივიღეთ, სტატიკურებში ვეძებთ
        const foundRecipe = GEORGIAN_RECIPES.find(r => r.id === id);
        setRecipe(foundRecipe || null);
      } catch (error) {
        console.error("რეცეპტის მოთხოვნისას მოხდა შეცდომა:", error);
        // შეცდომის შემთხვევაში სტატიკურებში ვეძებთ
        const id = parseInt(params.id);
        const foundRecipe = GEORGIAN_RECIPES.find(r => r.id === id);
        setRecipe(foundRecipe || null);
      }
    }

    fetchRecipeById();
  }, [params.id]);

  // უკან დაბრუნება
  const handleBack = () => {
    setLocation("/recipes");
  };

  // თუ რეცეპტი ვერ მოიძებნა
  if (!recipe) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <SEO 
          title="რეცეპტი ვერ მოიძებნა | მულტიფუნქციური აპლიკაცია"
          description="მითითებული რეცეპტი ვერ მოიძებნა ან წაშლილია."
          canonicalUrl={`/recipe/${params.id}`}
        />
        <Header />

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="mb-6 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              უკან დაბრუნება
            </Button>

            <div className="text-center p-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">რეცეპტი ვერ მოიძებნა</h2>
              <p className="text-gray-600 mb-6">მითითებული რეცეპტი არ არსებობს ან წაშლილია.</p>
              <Button onClick={handleBack}>
                დაბრუნდით რეცეპტების გვერდზე
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <SEO 
        title={`${recipe.title} | რეცეპტები | მულტიფუნქციური აპლიკაცია`}
        description={recipe.description}
        canonicalUrl={`/recipe/${recipe.id}`}
        ogType="article"
        ogImage={recipe.imageUrl}
        keywords={`ქართული რეცეპტები, ${recipe.title}, ${recipe.category}, ${recipe.ingredients && recipe.ingredients.slice(0, 3).map(i => i.split(' ')[0]).join(', ')}, კულინარია, სამზარეულო`}
      />
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            დაბრუნდით რეცეპტების გვერდზე
          </Button>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div 
              className="h-96 bg-cover bg-center relative" 
              style={{ backgroundImage: `url(${recipe.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge 
                    className="bg-white text-primary hover:bg-white/90" 
                    variant="secondary"
                  >
                    {recipe.category}
                  </Badge>
                  <Badge 
                    className="bg-white/20 text-white hover:bg-white/30 border-0" 
                    variant="outline"
                  >
                    {recipe.difficulty}
                  </Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold">{recipe.title}</h1>
                <p className="text-white/90 mt-2 text-lg max-w-3xl">{recipe.description}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">მომზადების დრო</div>
                    <div className="font-medium">{recipe.prepTime} წუთი</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Utensils className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">თერმული დამუშავება</div>
                    <div className="font-medium">{recipe.cookTime} წუთი</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <ChefHat className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">გამოცდილება</div>
                    <div className="font-medium">{recipe.difficulty}</div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ingredients">ინგრედიენტები</TabsTrigger>
                  <TabsTrigger value="steps">მომზადების პროცესი</TabsTrigger>
                </TabsList>

                <TabsContent value="ingredients" className="pt-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      რაც დაგჭირდებათ ({recipe.ingredients.length} ინგრედიენტი):
                    </h3>
                    <ul className="space-y-3">
                      {Array.isArray(recipe.ingredients) 
                        ? recipe.ingredients.map((ingredient, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <span>{typeof ingredient === 'object' ? ingredient.name : ingredient}</span>
                            </li>
                          ))
                        : recipe.ingredients && typeof recipe.ingredients === 'object' 
                          ? Object.entries(recipe.ingredients).map(([key, value], idx) => (
                              <li key={idx} className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                                <span>{`${value} ${key}`}</span>
                              </li>
                            ))
                          : null
                      }
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="steps" className="pt-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      მომზადების პროცესი ({recipe.steps.length} ნაბიჯი):
                    </h3>
                    <ol className="space-y-6">
                      {recipe.steps.map((step, idx) => (
                        <li key={idx} className="flex">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-medium mr-3">
                            {idx + 1}
                          </div>
                          <div className="pt-1">
                            <p className="text-gray-700">{step}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="my-8">
            <h3 className="text-xl font-semibold mb-4">მსგავსი რეცეპტები</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allRecipes.filter(r => 
                r.id !== recipe.id && r.category === recipe.category
              ).slice(0, 3).map(similarRecipe => (
                <div 
                  key={similarRecipe.id} 
                  className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md"
                  onClick={() => setLocation(`/recipe/${similarRecipe.id}`)}
                >
                  <div 
                    className="h-36 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${similarRecipe.imageUrl})` }}
                  ></div>
                  <div className="p-3">
                    <h4 className="font-medium text-gray-800 line-clamp-1">{similarRecipe.title}</h4>
                    <div className="flex justify-between items-center mt-1 text-sm">
                      <div className="text-primary text-xs">
                        {similarRecipe.category}
                      </div>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{similarRecipe.prepTime + similarRecipe.cookTime} წთ</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
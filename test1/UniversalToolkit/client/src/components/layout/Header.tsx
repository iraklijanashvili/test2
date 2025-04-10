import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Zap, Calculator, Clock, DollarSign, CloudSun, Newspaper, 
  BookOpen, ChefHat, Lightbulb, Menu, X, Home, ChevronDown, 
  ChevronRight, Grid3X3, Info, Library, Shield, Star
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// მენიუს ელემენტების ჩამონათვალი აიქონებით
const menuItems = [
  { title: "მთავარი", path: "/", icon: Home, category: "მთავარი" },
  { title: "კალკულატორი", path: "/calculator", icon: Calculator, category: "ფუნქციები" },
  { title: "ტაიმერი", path: "/timer", icon: Clock, category: "ფუნქციები" },
  { title: "ვალუტის კურსი", path: "/currency", icon: DollarSign, category: "ფუნქციები" },
  { title: "ამინდი", path: "/weather", icon: CloudSun, category: "ინფორმაცია" },
  { title: "სიახლეები", path: "/news", icon: Newspaper, category: "ინფორმაცია" },
  { title: "ჰოროსკოპი", path: "/horoscope", icon: Star, category: "ინფორმაცია" },
  { title: "ინსტრუქციები", path: "/tutorials", icon: BookOpen, category: "შინაარსი" },
  { title: "რეცეპტები", path: "/recipes", icon: ChefHat, category: "შინაარსი" },
  { title: "რჩევები", path: "/tips", icon: Lightbulb, category: "შინაარსი" },
  { title: "ადმინისტრირება", path: "/iraklijanashvili", icon: Shield, category: "ადმინისტრირება" }
];

// მენიუს კატეგორიები
const categories = [
  { 
    name: "ფუნქციები", 
    icon: Grid3X3,
    items: ["კალკულატორი", "ტაიმერი", "ვალუტის კურსი"] 
  },
  { 
    name: "ინფორმაცია", 
    icon: Info,
    items: ["ამინდი", "სიახლეები", "ჰოროსკოპი"] 
  },
  { 
    name: "შინაარსი", 
    icon: Library,
    items: ["ინსტრუქციები", "რეცეპტები", "რჩევები"] 
  }
];

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  const toggleCategory = (categoryName: string) => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryName);
    }
  };
  
  // იპოვე მენიუს ელემენტები კატეგორიის მიხედვით
  const getMenuItemsForCategory = (categoryName: string) => {
    return menuItems.filter(item => item.category === categoryName);
  };
  
  return (
    <header className="header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer hover:scale-105 transition-transform">
                <Zap className="h-7 w-7 text-white" />
                <h1 className="ml-2 text-xl font-bold text-white">მულტიფუნქციური</h1>
              </div>
            </Link>
          </div>
          
          {/* დესკტოპის ნავიგაცია - მოკლე ვერსია */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/">
              <div className={cn(
                "flex items-center px-3 py-2 rounded-md transition-colors",
                location === "/" 
                  ? "bg-white text-primary" 
                  : "text-white hover:bg-white/10"
              )}>
                <Home className="h-4 w-4 mr-1.5" />
                <span className="font-medium">მთავარი</span>
              </div>
            </Link>
            
            {/* ჩამოსაშლელი მენიუები კატეგორიებისთვის */}
            {categories.map((category, idx) => {
              const CategoryIcon = category.icon;
              return (
                <DropdownMenu key={idx}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="px-3 py-2 flex items-center gap-1.5 text-white hover:bg-white/10 hover:text-white">
                      <CategoryIcon className="h-4 w-4" />
                      <span>{category.name}</span>
                      <ChevronDown className="h-3 w-3 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 bg-white/95 backdrop-blur-sm border-none shadow-lg">
                    <DropdownMenuLabel className="font-bold text-primary">{category.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {getMenuItemsForCategory(category.name).map((item, itemIdx) => {
                      const ItemIcon = item.icon;
                      return (
                        <Link key={itemIdx} href={item.path}>
                          <DropdownMenuItem 
                            className={cn(
                              "cursor-pointer hover-up", 
                              location === item.path ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-50"
                            )}
                          >
                            <ItemIcon className="h-4 w-4 mr-2" />
                            <span>{item.title}</span>
                            {location === item.path && (
                              <Badge variant="secondary" className="ml-auto py-0 px-1.5 h-5 bg-primary/10 text-primary text-[10px]">
                                აქტიური
                              </Badge>
                            )}
                          </DropdownMenuItem>
                        </Link>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            })}
          </nav>
          
          {/* მობილური მენიუ */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 rounded-full text-white hover:bg-white/10 focus:outline-none">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 max-w-xs w-full">
              <div className="flex flex-col h-full bg-gradient-to-br from-primary/5 to-white">
                <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-primary to-secondary text-white">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center">
                      <Zap className="h-6 w-6 text-white" />
                      <span className="ml-2 font-semibold text-white">მულტიფუნქციური</span>
                    </div>
                  </Link>
                  <button 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="py-2 px-1.5 flex-1 overflow-auto">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <div className={cn(
                      "flex items-center p-3 rounded-lg mb-2 transition-all duration-200",
                      location === "/" 
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md" 
                        : "text-gray-800 hover:bg-gray-100"
                    )}>
                      <Home className="h-5 w-5 mr-2" />
                      <span className="font-medium">მთავარი</span>
                    </div>
                  </Link>

                  {/* კატეგორიების ჩვენება */}
                  {categories.map((category, categoryIndex) => {
                    const CategoryIcon = category.icon;
                    return (
                      <div key={categoryIndex} className="mb-1.5">
                        <button 
                          onClick={() => toggleCategory(category.name)}
                          className={cn(
                            "flex justify-between items-center w-full px-3 py-2.5 rounded-lg mb-1 transition-all duration-200",
                            expandedCategory === category.name
                              ? "bg-gray-100 shadow-sm"
                              : "hover:bg-gray-50"
                          )}
                        >
                          <div className="flex items-center">
                            <CategoryIcon className="h-5 w-5 text-primary mr-2" />
                            <span className="font-medium text-gray-800">{category.name}</span>
                          </div>
                          {expandedCategory === category.name ? 
                            <ChevronDown className="h-4 w-4 text-gray-500" /> : 
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          }
                        </button>
                        
                        {expandedCategory === category.name && (
                          <div className="ml-2 pl-2 border-l-2 border-primary/30 space-y-0.5 animate-in slide-in-from-left-1 duration-200">
                            {getMenuItemsForCategory(category.name).map((item, itemIndex) => {
                              const Icon = item.icon;
                              return (
                                <Link 
                                  key={itemIndex} 
                                  href={item.path}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  <div className={cn(
                                    "flex items-center p-2.5 rounded-lg transition-all duration-200",
                                    location === item.path 
                                      ? "bg-primary/10 text-primary font-medium shadow-sm" 
                                      : "text-gray-700 hover:bg-gray-100"
                                  )}>
                                    <Icon className="h-4.5 w-4.5 mr-2" />
                                    <span>{item.title}</span>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

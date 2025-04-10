import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/layout/SEO";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { ArrowRight, Calculator, Clock, RefreshCw, Cloud, Newspaper, Book, UtensilsCrossed, HeartHandshake, Star } from "lucide-react";

export default function Home() {
  const menuItems = [
    { 
      title: "კალკულატორი", 
      icon: <Calculator className="h-8 w-8 text-primary" />, 
      path: "/calculator", 
      description: "მარტივი მათემატიკური გამოთვლები",
      bgColor: "from-purple-50 to-indigo-50"
    },
    { 
      title: "ტაიმერი", 
      icon: <Clock className="h-8 w-8 text-primary" />, 
      path: "/timer", 
      description: "დროის კონტროლი",
      bgColor: "from-blue-50 to-cyan-50"
    },
    { 
      title: "ვალუტის კონვერტერი", 
      icon: <RefreshCw className="h-8 w-8 text-primary" />, 
      path: "/currency", 
      description: "ვალუტების კონვერტაცია",
      bgColor: "from-green-50 to-emerald-50"
    },
    { 
      title: "ამინდი", 
      icon: <Cloud className="h-8 w-8 text-primary" />, 
      path: "/weather", 
      description: "ამინდის პროგნოზი",
      bgColor: "from-sky-50 to-blue-50"
    },
    { 
      title: "სიახლეები", 
      icon: <Newspaper className="h-8 w-8 text-primary" />, 
      path: "/news", 
      description: "უახლესი ამბები",
      bgColor: "from-amber-50 to-yellow-50"
    },
    { 
      title: "ჰოროსკოპი", 
      icon: <Star className="h-8 w-8 text-primary" />, 
      path: "/horoscope", 
      description: "ზოდიაქოს ნიშნები",
      bgColor: "from-purple-50 to-pink-50"
    },
    { 
      title: "ინსტრუქციები", 
      icon: <Book className="h-8 w-8 text-primary" />, 
      path: "/tutorials", 
      description: "სასარგებლო სახელმძღვანელოები",
      bgColor: "from-violet-50 to-purple-50"
    },
    { 
      title: "რეცეპტები", 
      icon: <UtensilsCrossed className="h-8 w-8 text-primary" />, 
      path: "/recipes", 
      description: "გემრიელი კერძები",
      bgColor: "from-rose-50 to-pink-50"
    },
    { 
      title: "რჩევები", 
      icon: <HeartHandshake className="h-8 w-8 text-primary" />, 
      path: "/tips", 
      description: "დღის რჩევები",
      bgColor: "from-orange-50 to-amber-50"
    }
  ];

  return (
    <div className="page-container">
      <SEO 
        title="მთავარი - მულტიფუნქციური აპლიკაცია | ქართული ციფრული ინსტრუმენტები"
        description="მულტიფუნქციური აპლიკაცია ქართული ენით, რომელიც გთავაზობთ რეცეპტებს, სიახლეებს, ამინდის პროგნოზს, კალკულატორს და სხვა სასარგებლო ინსტრუმენტებს."
        canonicalUrl="/"
        keywords="ქართული აპლიკაცია, მულტიფუნქციური, რეცეპტები, სიახლეები, ამინდი, კალკულატორი, ტაიმერი, ვალუტის კურსი"
      />
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">მრავალფუნქციური აპლიკაცია</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            აირჩიეთ სასურველი ინსტრუმენტი ქვემოთ მოცემული ჩამონათვალიდან
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.path}>
                <Card className={`p-6 h-full flex flex-col hover-up shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${item.bgColor} border-none`}>
                  <div className="mb-4 bg-white p-3 rounded-full w-16 h-16 flex items-center justify-center shadow-md">
                    {item.icon}
                  </div>
                  <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                  <p className="text-gray-600 mb-4 flex-grow">{item.description}</p>
                  <div className="flex items-center text-primary font-medium mt-2">
                    <span>გახსნა</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </Card>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4 text-center">რატომ უნდა გამოიყენოთ ჩვენი აპლიკაცია?</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-lg mb-2">მარტივი ინტერფეისი</h3>
              <p className="text-gray-600">ინტუიციური და მომხმარებელზე ორიენტირებული დიზაინი, რომელიც ადვილად გამოსაყენებელია</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-lg mb-2">მრავალფეროვანი ფუნქციები</h3>
              <p className="text-gray-600">ერთ აპლიკაციაში თავმოყრილია ყველა საჭირო ინსტრუმენტი ყოველდღიური გამოყენებისთვის</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-lg mb-2">ქართული ინტერფეისი</h3>
              <p className="text-gray-600">სრულად ქართულენოვანი პლატფორმა, მორგებული ქართველი მომხმარებლის საჭიროებებზე</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

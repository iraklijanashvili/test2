import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/layout/SEO";
import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star, PanelTopClose } from "lucide-react";
import Horoscope from "@/components/content/Horoscope";

interface ZodiacSign {
  id: string;
  name: string;
  date: string;
  icon: string;
  color: string;
  description: string;
}

export default function HoroscopePage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const zodiacSigns: ZodiacSign[] = [
    {
      id: "ვერძი",
      name: "ვერძი",
      date: "21 მარტი - 20 აპრილი",
      icon: "♈",
      color: "text-red-500",
      description: "ენერგიული და თავდაჯერებული. ლიდერი და ინიციატივის მქონე."
    },
    {
      id: "კურო",
      name: "კურო",
      date: "21 აპრილი - 21 მაისი",
      icon: "♉",
      color: "text-green-600",
      description: "პრაქტიკული და საიმედო. მოთმინების და სიმტკიცის მქონე."
    },
    {
      id: "ტყუპები",
      name: "ტყუპები",
      date: "22 მაისი - 21 ივნისი",
      icon: "♊",
      color: "text-yellow-500",
      description: "ცნობისმოყვარე და ადაპტირებადი. კომუნიკაბელური და მოქნილი."
    },
    {
      id: "კირჩხიბი",
      name: "კირჩხიბი",
      date: "22 ივნისი - 22 ივლისი",
      icon: "♋",
      color: "text-blue-400",
      description: "ემოციური და ინტუიციური. მზრუნველი და დამცველი."
    },
    {
      id: "ლომი",
      name: "ლომი",
      date: "23 ივლისი - 22 აგვისტო",
      icon: "♌",
      color: "text-orange-500",
      description: "თავდაჯერებული და ამბიციური. შემოქმედებითი და გულუხვი."
    },
    {
      id: "ქალწული",
      name: "ქალწული",
      date: "23 აგვისტო - 22 სექტემბერი",
      icon: "♍",
      color: "text-emerald-600",
      description: "ანალიტიკური და პრაქტიკული. დეტალებზე ორიენტირებული."
    },
    {
      id: "სასწორი",
      name: "სასწორი",
      date: "23 სექტემბერი - 23 ოქტომბერი",
      icon: "♎",
      color: "text-pink-500",
      description: "დიპლომატიური და სამართლიანი. ჰარმონიის მოყვარული."
    },
    {
      id: "მორიელი",
      name: "მორიელი",
      date: "24 ოქტომბერი - 22 ნოემბერი",
      icon: "♏",
      color: "text-red-600",
      description: "ინტენსიური და პასიური. ძლიერი ინტუიციის მქონე."
    },
    {
      id: "მშვილდოსანი",
      name: "მშვილდოსანი",
      date: "23 ნოემბერი - 21 დეკემბერი",
      icon: "♐",
      color: "text-purple-500",
      description: "ოპტიმისტური და თავისუფლების მოყვარული. მოგზაური სულით."
    },
    {
      id: "თხის-რქა",
      name: "თხის რქა",
      date: "22 დეკემბერი - 20 იანვარი",
      icon: "♑",
      color: "text-gray-700",
      description: "დისციპლინირებული და პასუხისმგებლიანი. ამბიციური და მიზანდასახული."
    },
    {
      id: "მერწყული",
      name: "მერწყული",
      date: "21 იანვარი - 18 თებერვალი",
      icon: "♒",
      color: "text-blue-500",
      description: "ინოვაციური და დამოუკიდებელი. პროგრესული მოაზროვნე."
    },
    {
      id: "თევზები",
      name: "თევზები",
      date: "19 თებერვალი - 20 მარტი",
      icon: "♓",
      color: "text-indigo-500",
      description: "ინტუიციური და ემპათიური. შემოქმედებითი და მგრძნობიარე."
    }
  ];

  const filteredSigns = zodiacSigns.filter(sign => 
    sign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sign.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <SEO 
        title="ჰოროსკოპი | მულტიფუნქციური აპლიკაცია"
        description="ყოველდღიური ჰოროსკოპი ყველა ზოდიაქოს ნიშნისთვის. გაეცანით თქვენი ზოდიაქოს ნიშნის დახასიათებას და დღის პროგნოზს."
        canonicalUrl="/horoscope"
        ogType="website"
        keywords="ჰოროსკოპი, ზოდიაქო, ასტროლოგია, დღის პროგნოზი, ვერძი, კურო, ტყუპები, კირჩხიბი, ლომი, ქალწული"
      />
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">ჰოროსკოპი</h1>
        
        <div className="mb-8 max-w-xl">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="მოძებნეთ ზოდიაქოს ნიშანი..."
                className="w-full pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </form>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSigns.map((sign) => (
            <Link key={sign.id} href={`/horoscope/${sign.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`text-4xl ${sign.color} mb-3`}>{sign.icon}</div>
                    <h2 className="text-xl font-bold mb-1">{sign.name}</h2>
                    <p className="text-sm text-gray-500 mb-3">{sign.date}</p>
                    <p className="text-gray-600 text-sm">{sign.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/layout/SEO";
import Weather from "@/components/information/Weather";
import WeatherExtended from "@/components/information/WeatherExtended";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, PanelTopClose } from "lucide-react";

export default function WeatherPage() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <SEO 
        title="ამინდის პროგნოზი | მულტიფუნქციური აპლიკაცია"
        description="დეტალური ამინდის პროგნოზი საქართველოსა და მსოფლიოს ქალაქებისთვის. ყოველდღიური და საათობრივი პროგნოზი, ტემპერატურა, ნალექები და ქარი."
        canonicalUrl="/weather"
        ogType="website"
        keywords="ამინდის პროგნოზი, ტემპერატურა, ნალექები, ქარი, საქართველოს ამინდი, თბილისის ამინდი"
      />
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">ამინდი</h1>
        
        <Tabs defaultValue="extended" className="w-full">
          <TabsList className="grid grid-cols-2 w-[400px] mb-6">
            <TabsTrigger value="extended">
              <PanelTopClose className="mr-2 h-4 w-4" />
              დეტალური პროგნოზი
            </TabsTrigger>
            <TabsTrigger value="simple">
              <Cloud className="mr-2 h-4 w-4" />
              ქალაქების მიმოხილვა
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="extended" className="mt-0">
            <div className="bg-white rounded-lg shadow p-6">
              <WeatherExtended />
            </div>
          </TabsContent>
          
          <TabsContent value="simple" className="mt-0">
            <div className="max-w-xl mx-auto">
              <Weather />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
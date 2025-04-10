import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Search, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HoroscopeSign {
  id: number;
  name: string;
  date: string;
  description: string;
  category: string;
}

export default function Horoscope() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: horoscopes, isLoading, isError } = useQuery<HoroscopeSign[]>({
    queryKey: ["/api/horoscopes"],
  });
  
  const filteredHoroscopes = horoscopes?.filter(horoscope => 
    horoscope.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    horoscope.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    horoscope.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  const handleViewAll = () => {
    toast({
      title: "ფუნქცია მიუწვდომელია",
      description: "ყველა ჰოროსკოპის ნახვის ფუნქცია ამ დემოში არ არის ხელმისაწვდომი.",
    });
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-accent px-4 py-3 text-white">
        <h3 className="text-lg font-semibold">დღის ჰოროსკოპი</h3>
      </div>
      <CardContent className="p-4">
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
        
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : isError ? (
          <div className="text-center p-10 text-red-500">
            <p>ჰოროსკოპის ჩატვირთვა ვერ მოხერხდა</p>
          </div>
        ) : filteredHoroscopes && filteredHoroscopes.length > 0 ? (
          <div className="space-y-4">
            {filteredHoroscopes.map((horoscope) => (
              <div 
                key={horoscope.id} 
                className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => setLocation(`/horoscope/${horoscope.id}`)}
              >
                <div className="flex items-start">
                  <div className="bg-accent p-2 rounded-md text-white mr-3">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{horoscope.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{horoscope.description}</p>
                    <div className="mt-1 text-xs text-gray-500">
                      <span>{horoscope.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-4 text-center">
              <Button
                variant="link"
                className="text-accent hover:text-amber-600 font-medium text-sm"
                onClick={handleViewAll}
              >
                ყველა ჰოროსკოპის ნახვა
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center p-10 text-gray-500">
            <p>ჰოროსკოპი ვერ მოიძებნა</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
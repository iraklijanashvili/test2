import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Search, Info, Users, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tutorial } from "@shared/schema";

export default function Tutorials() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const { data: tutorials, isLoading, isError } = useQuery<Tutorial[]>({
    queryKey: ['/api/tutorials'],
  });
  
  const filteredTutorials = tutorials?.filter(tutorial => 
    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is done in real-time with the filteredTutorials variable
  };
  
  const handleViewAll = () => {
    toast({
      title: "Feature not available",
      description: "View all tutorials functionality is not implemented in this demo.",
    });
  };
  
  const getIconForCategory = (category: string) => {
    switch(category.toLowerCase()) {
      case 'ფინანსები':
        return <Info className="h-5 w-5" />;
      case 'პირადი განვითარება':
        return <Users className="h-5 w-5" />;
      case 'ტექნოლოგიები':
        return <Download className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-accent px-4 py-3 text-white">
        <h3 className="text-lg font-semibold">სასარგებლო ინსტრუქციები</h3>
      </div>
      <CardContent className="p-4">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="მოძებნეთ ინსტრუქციები..."
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
            <p>ინსტრუქციების ჩატვირთვა ვერ მოხერხდა</p>
          </div>
        ) : filteredTutorials && filteredTutorials.length > 0 ? (
          <div className="space-y-4">
            {filteredTutorials.map((tutorial) => (
              <div 
                key={tutorial.id} 
                className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-start">
                  <div className="bg-accent p-2 rounded-md text-white mr-3">
                    {getIconForCategory(tutorial.category)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{tutorial.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{tutorial.description}</p>
                    <div className="mt-1 text-xs text-gray-500">
                      <span>{tutorial.category}</span> • <span>{tutorial.readTime}</span>
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
                ყველა ინსტრუქციის ნახვა
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center p-10 text-gray-500">
            <p>ინსტრუქციები ვერ მოიძებნა</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

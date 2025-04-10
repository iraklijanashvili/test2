import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Search, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tip } from "@shared/schema";

export default function Tips() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const { data: tips, isLoading, isError } = useQuery<Tip[]>({
    queryKey: ['/api/tips'],
  });
  
  const filteredTips = tips?.filter(tip => 
    tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tip.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tip.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tipOfDay = tips?.find(tip => tip.isTipOfDay === 1);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  const handleViewAll = () => {
    toast({
      title: "Feature not available",
      description: "View all tips functionality is not implemented in this demo.",
    });
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-accent px-4 py-3 text-white">
        <h3 className="text-lg font-semibold">რჩევები და რეკომენდაციები</h3>
      </div>
      <CardContent className="p-4">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="მოძებნეთ რჩევები..."
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
            <p>რჩევების ჩატვირთვა ვერ მოხერხდა</p>
          </div>
        ) : (
          <>
            {tipOfDay && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                  <h4 className="font-medium text-amber-800">დღის რჩევა</h4>
                </div>
                <p className="text-amber-700">{tipOfDay.content}</p>
              </div>
            )}
            
            {filteredTips && filteredTips.length > 0 ? (
              <div className="space-y-4">
                {filteredTips.map((tip) => (
                  !tip.isTipOfDay && (
                    <div 
                      key={tip.id} 
                      className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex items-start">
                        <div className="bg-accent p-2 rounded-md text-white mr-3">
                          <Lightbulb className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{tip.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{tip.content}</p>
                          <div className="mt-1 text-xs text-gray-500">
                            <span>{tip.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ))}
                
                <div className="mt-4 text-center">
                  <Button
                    variant="link"
                    className="text-accent hover:text-amber-600 font-medium text-sm"
                    onClick={handleViewAll}
                  >
                    ყველა რჩევის ნახვა
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center p-10 text-gray-500">
                <p>რჩევები ვერ მოიძებნა</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

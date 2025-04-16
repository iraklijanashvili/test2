import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Search, Clock, Tag, ArrowUpRight, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export default function News() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 4;
  const { toast } = useToast();
  
  // სიახლეების მოთხოვნა მხოლოდ კომპონენტის პირველი რენდერისას
  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // ფილტრაცია და გვერდების დაყოფა
  const filteredNews = useMemo(() => {
    return news.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [news, searchQuery]);

  // დროის გამოთვლა
  const getTimeSince = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} წამის წინ`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} წუთის წინ`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} საათის წინ`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} დღის წინ`;
    
    return date.toLocaleDateString('ka-GE');
  };

  // მიიღე კატეგორია სტატიისთვის (მარტივი ლოგიკა დემონსტრაციისთვის)
  const getCategory = (article: NewsArticle): string => {
    const title = article.title.toLowerCase();
    
    if (title.includes("პოლიტიკ")) return "პოლიტიკა";
    if (title.includes("ეკონომიკ") || title.includes("ბიზნეს")) return "ეკონომიკა";
    if (title.includes("სპორტ")) return "სპორტი";
    if (title.includes("ტექნოლოგ")) return "ტექნოლოგია";
    
    return "სხვადასხვა";
  };

  // სიახლეების მოთხოვნა Supabase-დან
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Supabase-დან სიახლეების მოთხოვნა
      const { newsService } = await import('@/services/newsService');
      const result = await newsService.getAll();
      
      // სიახლეების ფორმატირება კომპონენტის ტიპებთან შესაბამისობაში
      const formattedNews = result.articles.map((article: any) => ({
        title: article.title,
        description: article.content,
        url: `/news/${article.id}`,
        urlToImage: article.image_url || 'https://placehold.co/600x400?text=News',
        publishedAt: article.created_at,
        source: {
          name: 'Supabase'
        }
      }));
      
      setNews(formattedNews);
    } catch (error) {
      console.error("Failed to fetch news:", error);
      setError("სიახლეების ჩატვირთვა ვერ მოხერხდა");
      toast({
        title: "შეცდომა",
        description: "სიახლეების ჩატვირთვა ვერ მოხერხდა",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // გამოსაჩენი სიახლეების გამოთვლა
  const displayedNews = filteredNews.slice(0, currentPage * newsPerPage);
  const hasMorePages = displayedNews.length < filteredNews.length;

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
            <div className="md:flex">
              <div className="md:shrink-0 bg-gray-200 h-48 md:h-full md:w-48"></div>
              <div className="p-5 w-full">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
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
          onClick={fetchNews} 
          className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded"
        >
          სცადეთ ხელახლა
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      <form onSubmit={handleSearch} className="bg-translucent rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="მოძებნეთ სიახლეები..."
            className="input flex-grow"
          />
          <button type="submit" className="btn md:w-auto">
            ძებნა
          </button>
        </div>
      </form>

      {filteredNews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl shadow-inner">
          <div className="text-7xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">სიახლეები ვერ მოიძებნა</h3>
          <p className="text-gray-500 mb-4">სცადეთ სხვა საძიებო სიტყვები ან შემოწმეთ მოგვიანებით</p>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')} 
              className="btn-outline"
            >
              ძიების გასუფთავება
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6">
            {displayedNews.map((article, index) => (
              <div 
                key={index}
                className="news-card overflow-hidden hover-up transition-transform duration-300"
              >
                <div className="md:flex h-full">
                  <div className="md:shrink-0 md:w-1/3 h-60 md:h-auto relative">
                    <img
                      src={article.urlToImage || "https://placehold.co/600x400?text=News"}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-0 left-0 m-3">
                      <span className="bg-primary text-white text-xs font-medium px-2.5 py-1 rounded shadow-md">
                        {getCategory(article)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 md:w-2/3 flex flex-col">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">{article.source?.name}</span>
                        <span className="text-xs text-gray-400">{getTimeSince(article.publishedAt)}</span>
                      </div>
                      <h2 className="title text-xl md:text-2xl font-bold mb-3 line-clamp-2">{article.title}</h2>
                      <p className="paragraph mb-4 line-clamp-3">{article.description}</p>
                    </div>
                    <div className="mt-auto">
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn inline-flex items-center"
                      >
                        სრულად ნახვა
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMorePages && (
            <div className="text-center mt-8">
              <button 
                onClick={handleLoadMore} 
                className="btn-secondary"
              >
                მეტის ჩატვირთვა
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
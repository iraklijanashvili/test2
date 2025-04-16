import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, User } from "lucide-react";
import SEO from "@/components/layout/SEO";

interface NewsArticle {
  id: number;
  title: string;
  description: string;
  content: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
  videoUrl?: string;
}

export default function NewsDetailPage() {
  const [, params] = useRoute("/news/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params?.id) {
      fetchArticle(params.id);
    }
  }, [params?.id]);

  const fetchArticle = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/news/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
      setError("სიახლის ჩატვირთვა ვერ მოხერხდა");
      toast({
        title: "შეცდომა",
        description: "სიახლის ჩატვირთვა ვერ მოხერხდა",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // დროის ფორმატირება
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ka-GE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/news")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            უკან დაბრუნება
          </Button>
          
          <Card className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">შეცდომა</h2>
            <p className="text-gray-600">{error || "სიახლე ვერ მოიძებნა"}</p>
            <Button 
              onClick={() => navigate("/news")} 
              className="mt-4"
            >
              სიახლეების გვერდზე დაბრუნება
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <SEO 
        title={`${article.title} | უნივერსალური ხელსაწყოები`}
        description={article.description}
        ogType="article"
        keywords="სიახლეები, ახალი ამბები, ინფორმაცია"
      />
      <Header />
      
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/news")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          უკან დაბრუნება
        </Button>
        
        <article className="bg-white rounded-xl shadow-md overflow-hidden">
          {article.urlToImage && (
            <div className="relative h-64 sm:h-80 md:h-96 w-full">
              <img 
                src={article.urlToImage} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(article.publishedAt)}
              </div>
              
              {article.source?.name && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {article.source.name}
                </div>
              )}
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg font-medium text-gray-700 mb-6">
                {article.description}
              </p>
              
              <div className="text-gray-700 whitespace-pre-line">
                {article.content}
              </div>
              
              {article.videoUrl && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">ვიდეო</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe 
                      src={article.videoUrl} 
                      title="Video" 
                      allowFullScreen 
                      className="w-full h-full rounded-lg"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
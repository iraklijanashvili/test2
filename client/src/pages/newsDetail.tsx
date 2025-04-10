import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/layout/SEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewsDetailPage() {
  const [, params] = useRoute("/news/:id");
  const [, setLocation] = useLocation();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/news/${params?.id}`);
        if (response.ok) {
          const data = await response.json();
          setArticle(data);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    if (params?.id) {
      fetchArticle();
    }
  }, [params?.id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-100">
        <SEO 
          title="სიახლე იტვირთება | მულტიფუნქციური აპლიკაცია"
          description="სიახლის ჩატვირთვა მიმდინარეობს..."
          canonicalUrl={`/news/${params?.id}`}
        />
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/news")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            უკან დაბრუნება
          </Button>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SEO 
        title={`${article.title} | სიახლეები | მულტიფუნქციური აპლიკაცია`}
        description={article.description || "წაიკითხეთ სრული სტატია სიახლის შესახებ"}
        canonicalUrl={`/news/${params?.id}`}
        ogType="article"
        ogImage={article.urlToImage}
        keywords={`სიახლეები, ახალი ამბები, ${article.title}`}
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/news")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          უკან დაბრუნება
        </Button>

        <article className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <img 
            src={article.urlToImage} 
            alt={article.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">{article.description}</p>
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

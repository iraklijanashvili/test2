import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Pencil, Trash2, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import SEO from "@/components/layout/SEO";

interface NewsArticle {
  id: number;
  title: string;
  description: string;
  content: string;
  publishedAt: string;
  source: { name: string };
}

export default function NewsManagerPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      // Supabase-ის გამოყენება სიახლეების მისაღებად
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "შეცდომა",
        description: "სიახლეების ჩატვირთვა ვერ მოხერხდა",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (article: NewsArticle) => {
    try {
      // შევამოწმოთ არის თუ არა ეს ახალი სტატია ან არსებულის რედაქტირება
      const isEditing = article.id > 0;
      
      // შევამოწმოთ აუცილებელი ველები
      if (!article.title.trim()) {
        toast({
          title: "შეცდომა",
          description: "სათაური არ უნდა იყოს ცარიელი",
          variant: "destructive",
        });
        return;
      }

      if (!article.content.trim()) {
        toast({
          title: "შეცდომა",
          description: "შინაარსი არ უნდა იყოს ცარიელი",
          variant: "destructive",
        });
        return;
      }
      
      // Supabase-ის გამოყენება სიახლის შესანახად
      let error;
      
      if (isEditing) {
        // არსებული სიახლის განახლება
        const { error: updateError } = await supabase
          .from('news')
          .update({
            title: article.title,
            content: article.content,
            description: article.description,
            updated_at: new Date().toISOString()
          })
          .eq('id', article.id);
          
        error = updateError;
      } else {
        // ახალი სიახლის დამატება
        const { error: insertError } = await supabase
          .from('news')
          .insert({
            title: article.title,
            content: article.content,
            description: article.description,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        error = insertError;
      }

      if (!error) {
        toast({
          title: "წარმატება",
          description: `სიახლე ${isEditing ? 'განახლდა' : 'დაემატა'} წარმატებით`,
        });
        setEditingArticle(null);
        fetchNews();
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error saving news article:', error);
      toast({
        title: "შეცდომა",
        description: `სიახლის შენახვა ვერ მოხერხდა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('ნამდვილად გსურთ სიახლის წაშლა?')) return;

    try {
      // Supabase-ის გამოყენება სიახლის წასაშლელად
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (!error) {
        toast({
          title: "წარმატება",
          description: "სიახლე წაიშალა წარმატებით",
        });
        fetchNews();
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      toast({
        title: "შეცდომა",
        description: "სიახლის წაშლა ვერ მოხერხდა",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <SEO 
        title="სიახლეების მართვა | უნივერსალური ხელსაწყოები"
        description="სიახლეების მართვის პანელი"
        ogType="website"
        keywords="სიახლეები, მართვა, ადმინისტრირება"
      />
      <Header />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">სიახლეების მართვა</h1>
          <Button onClick={() => setEditingArticle({
            id: 0,
            title: '',
            description: '',
            content: '',
            publishedAt: new Date().toISOString(),
            source: { name: 'საქართველოს ახალი ამბები' }
          })}>
            <Plus className="h-4 w-4 mr-2" />
            ახალი სიახლე
          </Button>
        </div>

        {editingArticle && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingArticle.id ? 'სიახლის რედაქტირება' : 'ახალი სიახლე'}
            </h2>
            <div className="space-y-4">
              <Input
                placeholder="სათაური"
                value={editingArticle.title}
                onChange={(e) => setEditingArticle({...editingArticle, title: e.target.value})}
              />
              <Textarea
                placeholder="მოკლე აღწერა"
                value={editingArticle.description}
                onChange={(e) => setEditingArticle({...editingArticle, description: e.target.value})}
              />
              <Textarea
                placeholder="სრული ტექსტი"
                value={editingArticle.content}
                onChange={(e) => setEditingArticle({...editingArticle, content: e.target.value})}
              />
              <div className="flex gap-2">
                <Button onClick={() => handleSave(editingArticle)}>შენახვა</Button>
                <Button variant="outline" onClick={() => setEditingArticle(null)}>გაუქმება</Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {news.map((article) => (
            <Card key={article.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{article.title}</h3>
                  <p className="text-gray-600 mt-2">{article.description}</p>
                  <div className="text-sm text-gray-500 mt-2">
                    {new Date(article.publishedAt).toLocaleDateString('ka-GE')}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingArticle(article)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    რედაქტირება
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(article.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    წაშლა
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

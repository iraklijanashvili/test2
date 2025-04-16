import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import SEO from "@/components/layout/SEO";
import { recipeService, tipService, tutorialService } from '@/services/supabaseService';

type Recipe = {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
};

type News = {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
};

export function AdminPanel() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'recipes' | 'news' | 'tutorials' | 'tips'>('recipes');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // მონაცემების ჩატვირთვა
  useEffect(() => {
    if (!location.startsWith('/iraklijanashvili')) {
      setLocation('/iraklijanashvili');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        if (activeTab === 'recipes') {
          try {
            const data = await recipeService.getAll();
            setRecipes(data);
          } catch (error) {
            console.error('რეცეპტების ჩატვირთვის შეცდომა:', error);
            throw new Error('რეცეპტების ჩატვირთვის შეცდომა');
          }
        } else if (activeTab === 'news') {
          const response = await fetch('/iraklijanashvili/news');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (!Array.isArray(data)) {
            throw new Error('მიღებული მონაცემები არ არის მასივის ფორმატში');
          }
          setNews(data);
        } else if (activeTab === 'tutorials') {
          try {
            const data = await tutorialService.getAll();
            setTutorials(data);
          } catch (error) {
            console.error('ინსტრუქციების ჩატვირთვის შეცდომა:', error);
            throw new Error('ინსტრუქციების ჩატვირთვის შეცდომა');
          }
        } else if (activeTab === 'tips') {
          try {
            const data = await tipService.getAll();
            setTips(data);
          } catch (error) {
            console.error('რჩევების ჩატვირთვის შეცდომა:', error);
            throw new Error('რჩევების ჩატვირთვის შეცდომა');
          }
        }
      } catch (err) {
        console.error('მონაცემების ჩატვირთვის შეცდომა:', err);
        setError(err instanceof Error ? err.message : 'მონაცემების ჩატვირთვის შეცდომა');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, location]);

  // წაშლის ფუნქცია
  const handleDelete = async (id: number, type: 'recipe' | 'news' | 'tutorial' | 'tip') => {
    if (!confirm('ნამდვილად გსურთ წაშლა?')) return;

    try {
      if (type === 'recipe') {
        await recipeService.delete(id);
        setRecipes(recipes.filter(r => r.id !== id));
      } else if (type === 'news') {
        // სიახლეების წაშლა API-ის გამოყენებით, სანამ Supabase-ში დაემატება
        const response = await fetch(`/iraklijanashvili/news/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setNews(news.filter(n => n.id !== id));
        } else {
          throw new Error('სიახლის წაშლის შეცდომა');
        }
      } else if (type === 'tutorial') {
        await tutorialService.delete(id);
        setTutorials(tutorials.filter(t => t.id !== id));
      } else {
        await tipService.delete(id);
        setTips(tips.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error('წაშლის შეცდომა:', err);
      setError('წაშლის შეცდომა');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title="ადმინისტრატორის პანელი | უნივერსალური ხელსაწყოები"
        description="კონტენტის მართვის პანელი, SEO ოპტიმიზირებული რეცეპტებისა და სიახლეების სამართავად."
        ogType="website"
        keywords="ადმინისტრირება, კონტენტის მართვა, სიახლეები, რეცეპტები"
      />
      <h1 className="text-3xl font-bold mb-8">ადმინისტრატორის პანელი</h1>

      {/* ტაბები */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'recipes' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('recipes')}
        >
          რეცეპტები
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'news' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('news')}
        >
          სიახლეები
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'tutorials' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('tutorials')}
        >
          ინსტრუქციები
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'tips' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('tips')}
        >
          რჩევები
        </button>
      </div>

      {/* შეცდომის შეტყობინება */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* ჩატვირთვის ინდიკატორი */}
      {loading ? (
        <div className="text-center py-8">იტვირთება...</div>
      ) : (
        <div className="grid gap-4">
          {/* დამატების ღილაკი */}
          <button
            className="bg-green-500 text-white px-4 py-2 rounded w-fit"
            onClick={() => setLocation(`/iraklijanashvili/${activeTab === 'recipes' ? 'recipe' : activeTab === 'news' ? 'news' : activeTab === 'tutorials' ? 'tutorial' : 'tip'}/new`)}
          >
            {activeTab === 'recipes' ? 'ახალი რეცეპტი' : activeTab === 'news' ? 'ახალი სიახლე' : activeTab === 'tutorials' ? 'ახალი ინსტრუქცია' : 'ახალი რჩევა'}
          </button>

          {/* მონაცემების ცხრილი */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    სათაური
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    აღწერა
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    მოქმედებები
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activeTab === 'recipes' ? (
                  recipes.map(recipe => (
                    <tr key={recipe.id}>
                      <td className="px-6 py-4">{recipe.title}</td>
                      <td className="px-6 py-4">{recipe.description}</td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => setLocation(`/iraklijanashvili/recipe/${recipe.id}`)}
                        >
                          რედაქტირება
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(recipe.id, 'recipe')}
                        >
                          წაშლა
                        </button>
                      </td>
                    </tr>
                  ))
                ) : activeTab === 'news' ? (
                  news.map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">{item.title}</td>
                      <td className="px-6 py-4">{item.content}</td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => setLocation(`/iraklijanashvili/news/${item.id}`)}
                        >
                          რედაქტირება
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(item.id, 'news')}
                        >
                          წაშლა
                        </button>
                      </td>
                    </tr>
                  ))
                ) : activeTab === 'tutorials' ? (
                  tutorials.map(tutorial => (
                    <tr key={tutorial.id}>
                      <td className="px-6 py-4">{tutorial.title}</td>
                      <td className="px-6 py-4">{tutorial.content}</td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => setLocation(`/iraklijanashvili/tutorial/${tutorial.id}`)}
                        >
                          რედაქტირება
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(tutorial.id, 'tutorial')}
                        >
                          წაშლა
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  tips.map(tip => (
                    <tr key={tip.id}>
                      <td className="px-6 py-4">{tip.title}</td>
                      <td className="px-6 py-4">{tip.content}</td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => setLocation(`/iraklijanashvili/tip/${tip.id}`)}
                        >
                          რედაქტირება
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(tip.id, 'tip')}
                        >
                          წაშლა
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
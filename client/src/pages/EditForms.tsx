import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import SEO from "@/components/layout/SEO";

type RecipeForm = {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  imageUrl: string;
  ingredients: Array<{
    name: string;
    amount: string;
    unit: string;
  }>;
  steps: Array<{
    stepNumber: number;
    instruction: string;
  }>;
};

type NewsForm = {
  title: string;
  content: string;
  imageUrl: string;
  videoUrl: string;
};

const emptyRecipe: RecipeForm = {
  title: '',
  description: '',
  category: '',
  difficulty: 'საშუალო',
  prepTime: 30,
  cookTime: 30,
  servings: 4,
  imageUrl: '',
  ingredients: [{ name: '', amount: '', unit: '' }],
  steps: [{ stepNumber: 1, instruction: '' }]
};

const emptyNews: NewsForm = {
  title: '',
  content: '',
  imageUrl: '',
  videoUrl: ''
};

export function RecipeForm() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/iraklijanashvili/recipe/:id');
  const id = params?.id;
  const isNew = id === 'new';

  const [form, setForm] = useState<RecipeForm>(emptyRecipe);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/iraklijanashvili/recipes/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // ფორმის ველების ინიციალიზაცია
      setForm({
        title: data.title || '',
        description: data.description || '',
        category: data.category || '',
        difficulty: data.difficulty || 'საშუალო',
        prepTime: data.prepTime || 30,
        cookTime: data.cookTime || 30,
        servings: data.servings || 4,
        imageUrl: data.imageUrl || '',
        ingredients: data.ingredients?.length > 0 
          ? data.ingredients 
          : [{ name: '', amount: '', unit: '' }],
        steps: data.steps?.length > 0 
          ? data.steps 
          : [{ stepNumber: 1, instruction: '' }]
      });
    } catch (err) {
      console.error('Error fetching recipe:', err);
      setError('რეცეპტის ჩატვირთვის შეცდომა');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      
      // შევამოწმოთ საჭირო ველები
      if (!form.title || !form.description || !form.category) {
        setError('გთხოვთ შეავსოთ ყველა აუცილებელი ველი');
        return;
      }
      
      // ინგრედიენტებისა და ნაბიჯების ფორმატირება სერვერისთვის
      const formattedIngredients = form.ingredients.map(ing => ({
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit
      }));
      
      const formattedSteps = form.steps.map(step => ({
        stepNumber: step.stepNumber,
        instruction: step.instruction
      }));
      
      // მონაცემების მომზადება
      const recipeData = {
        recipe: {
          title: form.title,
          description: form.description,
          imageUrl: form.imageUrl,
          category: form.category,
          prepTime: form.prepTime,
          cookTime: form.cookTime,
          servings: form.servings,
          difficulty: form.difficulty
        },
        ingredients: formattedIngredients,
        steps: formattedSteps
      };
      
      const url = isNew ? `/api/georgian-recipes` : `/api/georgian-recipes/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setLocation('/iraklijanashvili');
    } catch (err) {
      console.error('Error saving recipe:', err);
      setError(`შენახვის შეცდომა: ${err instanceof Error ? err.message : 'უცნობი შეცდომა'}`);
    }
  };

  const addIngredient = () => {
    setForm({
      ...form,
      ingredients: [...form.ingredients, { name: '', amount: '', unit: '' }]
    });
  };

  const removeIngredient = (index: number) => {
    if (form.ingredients.length <= 1) return;
    
    setForm({
      ...form,
      ingredients: form.ingredients.filter((_, i) => i !== index)
    });
  };

  const addStep = () => {
    setForm({
      ...form,
      steps: [
        ...form.steps, 
        { stepNumber: form.steps.length + 1, instruction: '' }
      ]
    });
  };

  const removeStep = (index: number) => {
    if (form.steps.length <= 1) return;
    
    const newSteps = form.steps.filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, stepNumber: i + 1 }));
    
    setForm({ ...form, steps: newSteps });
  };

  if (loading) return <div className="text-center py-8">იტვირთება...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title={isNew ? 'ახალი რეცეპტის დამატება | ადმინისტრირება' : `${form.title} - რედაქტირება | ადმინისტრირება`}
        description={form.description || "ქართული რეცეპტების მართვის პანელი, SEO ოპტიმიზირებული რეცეპტების დამატება და რედაქტირება."}
        ogType="website"
        ogImage={form.imageUrl || "/og-image.jpg"}
        keywords={`ქართული რეცეპტები, ${form.title || 'ახალი რეცეპტი'}, ${form.category || 'კულინარია'}, ადმინისტრირება, რეცეპტების მართვა`}
      />
      <h1 className="text-3xl font-bold mb-8">
        {isNew ? 'ახალი რეცეპტი' : 'რეცეპტის რედაქტირება'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">სათაური</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">აღწერა</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full p-2 border rounded"
            required
            rows={4}
          />
        </div>

        <div>
          <label className="block mb-2">სურათის URL</label>
          <input
            type="text"
            value={form.imageUrl}
            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">კატეგორია</label>
            <input
              type="text"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">სირთულე</label>
            <select
              value={form.difficulty}
              onChange={e => setForm({ ...form, difficulty: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="მარტივი">მარტივი</option>
              <option value="საშუალო">საშუალო</option>
              <option value="რთული">რთული</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">მომზადების დრო (წთ)</label>
            <input
              type="number"
              value={form.prepTime}
              onChange={e => setForm({ ...form, prepTime: parseInt(e.target.value) })}
              className="w-full p-2 border rounded"
              required
              min="1"
            />
          </div>
          <div>
            <label className="block mb-2">მომზადების დრო (წთ)</label>
            <input
              type="number"
              value={form.cookTime}
              onChange={e => setForm({ ...form, cookTime: parseInt(e.target.value) })}
              className="w-full p-2 border rounded"
              required
              min="1"
            />
          </div>
          <div>
            <label className="block mb-2">პორციები</label>
            <input
              type="number"
              value={form.servings}
              onChange={e => setForm({ ...form, servings: parseInt(e.target.value) })}
              className="w-full p-2 border rounded"
              required
              min="1"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium">ინგრედიენტები</label>
            <button
              type="button"
              onClick={addIngredient}
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
            >
              + დამატება
            </button>
          </div>
          
          {form.ingredients.map((ingredient, index) => (
            <div key={index} className="grid grid-cols-10 gap-2 mb-2">
              <div className="col-span-4">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={e => {
                    const newIngredients = [...form.ingredients];
                    newIngredients[index].name = e.target.value;
                    setForm({ ...form, ingredients: newIngredients });
                  }}
                  placeholder="დასახელება"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  value={ingredient.amount}
                  onChange={e => {
                    const newIngredients = [...form.ingredients];
                    newIngredients[index].amount = e.target.value;
                    setForm({ ...form, ingredients: newIngredients });
                  }}
                  placeholder="რაოდენობა"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  value={ingredient.unit}
                  onChange={e => {
                    const newIngredients = [...form.ingredients];
                    newIngredients[index].unit = e.target.value;
                    setForm({ ...form, ingredients: newIngredients });
                  }}
                  placeholder="ერთეული"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="col-span-1 flex items-center">
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-red-500"
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium">მომზადების ნაბიჯები</label>
            <button
              type="button"
              onClick={addStep}
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
            >
              + დამატება
            </button>
          </div>
          
          {form.steps.map((step, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-1 flex items-center justify-center">
                <span className="font-bold">{step.stepNumber}.</span>
              </div>
              <div className="col-span-10">
                <textarea
                  value={step.instruction}
                  onChange={e => {
                    const newSteps = [...form.steps];
                    newSteps[index].instruction = e.target.value;
                    setForm({ ...form, steps: newSteps });
                  }}
                  placeholder="ინსტრუქცია"
                  className="w-full p-2 border rounded"
                  required
                  rows={2}
                />
              </div>
              <div className="col-span-1 flex items-center">
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-red-500"
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            შენახვა
          </button>
          <button
            type="button"
            onClick={() => setLocation('/iraklijanashvili')}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            გაუქმება
          </button>
        </div>
      </form>
    </div>
  );
}

export function NewsForm() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/iraklijanashvili/news/:id');
  const id = params?.id;
  const isNew = id === 'new';

  const [form, setForm] = useState<NewsForm>(emptyNews);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetchNews();
    }
  }, [id]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/iraklijanashvili/news/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setForm({
        title: data.title || '',
        content: data.content || '',
        imageUrl: data.imageUrl || '',
        videoUrl: data.videoUrl || ''
      });
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('სიახლის ჩატვირთვის შეცდომა');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      const url = isNew ? `/api/news` : `/api/news/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setLocation('/iraklijanashvili');
    } catch (err) {
      console.error('Error saving news:', err);
      setError(`შენახვის შეცდომა: ${err instanceof Error ? err.message : 'უცნობი შეცდომა'}`);
    }
  };

  if (loading) return <div className="text-center py-8">იტვირთება...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title={isNew ? 'ახალი სიახლის დამატება | ადმინისტრირება' : `${form.title} - რედაქტირება | ადმინისტრირება`}
        description="სიახლეების მართვის პანელი, SEO ოპტიმიზირებული სიახლეების დამატება და რედაქტირება."
        ogType="website"
        keywords="სიახლეები, ახალი ამბები, ადმინისტრირება, კონტენტის მართვა"
      />
      <h1 className="text-3xl font-bold mb-8">
        {isNew ? 'ახალი სიახლე' : 'სიახლის რედაქტირება'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">სათაური</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">შინაარსი</label>
          <textarea
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            className="w-full p-2 border rounded"
            required
            rows={8}
          />
        </div>

        <div>
          <label className="block mb-2">სურათის URL</label>
          <input
            type="text"
            value={form.imageUrl}
            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block mb-2">ვიდეოს URL</label>
          <input
            type="text"
            value={form.videoUrl}
            onChange={e => setForm({ ...form, videoUrl: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            შენახვა
          </button>
          <button
            type="button"
            onClick={() => setLocation('/iraklijanashvili')}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            გაუქმება
          </button>
        </div>
      </form>
    </div>
  );
}
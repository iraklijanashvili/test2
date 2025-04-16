import { Request, Response, NextFunction } from 'express';
import { 
  db, createGeorgianRecipeWithDetails, updateGeorgianRecipeWithDetails, 
  deleteGeorgianRecipe, getAllGeorgianRecipes, getGeorgianRecipeById,
  getAllNews, getNewsById, createNews, updateNews, deleteNews,
  getAllTips, getTipById, createTip, updateTip, deleteTip,
  getAllTutorials, getTutorialById, createTutorial, updateTutorial, deleteTutorial
} from './db';
import { recipes as georgianRecipes, ingredients as recipeIngredients, steps as recipeSteps, news, tips, tutorials } from '@shared/schema';
import { eq } from 'drizzle-orm';

// ადმინისტრატორის ავტორიზაციის მიდლვეარი - გაუქმებულია ყველას აქვს წვდომა
const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  // წვდომა გახსნილია ყველასთვის
  next();
};

// ადმინისტრატორის მარშრუტების რეგისტრაცია
export function registerAdminRoutes(app: any) {
  // ადმინისტრატორის მარშრუტები
  app.use('/iraklijanashvili', adminAuth);

  // რეცეპტების მართვა
  app.get('/iraklijanashvili/recipes', async (_req: Request, res: Response) => {
    try {
      const recipes = await getAllGeorgianRecipes();
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: 'შეცდომა რეცეპტების მიღებისას' });
    }
  });
  
  app.get('/iraklijanashvili/recipes/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const recipe = await getGeorgianRecipeById(id);
      
      if (!recipe) {
        return res.status(404).json({ message: 'რეცეპტი ვერ მოიძებნა' });
      }
      
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: 'შეცდომა რეცეპტის მიღებისას' });
    }
  });

  app.post('/iraklijanashvili/recipes', async (req: Request, res: Response) => {
    try {
      const { title, description, category, difficulty, prepTime, cookTime, servings, imageUrl, ingredients, steps } = req.body;
      
      const recipe = {
        title,
        description,
        category,
        difficulty,
        prepTime,
        cookTime,
        servings,
        imageUrl: imageUrl || ""
      };
      
      const newRecipe = await createGeorgianRecipeWithDetails(recipe, ingredients, steps);
      res.status(201).json(newRecipe);
    } catch (error) {
      console.error('Error creating recipe:', error);
      res.status(500).json({ message: 'შეცდომა რეცეპტის დამატებისას' });
    }
  });

  app.put('/iraklijanashvili/recipes/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { title, description, category, difficulty, prepTime, cookTime, servings, imageUrl, ingredients, steps } = req.body;
      
      const recipe = {
        title,
        description,
        category,
        difficulty,
        prepTime,
        cookTime,
        servings,
        imageUrl: imageUrl || ""
      };

      const updatedRecipe = await updateGeorgianRecipeWithDetails(id, recipe, ingredients, steps);
      
      if (!updatedRecipe) {
        return res.status(404).json({ message: 'რეცეპტი ვერ მოიძებნა' });
      }
      
      res.json(updatedRecipe);
    } catch (error) {
      console.error('Error updating recipe:', error);
      res.status(500).json({ message: 'შეცდომა რეცეპტის განახლებისას' });
    }
  });

  app.delete('/iraklijanashvili/recipes/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await deleteGeorgianRecipe(id);
      res.json({ message: 'რეცეპტი წაშლილია' });
    } catch (error) {
      res.status(500).json({ message: 'შეცდომა რეცეპტის წაშლისას' });
    }
  });

  // ინსტრუქციების მართვა
  app.get('/iraklijanashvili/tutorials', async (_req: Request, res: Response) => {
    try {
      const allTutorials = await getAllTutorials();
      res.json(allTutorials);
    } catch (error) {
      res.status(500).json({ message: 'შეცდომა ინსტრუქციების მიღებისას' });
    }
  });
  
  app.get('/iraklijanashvili/tutorials/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const tutorial = await getTutorialById(id);
      
      if (!tutorial) {
        return res.status(404).json({ message: 'ინსტრუქცია ვერ მოიძებნა' });
      }
      
      res.json(tutorial);
    } catch (error) {
      res.status(500).json({ message: 'შეცდომა ინსტრუქციის მიღებისას' });
    }
  });

  app.post('/iraklijanashvili/tutorials', async (req: Request, res: Response) => {
    try {
      const { title, content, category, imageUrl, readTime } = req.body;
      
      const tutorialData = {
        title,
        content,
        category,
        imageUrl: imageUrl || "",
        readTime
      };
      
      const newTutorial = await createTutorial(tutorialData);
      res.status(201).json(newTutorial);
    } catch (error) {
      console.error('Error creating tutorial:', error);
      res.status(500).json({ message: 'შეცდომა ინსტრუქციის დამატებისას' });
    }
  });

  app.put('/iraklijanashvili/tutorials/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { title, content, category, imageUrl, readTime } = req.body;
      
      const tutorialData = {
        title,
        content,
        category,
        imageUrl: imageUrl || "",
        readTime
      };

      const updatedTutorial = await updateTutorial(id, tutorialData);
      
      if (!updatedTutorial) {
        return res.status(404).json({ message: 'ინსტრუქცია ვერ მოიძებნა' });
      }
      
      res.json(updatedTutorial);
    } catch (error) {
      console.error('Error updating tutorial:', error);
      res.status(500).json({ message: 'შეცდომა ინსტრუქციის განახლებისას' });
    }
  });

  app.delete('/iraklijanashvili/tutorials/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await deleteTutorial(id);
      res.json({ message: 'ინსტრუქცია წაშლილია' });
    } catch (error) {
      res.status(500).json({ message: 'შეცდომა ინსტრუქციის წაშლისას' });
    }
  });

  // რჩევების მართვა
  app.get('/iraklijanashvili/tips', async (_req: Request, res: Response) => {
    try {
      const allTips = await getAllTips();
      res.json(allTips);
    } catch (error) {
      res.status(500).json({ message: 'შეცდომა რჩევების მიღებისას' });
    }
  });
  
  app.get('/iraklijanashvili/tips/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const tip = await getTipById(id);
      
      if (!tip) {
        return res.status(404).json({ message: 'რჩევა ვერ მოიძებნა' });
      }
      
      res.json(tip);
    } catch (error) {
      res.status(500).json({ message: 'შეცდომა რჩევის მიღებისას' });
    }
  });

  app.post('/iraklijanashvili/tips', async (req: Request, res: Response) => {
    try {
      const { title, content, category, isTipOfDay } = req.body;
      
      const tipData = {
        title,
        content,
        category,
        isTipOfDay: isTipOfDay || false
      };
      
      const newTip = await createTip(tipData);
      res.status(201).json(newTip);
    } catch (error) {
      console.error('Error creating tip:', error);
      res.status(500).json({ message: 'შეცდომა რჩევის დამატებისას' });
    }
  });

  app.put('/iraklijanashvili/tips/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { title, content, category, isTipOfDay } = req.body;
      
      const tipData = {
        title,
        content,
        category,
        isTipOfDay: isTipOfDay || false
      };

      const updatedTip = await updateTip(id, tipData);
      
      if (!updatedTip) {
        return res.status(404).json({ message: 'რჩევა ვერ მოიძებნა' });
      }
      
      res.json(updatedTip);
    } catch (error) {
      console.error('Error updating tip:', error);
      res.status(500).json({ message: 'შეცდომა რჩევის განახლებისას' });
    }
  });

  app.delete('/iraklijanashvili/tips/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await deleteTip(id);
      res.json({ message: 'რჩევა წაშლილია' });
    } catch (error) {
      res.status(500).json({ message: 'შეცდომა რჩევის წაშლისას' });
    }
  });

  // სიახლეების მართვა
  app.get('/iraklijanashvili/news', async (_req: Request, res: Response) => {
    try {
      const allNews = await getAllNews();
      res.json(allNews);
    } catch (error) {
      res.status(500).json({ message: 'შეცდომა სიახლეების მიღებისას' });
    }
  });
  
  app.get('/iraklijanashvili/news/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const newsItem = await getNewsById(id);
      
      if (!newsItem) {
        return res.status(404).json({ message: 'სიახლე ვერ მოიძებნა' });
      }
      
      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ message: 'შეცდომა სიახლის მიღებისას' });
    }
  });

  app.post('/iraklijanashvili/news', async (req: Request, res: Response) => {
    try {
      const { title, content, imageUrl, videoUrl } = req.body;
      
      const newsData = {
        title,
        content,
        imageUrl: imageUrl || "",
        videoUrl: videoUrl || ""
      };
      
      const newNews = await createNews(newsData);
      res.status(201).json(newNews);
    } catch (error) {
      console.error('Error creating news:', error);
      res.status(500).json({ message: 'შეცდომა სიახლის დამატებისას' });
    }
  });

  app.put('/iraklijanashvili/news/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { title, content, imageUrl, videoUrl } = req.body;
      
      const newsData = {
        title,
        content,
        imageUrl: imageUrl || "",
        videoUrl: videoUrl || ""
      };

      const updatedNews = await updateNews(id, newsData);
      
      if (!updatedNews) {
        return res.status(404).json({ message: 'სიახლე ვერ მოიძებნა' });
      }
      
      res.json(updatedNews);
    } catch (error) {
      console.error('Error updating news:', error);
      res.status(500).json({ message: 'შეცდომა სიახლის განახლებისას' });
    }
  });

  app.delete('/iraklijanashvili/news/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await deleteNews(id);
      res.json({ message: 'სიახლე წაშლილია' });
    } catch (error) {
      res.status(500).json({ message: 'შეცდომა სიახლის წაშლისას' });
    }
  });
}
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { recipes as georgianRecipes, ingredients as recipeIngredients, steps as recipeSteps, news, InsertNews, News, tutorials, InsertTutorial, Tutorial, tips, InsertTip, Tip, InsertRecipe, Recipe, InsertIngredient, InsertStep, RecipeWithDetails } from '@shared/schema';
import postgres from 'postgres';
import 'dotenv/config';

// ბაზის კავშირის სტრინგი
const connectionString = process.env.DATABASE_URL || '';

// PostgreSQL კავშირის შექმნა
const client = postgres(connectionString);
export const db = drizzle(client);

console.log(`🔌 Using PostgreSQL database`);

// რეცეპტის მიღება ID-ის მიხედვით
export async function getGeorgianRecipeById(id: number) {
  try {
    // რეცეპტის მიღება
    const [recipe] = await db.select().from(georgianRecipes).where(
      eq(georgianRecipes.id, id)
    );

    if (!recipe) {
      return null;
    }

    // ინგრედიენტების მიღება
    const ingredients = await db.select().from(recipeIngredients).where(
      eq(recipeIngredients.recipeId, id)
    );

    // ნაბიჯების მიღება
    const steps = await db.select().from(recipeSteps).where(
      eq(recipeSteps.recipeId, id)
    ).orderBy(recipeSteps.stepNumber);

    // სრული რეცეპტის დაბრუნება
    return {
      ...recipe,
      ingredients,
      steps
    };
  } catch (error) {
    console.error('Error getting recipe by ID:', error);
    throw error;
  }
}

// ყველა რეცეპტის მიღება
export async function getAllGeorgianRecipes() {
  try {
    const recipes = await db.select().from(georgianRecipes);
    
    // ყველა რეცეპტისთვის ინგრედიენტების და ნაბიჯების მიღება
    const recipesWithDetails = await Promise.all(recipes.map(async (recipe) => {
      try {
        // ინგრედიენტების მიღება
        const ingredients = await db.select().from(recipeIngredients).where(
          eq(recipeIngredients.recipeId, recipe.id)
        );
        
        // ნაბიჯების მიღება
        const steps = await db.select().from(recipeSteps).where(
          eq(recipeSteps.recipeId, recipe.id)
        ).orderBy(recipeSteps.stepNumber);
        
        // ინგრედიენტების მასივის ფორმატირება
        const formattedIngredients = ingredients.map(ing => `${ing.amount} ${ing.unit} ${ing.name}`);
        
        // ნაბიჯების მასივის ფორმატირება
        const formattedSteps = steps.map(step => step.instruction);
        
        // სრული რეცეპტის დაბრუნება
        return {
          ...recipe,
          ingredients: formattedIngredients,
          steps: formattedSteps
        };
      } catch (error) {
        console.error(`Error getting details for recipe ${recipe.id}:`, error);
        // თუ დეტალების მიღება ვერ მოხერხდა, ვაბრუნებთ რეცეპტს ცარიელი მასივებით
        return {
          ...recipe,
          ingredients: [],
          steps: []
        };
      }
    }));
    
    return recipesWithDetails;
  } catch (error) {
    console.error('Error getting all recipes:', error);
    return [];
  }
}

// რეცეპტი და მისი ინგრედიენტებისა და ნაბიჯების შენახვა
export async function createGeorgianRecipeWithDetails(
  recipe: typeof georgianRecipes.$inferInsert,
  ingredients: Array<Omit<typeof recipeIngredients.$inferInsert, 'recipeId'>>,
  steps: Array<Omit<typeof recipeSteps.$inferInsert, 'recipeId'>>
) {
  try {
    // ვალიდაცია
    if (!recipe.title || typeof recipe.title !== 'string' || recipe.title.trim() === '') {
      throw new Error('Recipe title is required and must be a non-empty string.');
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      throw new Error('Recipe must have at least one ingredient.');
    }

    if (!Array.isArray(steps) || steps.length === 0) {
      throw new Error('Recipe must have at least one step.');
    }

    

    console.log('=== DEBUG: createGeorgianRecipeWithDetails START ===');
    console.log('Recipe data:', JSON.stringify(recipe, null, 2));
    console.log('Ingredients:', JSON.stringify(ingredients, null, 2));
    console.log('Steps:', JSON.stringify(steps, null, 2));
    
    // ვამოწმებთ ინგრედიენტებისა და ნაბიჯების შიგთავსს
    if (ingredients.length === 0) {
      console.warn('WARNING: No steps provided for recipe!');
    }
    
    // რეცეპტის შენახვა
    console.log('Attempting to insert recipe into database...');
    const [newRecipe] = await db.insert(georgianRecipes).values(recipe).returning();
    console.log('Recipe inserted successfully, ID:', newRecipe.id);

    const recipeId = newRecipe.id;

    // ინგრედიენტების შენახვა
    if (ingredients.length > 0) {
      console.log('Attempting to insert ingredients...');
      const ingredientsWithRecipeId = ingredients.map(ing => ({ ...ing, recipeId }));
      console.log('Prepared ingredients:', JSON.stringify(ingredientsWithRecipeId, null, 2));
      
      try {
        await db.insert(recipeIngredients).values(
          ingredientsWithRecipeId
        );
        console.log('Ingredients inserted successfully');
      } catch (ingredientError) {
        console.error('ERROR inserting ingredients:', ingredientError);
        throw new Error(`Failed to insert ingredients: ${ingredientError instanceof Error ? ingredientError.message : 'Unknown error'}`);
      }
    }

    // ნაბიჯების შენახვა
    if (steps.length > 0) {
      console.log('Attempting to insert steps...');
      const stepsWithRecipeId = steps.map(step => ({ ...step, recipeId }));
      console.log('Prepared steps:', JSON.stringify(stepsWithRecipeId, null, 2));
      
      try {
        await db.insert(recipeSteps).values(
          stepsWithRecipeId
        );
        console.log('Steps inserted successfully');
      } catch (stepError) {
        console.error('ERROR inserting steps:', stepError);
        throw new Error(`Failed to insert steps: ${stepError instanceof Error ? stepError.message : 'Unknown error'}`);
      }
    }

    // დაბრუნება სრული ინფორმაციით
    console.log('Fetching complete recipe with ID:', recipeId);
    const completeRecipe = await getGeorgianRecipeById(recipeId);
    console.log('=== DEBUG: createGeorgianRecipeWithDetails END ===');
    return completeRecipe;
  } catch (error) {
    console.error('ERROR creating recipe:', error);
    console.error('Error details:', error instanceof Error ? error.stack : JSON.stringify(error));
    throw error;
  }
}

export async function deleteGeorgianRecipe(id: number) {
  try {
    // Delete recipe steps and ingredients first
    await db.delete(recipeSteps).where(eq(recipeSteps.recipeId, id));
    await db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, id));
    // Then delete the recipe
    await db.delete(georgianRecipes).where(eq(georgianRecipes.id, id));
    return true;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
}

// რეცეპტის და მისი დეტალების განახლება
export async function updateGeorgianRecipeWithDetails(
  id: number,
  recipe: typeof georgianRecipes.$inferInsert,
  ingredients: Array<Omit<typeof recipeIngredients.$inferInsert, 'recipeId'>>,
  steps: Array<Omit<typeof recipeSteps.$inferInsert, 'recipeId'>>
) {
  try {
    // შევამოწმოთ არსებობს თუ არა რეცეპტი
    const existingRecipe = await getGeorgianRecipeById(id);
    if (!existingRecipe) {
      return null;
    }

    // განვაახლოთ რეცეპტი
    await db.update(georgianRecipes)
      .set(recipe)
      .where(eq(georgianRecipes.id, id));

    // წავშალოთ არსებული ინგრედიენტები და ნაბიჯები
    await db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, id));
    await db.delete(recipeSteps).where(eq(recipeSteps.recipeId, id));

    // დავამატოთ ახალი ინგრედიენტები
    if (ingredients.length > 0) {
      await db.insert(recipeIngredients).values(
        ingredients.map(ing => ({ ...ing, recipeId: id }))
      );
    }

    // დავამატოთ ახალი ნაბიჯები
    if (steps.length > 0) {
      await db.insert(recipeSteps).values(
        steps.map(step => ({ ...step, recipeId: id }))
      );
    }

    // დავაბრუნოთ განახლებული რეცეპტი
    return await getGeorgianRecipeById(id);
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
}

// სიახლეების CRUD ოპერაციები
export async function getAllNews() {
  try {
    const allNews = await db.select().from(news);
    return allNews;
  } catch (error) {
    console.error('Error getting all news:', error);
    return [];
  }
}

export async function getNewsById(id: number) {
  try {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem || null;
  } catch (error) {
    console.error('Error getting news by ID:', error);
    return null;
  }
}

export async function createNews(newsData: typeof news.$inferInsert) {
  try {
    console.log('=== DEBUG: createNews START ===');
    console.log('News data:', JSON.stringify(newsData, null, 2));
    
    // ვალიდაცია
    if (!newsData.title || typeof newsData.title !== 'string' || newsData.title.trim() === '') {
      throw new Error('News article title is required and must be a non-empty string.');
    }
    
    if (!newsData.content || typeof newsData.content !== 'string' || newsData.content.trim() === '') {
      throw new Error('News article content is required and must be a non-empty string.');
    }
    
    if (!newsData.image || typeof newsData.image !== 'string' || newsData.image.trim() === '') {
      throw new Error('News article image is required and must be a non-empty string.');
    }

    console.log('Attempting to insert news into database...');
    const [newArticle] = await db.insert(news).values(newsData).returning();
    console.log('News inserted successfully, ID:', newArticle.id);
    console.log('=== DEBUG: createNews END ===');
    
    return newArticle;
  } catch (error) {
    console.error('ERROR creating news article:', error);
    console.error('Error details:', error instanceof Error ? error.stack : JSON.stringify(error));
    throw error;
  }
}

export async function updateNews(id: number, newsData: typeof news.$inferInsert) {
  try {
    await db.update(news).set(newsData).where(eq(news.id, id));
    return await getNewsById(id);
  } catch (error) {
    console.error('Error updating news:', error);
    throw error;
  }
}

export async function deleteNews(id: number) {
  try {
    await db.delete(news).where(eq(news.id, id));
    return true;
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
}

// ინსტრუქციების მართვის ფუნქციები
export async function getAllTutorials(): Promise<Tutorial[]> {
  return await db.select().from(tutorials).orderBy(tutorials.createdAt);
}

export async function getTutorialById(id: number): Promise<Tutorial | undefined> {
  const result = await db.select().from(tutorials).where(eq(tutorials.id, id));
  return result[0];
}

export async function createTutorial(tutorial: InsertTutorial): Promise<Tutorial> {
  const result = await db.insert(tutorials).values(tutorial).returning();
  return result[0];
}

export async function updateTutorial(id: number, tutorial: InsertTutorial): Promise<Tutorial | undefined> {
  const result = await db.update(tutorials)
    .set({ ...tutorial, updatedAt: new Date() })
    .where(eq(tutorials.id, id))
    .returning();
  return result[0];
}

export async function deleteTutorial(id: number) {
  await db.delete(tutorials).where(eq(tutorials.id, id));
}

// რჩევების მართვის ფუნქციები
export async function getAllTips(): Promise<Tip[]> {
  return await db.select().from(tips).orderBy(tips.createdAt);
}

export async function getTipById(id: number): Promise<Tip | undefined> {
  const result = await db.select().from(tips).where(eq(tips.id, id));
  return result[0];
}

export async function createTip(tip: InsertTip): Promise<Tip> {
  const result = await db.insert(tips).values(tip).returning();
  return result[0];
}

export async function updateTip(id: number, tip: InsertTip): Promise<Tip | undefined> {
  const result = await db.update(tips)
    .set({ ...tip, updatedAt: new Date() })
    .where(eq(tips.id, id))
    .returning();
  return result[0];
}

export async function deleteTip(id: number) {
  await db.delete(tips).where(eq(tips.id, id));
}
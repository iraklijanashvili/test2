import { pgTable, text, integer, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import 'dotenv/config';

// ვიყენებთ PostgreSQL-ს
const createTable = pgTable;
const textColumn = text;
const integerColumn = integer;
const serialColumn = serial;
const booleanColumn = boolean;
const timestampColumn = timestamp;

// რეცეპტების სქემა
export const recipes = createTable("recipes", {
  id: serialColumn("id").primaryKey(),
  title: textColumn("title").notNull(),
  description: textColumn("description").notNull(),
  imageUrl: textColumn("image_url"),
  category: textColumn("category").notNull(),
  prepTime: integerColumn("prep_time").notNull(), // წუთებში
  cookTime: integerColumn("cook_time").notNull(), // წუთებში
  servings: integerColumn("servings").notNull(),
  difficulty: textColumn("difficulty").notNull(), // მარტივი, საშუალო, რთული
  createdAt: timestampColumn("created_at").defaultNow().notNull(),
  updatedAt: timestampColumn("updated_at").defaultNow().notNull()
});

// რეცეპტის ინგრედიენტების სქემა
export const ingredients = createTable("ingredients", {
  id: serialColumn("id").primaryKey(),
  recipeId: integerColumn("recipe_id").notNull(),
  name: textColumn("name").notNull(),
  amount: textColumn("amount").notNull(),
  unit: textColumn("unit").notNull(),
  createdAt: timestampColumn("created_at").defaultNow().notNull()
});

// რეცეპტის მომზადების ნაბიჯების სქემა
export const steps = createTable("steps", {
  id: serialColumn("id").primaryKey(),
  recipeId: integerColumn("recipe_id").notNull(),
  stepNumber: integerColumn("step_number").notNull(),
  instruction: textColumn("instruction").notNull(),
  createdAt: timestampColumn("created_at").defaultNow().notNull()
});

// სიახლეების სქემა
export const news = createTable("news", {
  id: serialColumn("id").primaryKey(),
  title: textColumn("title").notNull(),
  content: textColumn("content").notNull(),
  imageUrl: textColumn("image_url"),
  videoUrl: textColumn("video_url"),
  createdAt: timestampColumn("created_at").defaultNow().notNull(),
  updatedAt: timestampColumn("updated_at").defaultNow().notNull()
});

// ურთიერთკავშირები
export const recipesRelations = relations(recipes, ({ many }) => ({
  ingredients: many(ingredients, { relationName: "recipe_ingredients" }),
  steps: many(steps, { relationName: "recipe_steps" })
}));

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
  recipe: one(recipes, {
    fields: [ingredients.recipeId],
    references: [recipes.id],
    relationName: "recipe_ingredients"
  })
}));

export const stepsRelations = relations(steps, ({ one }) => ({
  recipe: one(recipes, {
    fields: [steps.recipeId],
    references: [recipes.id],
    relationName: "recipe_steps"
  })
}));

// ჩასამატებელი სქემები
export const insertRecipeSchema = createInsertSchema(recipes).pick({
  title: true,
  description: true,
  imageUrl: true,
  category: true,
  prepTime: true,
  cookTime: true,
  servings: true,
  difficulty: true
});

export const insertIngredientSchema = createInsertSchema(ingredients).pick({
  recipeId: true,
  name: true,
  amount: true,
  unit: true
});

export const insertStepSchema = createInsertSchema(steps).pick({
  recipeId: true,
  stepNumber: true,
  instruction: true
});

export const insertNewsSchema = createInsertSchema(news).pick({
  title: true,
  content: true,
  imageUrl: true,
  videoUrl: true
});

// ტიპები
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect;

export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type Ingredient = typeof ingredients.$inferSelect;

export type InsertStep = z.infer<typeof insertStepSchema>;
export type Step = typeof steps.$inferSelect;

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;

// რეცეპტი სრული ინფორმაციით
export type RecipeWithDetails = Recipe & {
  ingredients: Ingredient[];
  steps: Step[];
};

// გავანახლოთ სქემები ქართული და არაქართული რეცეპტებისთვის
export const georgianRecipes = recipes;
export const recipeIngredients = ingredients;
export const recipeSteps = steps;

export const insertGeorgianRecipeSchema = insertRecipeSchema;
export const insertRecipeIngredientSchema = insertIngredientSchema;
export const insertRecipeStepSchema = insertStepSchema;
// ინსტრუქციების სქემა
export const tutorials = createTable("tutorials", {
  id: serialColumn("id").primaryKey(),
  title: textColumn("title").notNull(),
  content: textColumn("content").notNull(),
  category: textColumn("category").notNull(),
  imageUrl: textColumn("image_url"),
  readTime: textColumn("read_time").notNull(),
  createdAt: timestampColumn("created_at").defaultNow().notNull(),
  updatedAt: timestampColumn("updated_at").defaultNow().notNull()
});

// რჩევების სქემა
export const tips = createTable("tips", {
  id: serialColumn("id").primaryKey(),
  title: textColumn("title").notNull(),
  content: textColumn("content").notNull(),
  category: textColumn("category").notNull(),
  isTipOfDay: booleanColumn("is_tip_of_day").default(false).notNull(),
  createdAt: timestampColumn("created_at").defaultNow().notNull(),
  updatedAt: timestampColumn("updated_at").defaultNow().notNull()
});

export const insertTutorialSchema = createInsertSchema(tutorials).pick({
  title: true,
  content: true,
  category: true,
  imageUrl: true,
  readTime: true
});

export const insertTipSchema = createInsertSchema(tips).pick({
  title: true,
  content: true,
  category: true,
  isTipOfDay: true
});

// ტიპები
export type InsertTutorial = z.infer<typeof insertTutorialSchema>;
export type Tutorial = typeof tutorials.$inferSelect;

export type InsertTip = z.infer<typeof insertTipSchema>;
export type Tip = typeof tips.$inferSelect;

// ჰოროსკოპის სქემა
export const horoscopes = createTable("horoscopes", {
  id: serialColumn("id").primaryKey(),
  name: textColumn("name").notNull(),
  date: textColumn("date").notNull(),
  description: textColumn("description").notNull(),
  category: textColumn("category").notNull(),
  prediction: textColumn("prediction").notNull(),
  createdAt: timestampColumn("created_at").defaultNow().notNull(),
  updatedAt: timestampColumn("updated_at").defaultNow().notNull()
});

export const insertHoroscopeSchema = createInsertSchema(horoscopes).pick({
  name: true,
  date: true,
  description: true,
  category: true,
  prediction: true
});

// ტიპები
export type InsertHoroscope = z.infer<typeof insertHoroscopeSchema>;
export type Horoscope = typeof horoscopes.$inferSelect;

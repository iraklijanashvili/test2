import { 
  users, type User, type InsertUser,
  tutorials, type Tutorial, type InsertTutorial,
  recipes, type Recipe, type InsertRecipe, 
  tips, type Tip, type InsertTip,
  horoscopes, type Horoscope, type InsertHoroscope
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Tutorial methods
  getAllTutorials(): Promise<Tutorial[]>;
  getTutorialById(id: number): Promise<Tutorial | undefined>;
  searchTutorials(query: string): Promise<Tutorial[]>;
  createTutorial(tutorial: InsertTutorial): Promise<Tutorial>;
  updateTutorial(id: number, tutorial: InsertTutorial): Promise<Tutorial | undefined>;
  deleteTutorial(id: number): Promise<void>;
  
  // Recipe methods
  getAllRecipes(): Promise<Recipe[]>;
  getRecipeById(id: number): Promise<Recipe | undefined>;
  searchRecipes(query: string): Promise<Recipe[]>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  
  // Tip methods
  getAllTips(): Promise<Tip[]>;
  getTipById(id: number): Promise<Tip | undefined>;
  getTipOfDay(): Promise<Tip | undefined>;
  createTip(tip: InsertTip): Promise<Tip>;
  updateTip(id: number, tip: InsertTip): Promise<Tip | undefined>;
  deleteTip(id: number): Promise<void>;
  
  // Horoscope methods
  getAllHoroscopes(): Promise<Horoscope[]>;
  getHoroscopeById(id: number): Promise<Horoscope | undefined>;
  searchHoroscopes(query: string): Promise<Horoscope[]>;
  createHoroscope(horoscope: InsertHoroscope): Promise<Horoscope>;
  updateHoroscope(id: number, horoscope: InsertHoroscope): Promise<Horoscope | undefined>;
  deleteHoroscope(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tutorials: Map<number, Tutorial>;
  private recipes: Map<number, Recipe>;
  private tips: Map<number, Tip>;
  private horoscopes: Map<number, Horoscope>;
  
  private userCurrentId: number;
  private tutorialCurrentId: number;
  private recipeCurrentId: number;
  private tipCurrentId: number;
  private horoscopeCurrentId: number;

  constructor() {
    this.users = new Map();
    this.tutorials = new Map();
    this.recipes = new Map();
    this.tips = new Map();
    this.horoscopes = new Map();
    
    this.userCurrentId = 1;
    this.tutorialCurrentId = 1;
    this.recipeCurrentId = 1;
    this.tipCurrentId = 1;
    this.horoscopeCurrentId = 1;
    
    // Add some initial data
    this.initializeData();
  }

  private initializeData() {
    // Add some recipes
    this.createRecipe({
      title: "Khachapuri (Georgian Cheese Bread)",
      description: "Traditional Georgian cheese-filled bread that's perfect for sharing",
      preparationTime: "45 mins",
      cuisine: "Georgian",
      rating: 4.8,
      ingredients: "3 cups flour, 1 cup warm water, 1 tbsp yeast, 2 cups cheese, 2 eggs, butter",
      instructions: "1. Mix flour, water, and yeast. 2. Let dough rise. 3. Roll out and fill with cheese. 4. Bake and enjoy!"
    });
    
    this.createRecipe({
      title: "Homemade Pasta with Tomato Sauce",
      description: "Classic Italian pasta made from scratch with fresh tomato sauce",
      preparationTime: "60 mins",
      cuisine: "Italian",
      rating: 4.5,
      ingredients: "2 cups flour, 3 eggs, salt, 6 tomatoes, 2 cloves garlic, olive oil, basil",
      instructions: "1. Make pasta dough with flour and eggs. 2. Rest dough. 3. Roll and cut. 4. Make sauce with tomatoes and garlic. 5. Cook pasta and combine."
    });
    
    // ინსტრუქციებისა და რჩევების საწყისი მონაცემები წაშლილია მოთხოვნის შესაბამისად
    
    // Add some horoscopes
    this.createHoroscope({
      name: "ვერძი",
      date: "21 მარტი - 19 აპრილი",
      description: "ვერძი არის ზოდიაქოს პირველი ნიშანი, რომელიც გამოირჩევა ენერგიულობით და ლიდერული თვისებებით.",
      category: "ცეცხლი",
      prediction: "დღეს თქვენი ენერგია მაღალ დონეზეა. გამოიყენეთ ეს შესაძლებლობა ახალი პროექტების დასაწყებად."
    });
    
    this.createHoroscope({
      name: "კურო",
      date: "20 აპრილი - 20 მაისი",
      description: "კურო არის მიწის ნიშანი, რომელიც გამოირჩევა სტაბილურობით და პრაქტიკულობით.",
      category: "მიწა",
      prediction: "დღეს ფინანსური საკითხები წინა პლანზე გამოდის. დაფიქრდით გრძელვადიან ინვესტიციებზე."
    });
    
    this.createHoroscope({
      name: "ტყუპები",
      date: "21 მაისი - 20 ივნისი",
      description: "ტყუპები არის ჰაერის ნიშანი, რომელიც გამოირჩევა კომუნიკაბელურობით და ინტელექტით.",
      category: "ჰაერი",
      prediction: "დღეს კომუნიკაცია თქვენი ძლიერი მხარეა. გამოიყენეთ ეს უნარი მნიშვნელოვანი ურთიერთობების გასაუმჯობესებლად."
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Tutorial methods
  async getAllTutorials(): Promise<Tutorial[]> {
    return Array.from(this.tutorials.values());
  }
  
  async getTutorialById(id: number): Promise<Tutorial | undefined> {
    return this.tutorials.get(id);
  }
  
  async searchTutorials(query: string): Promise<Tutorial[]> {
    query = query.toLowerCase();
    return Array.from(this.tutorials.values()).filter(
      tutorial => 
        tutorial.title.toLowerCase().includes(query) || 
        tutorial.description.toLowerCase().includes(query) || 
        tutorial.category.toLowerCase().includes(query)
    );
  }
  
  async createTutorial(insertTutorial: InsertTutorial): Promise<Tutorial> {
    const id = this.tutorialCurrentId++;
    const tutorial: Tutorial = { ...insertTutorial, id };
    this.tutorials.set(id, tutorial);
    return tutorial;
  }
  
  // Recipe methods
  async getAllRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }
  
  async getRecipeById(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }
  
  async searchRecipes(query: string): Promise<Recipe[]> {
    query = query.toLowerCase();
    return Array.from(this.recipes.values()).filter(
      recipe => 
        recipe.title.toLowerCase().includes(query) || 
        recipe.description.toLowerCase().includes(query) || 
        recipe.cuisine.toLowerCase().includes(query)
    );
  }
  
  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const id = this.recipeCurrentId++;
    const recipe: Recipe = { ...insertRecipe, id };
    this.recipes.set(id, recipe);
    return recipe;
  }
  
  // Tip methods
  async getAllTips(): Promise<Tip[]> {
    return Array.from(this.tips.values());
  }
  
  async getTipById(id: number): Promise<Tip | undefined> {
    return this.tips.get(id);
  }
  
  async getTipOfDay(): Promise<Tip | undefined> {
    return Array.from(this.tips.values()).find(tip => tip.isTipOfDay);
  }
  
  async createTip(insertTip: InsertTip): Promise<Tip> {
    const id = this.tipCurrentId++;
    const tip: Tip = { ...insertTip, id };
    this.tips.set(id, tip);
    return tip;
  }

  async updateTutorial(id: number, insertTutorial: InsertTutorial): Promise<Tutorial | undefined> {
    const existingTutorial = await this.getTutorialById(id);
    if (!existingTutorial) return undefined;

    const updatedTutorial: Tutorial = { ...existingTutorial, ...insertTutorial };
    this.tutorials.set(id, updatedTutorial);
    return updatedTutorial;
  }

  async deleteTutorial(id: number): Promise<void> {
    this.tutorials.delete(id);
  }

  async updateTip(id: number, insertTip: InsertTip): Promise<Tip | undefined> {
    const existingTip = await this.getTipById(id);
    if (!existingTip) return undefined;

    const updatedTip: Tip = { ...existingTip, ...insertTip };
    this.tips.set(id, updatedTip);
    return updatedTip;
  }

  async deleteTip(id: number): Promise<void> {
    this.tips.delete(id);
  }
  
  // Horoscope methods
  async getAllHoroscopes(): Promise<Horoscope[]> {
    return Array.from(this.horoscopes.values());
  }
  
  async getHoroscopeById(id: number): Promise<Horoscope | undefined> {
    return this.horoscopes.get(id);
  }
  
  async searchHoroscopes(query: string): Promise<Horoscope[]> {
    query = query.toLowerCase();
    return Array.from(this.horoscopes.values()).filter(
      horoscope => 
        horoscope.name.toLowerCase().includes(query) || 
        horoscope.description.toLowerCase().includes(query) || 
        horoscope.category.toLowerCase().includes(query)
    );
  }
  
  async createHoroscope(insertHoroscope: InsertHoroscope): Promise<Horoscope> {
    const id = this.horoscopeCurrentId++;
    const horoscope: Horoscope = { ...insertHoroscope, id };
    this.horoscopes.set(id, horoscope);
    return horoscope;
  }
  
  async updateHoroscope(id: number, insertHoroscope: InsertHoroscope): Promise<Horoscope | undefined> {
    const existingHoroscope = await this.getHoroscopeById(id);
    if (!existingHoroscope) return undefined;

    const updatedHoroscope: Horoscope = { ...existingHoroscope, ...insertHoroscope };
    this.horoscopes.set(id, updatedHoroscope);
    return updatedHoroscope;
  }
  
  async deleteHoroscope(id: number): Promise<void> {
    this.horoscopes.delete(id);
  }
}

export const storage = new MemStorage();

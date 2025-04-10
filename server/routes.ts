import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertTutorialSchema, insertRecipeSchema, insertTipSchema,
  insertGeorgianRecipeSchema, insertRecipeIngredientSchema, insertRecipeStepSchema,
  insertHoroscopeSchema
} from "@shared/schema";
import { 
  getAllGeorgianRecipes, getGeorgianRecipeById, createGeorgianRecipeWithDetails,
  deleteGeorgianRecipe, updateGeorgianRecipeWithDetails,
  getAllNews, getNewsById, createNews, updateNews, deleteNews
} from "./db";
import { registerAdminRoutes } from "./admin";

// API გასაღებები
const WEATHER_API_KEY = '6b7b2adc3b6ad8e8081f764b25464607';
const CURRENCY_API_KEY = '6dabbdc137c248539b87e127e8e7635c';

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // რეგისტრირება ადმინისტრატორის მარშრუტების
  registerAdminRoutes(app);
  
  // Tutorial Routes
  app.get("/api/tutorials", async (req, res) => {
    try {
      const searchQuery = req.query.search as string | undefined;
      
      if (searchQuery) {
        const tutorials = await storage.searchTutorials(searchQuery);
        res.json(tutorials);
      } else {
        const tutorials = await storage.getAllTutorials();
        res.json(tutorials);
      }
    } catch (error) {
      console.error("Error fetching tutorials:", error);
      res.status(500).json({ message: "Failed to fetch tutorials" });
    }
  });
  
  app.get("/api/tutorials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tutorial ID" });
      }
      
      const tutorial = await storage.getTutorialById(id);
      if (!tutorial) {
        return res.status(404).json({ message: "Tutorial not found" });
      }
      
      res.json(tutorial);
    } catch (error) {
      console.error("Error fetching tutorial:", error);
      res.status(500).json({ message: "Failed to fetch tutorial" });
    }
  });
  
  app.post("/api/tutorials", async (req, res) => {
    try {
      const result = insertTutorialSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid tutorial data", errors: result.error.format() });
      }
      
      const tutorial = await storage.createTutorial(result.data);
      res.status(201).json(tutorial);
    } catch (error) {
      console.error("Error creating tutorial:", error);
      res.status(500).json({ message: "Failed to create tutorial" });
    }
  });

  app.put("/api/tutorials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tutorial ID" });
      }

      const result = insertTutorialSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid tutorial data", errors: result.error.format() });
      }

      const tutorial = await storage.updateTutorial(id, result.data);
      if (!tutorial) {
        return res.status(404).json({ message: "Tutorial not found" });
      }

      res.json(tutorial);
    } catch (error) {
      console.error("Error updating tutorial:", error);
      res.status(500).json({ message: "Failed to update tutorial" });
    }
  });

  app.delete("/api/tutorials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tutorial ID" });
      }

      await storage.deleteTutorial(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting tutorial:", error);
      res.status(500).json({ message: "Failed to delete tutorial" });
    }
  });
  
  // Recipe Routes
  app.get("/api/recipes", async (req, res) => {
    try {
      const searchQuery = req.query.search as string | undefined;
      
      if (searchQuery) {
        const recipes = await storage.searchRecipes(searchQuery);
        res.json(recipes);
      } else {
        const recipes = await storage.getAllRecipes();
        res.json(recipes);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });
  
  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid recipe ID" });
      }
      
      const recipe = await storage.getRecipeById(id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      res.json(recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });
  
  app.post("/api/recipes", async (req, res) => {
    try {
      const result = insertRecipeSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid recipe data", errors: result.error.format() });
      }
      
      const recipe = await storage.createRecipe(result.data);
      res.status(201).json(recipe);
    } catch (error) {
      console.error("Error creating recipe:", error);
      res.status(500).json({ message: "Failed to create recipe" });
    }
  });
  
  // Tip Routes
  app.get("/api/tips", async (req, res) => {
    try {
      const tips = await storage.getAllTips();
      res.json(tips);
    } catch (error) {
      console.error("Error fetching tips:", error);
      res.status(500).json({ message: "Failed to fetch tips" });
    }
  });
  
  app.get("/api/tips/daily", async (req, res) => {
    try {
      const tipOfDay = await storage.getTipOfDay();
      if (!tipOfDay) {
        return res.status(404).json({ message: "Tip of the day not found" });
      }
      
      res.json(tipOfDay);
    } catch (error) {
      console.error("Error fetching tip of the day:", error);
      res.status(500).json({ message: "Failed to fetch tip of the day" });
    }
  });
  
  app.get("/api/tips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tip ID" });
      }
      
      const tip = await storage.getTipById(id);
      if (!tip) {
        return res.status(404).json({ message: "Tip not found" });
      }
      
      res.json(tip);
    } catch (error) {
      console.error("Error fetching tip:", error);
      res.status(500).json({ message: "Failed to fetch tip" });
    }
  });
  
  app.post("/api/tips", async (req, res) => {
    try {
      const result = insertTipSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid tip data", errors: result.error.format() });
      }
      
      const tip = await storage.createTip(result.data);
      res.status(201).json(tip);
    } catch (error) {
      console.error("Error creating tip:", error);
      res.status(500).json({ message: "Failed to create tip" });
    }
  });

  app.put("/api/tips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tip ID" });
      }

      const result = insertTipSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid tip data", errors: result.error.format() });
      }

      const tip = await storage.updateTip(id, result.data);
      if (!tip) {
        return res.status(404).json({ message: "Tip not found" });
      }

      res.json(tip);
    } catch (error) {
      console.error("Error updating tip:", error);
      res.status(500).json({ message: "Failed to update tip" });
    }
  });

  app.delete("/api/tips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tip ID" });
      }

      await storage.deleteTip(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting tip:", error);
      res.status(500).json({ message: "Failed to delete tip" });
    }
  });
  
  // Horoscope Routes
  app.get("/api/horoscopes", async (req, res) => {
    try {
      const searchQuery = req.query.search as string | undefined;
      
      if (searchQuery) {
        const horoscopes = await storage.searchHoroscopes(searchQuery);
        res.json(horoscopes);
      } else {
        const horoscopes = await storage.getAllHoroscopes();
        res.json(horoscopes);
      }
    } catch (error) {
      console.error("Error fetching horoscopes:", error);
      res.status(500).json({ message: "Failed to fetch horoscopes" });
    }
  });
  
  app.get("/api/horoscopes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid horoscope ID" });
      }
      
      const horoscope = await storage.getHoroscopeById(id);
      if (!horoscope) {
        return res.status(404).json({ message: "Horoscope not found" });
      }
      
      res.json(horoscope);
    } catch (error) {
      console.error("Error fetching horoscope:", error);
      res.status(500).json({ message: "Failed to fetch horoscope" });
    }
  });
  
  app.post("/api/horoscopes", async (req, res) => {
    try {
      const result = insertHoroscopeSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid horoscope data", errors: result.error.format() });
      }
      
      const horoscope = await storage.createHoroscope(result.data);
      res.status(201).json(horoscope);
    } catch (error) {
      console.error("Error creating horoscope:", error);
      res.status(500).json({ message: "Failed to create horoscope" });
    }
  });

  app.put("/api/horoscopes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid horoscope ID" });
      }

      const result = insertHoroscopeSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid horoscope data", errors: result.error.format() });
      }

      const horoscope = await storage.updateHoroscope(id, result.data);
      if (!horoscope) {
        return res.status(404).json({ message: "Horoscope not found" });
      }

      res.json(horoscope);
    } catch (error) {
      console.error("Error updating horoscope:", error);
      res.status(500).json({ message: "Failed to update horoscope" });
    }
  });

  app.delete("/api/horoscopes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid horoscope ID" });
      }

      await storage.deleteHoroscope(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting horoscope:", error);
      res.status(500).json({ message: "Failed to delete horoscope" });
    }
  });
  
  // External API proxies
  // საქართველოს ქალაქების ჩამონათვალი
  const GEORGIA_CITIES = [
    { id: "tbilisi", name: "თბილისი", apiName: "Tbilisi" },
    { id: "batumi", name: "ბათუმი", apiName: "Batumi" },
    { id: "kutaisi", name: "ქუთაისი", apiName: "Kutaisi" },
    { id: "rustavi", name: "რუსთავი", apiName: "Rustavi" },
    { id: "gori", name: "გორი", apiName: "Gori" },
    { id: "zugdidi", name: "ზუგდიდი", apiName: "Zugdidi" },
    { id: "poti", name: "ფოთი", apiName: "Poti" },
    { id: "telavi", name: "თელავი", apiName: "Telavi" },
    { id: "akhaltsikhe", name: "ახალციხე", apiName: "Akhaltsikhe" },
    { id: "kobuleti", name: "ქობულეთი", apiName: "Kobuleti" },
    { id: "borjomi", name: "ბორჯომი", apiName: "Borjomi" },
    { id: "mtskheta", name: "მცხეთა", apiName: "Mtskheta" },
    { id: "sighnaghi", name: "სიღნაღი", apiName: "Sighnaghi" },
    { id: "stepantsminda", name: "სტეფანწმინდა", apiName: "Stepantsminda" },
    { id: "gudauri", name: "გუდაური", apiName: "Gudauri" },
    { id: "mestia", name: "მესტია", apiName: "Mestia" },
    { id: "bakuriani", name: "ბაკურიანი", apiName: "Bakuriani" },
    { id: "tskhaltubo", name: "წყალტუბო", apiName: "Tskaltubo" },
    { id: "ozurgeti", name: "ოზურგეთი", apiName: "Ozurgeti" },
    { id: "ambrolauri", name: "ამბროლაური", apiName: "Ambrolauri" }
  ];

  // ქალაქების სიის API
  app.get("/api/georgia-cities", (req, res) => {
    res.json(GEORGIA_CITIES);
  });

  // ერთი ქალაქის ამინდის API
  // 16-დღიანი პროგნოზი OpenWeatherMap-იდან
  app.get("/api/weather/forecast", async (req, res) => {
    try {
      const city = req.query.city || 'Tbilisi';
      const url = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&units=metric&cnt=16&appid=${WEATHER_API_KEY}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`OpenWeatherMap API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching forecast:", error);
      res.status(200).json({ 
        error: true, 
        message: `Forecast unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });

  app.get("/api/weather", async (req, res) => {
    try {
      const city = req.query.city || 'Tbilisi'; // Default to Tbilisi if no city provided
      // დავრწმუნდეთ რომ ვიყენებთ სწორ ურლს და protocol-ს, მცდელობა HTTPS-ით
      const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`;
      
      console.log(`Requesting weather data from: ${url}`);
      
      // ცადეთ მოთხოვნის გაგზავნა სრული debug ინფორმაციით
      console.log("ვიწყებთ Weather API-სთვის მოთხოვნის გაგზავნას");
      const fetchResponse = await fetch(url);
      console.log(`Weather API response status: ${fetchResponse.status} ${fetchResponse.statusText}`);
      
      // აღარ ვამოწმებთ response.ok სტატუსს, პირდაპირ ვკითხულობთ პასუხს
      const responseText = await fetchResponse.text();
      console.log(`Weather API response body length: ${responseText.length} bytes`);
      
      if (responseText.length < 100) {
        console.log(`Weather API full response: ${responseText}`);
      }
      
      // თუ პასუხი არ არის JSON ფორმატში, დავლოგავთ და გამოვისვრით შეცდომას
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("JSON პასუხი წარმატებით დაპარსდა");
      } catch (e) {
        console.error("JSON პარსინგის შეცდომა:", e);
        throw new Error(`Invalid JSON response`);
      }
      
      // გადავამოწმოთ თუ პასუხში შეცდომაა
      if (data.error) {
        console.error("API-ის პასუხში შეცდომა:", data.error);
        throw new Error(`Weather API error: ${data.error.message || JSON.stringify(data.error)}`);
      }
      
      // Transform weatherapi.com data to match our application's expected format
      const transformedData = {
        name: data.location.name,
        sys: {
          country: data.location.country
        },
        main: {
          temp: data.current.temp_c,
          feels_like: data.current.feelslike_c,
          humidity: data.current.humidity,
          pressure: data.current.pressure_mb
        },
        weather: [
          {
            id: data.current.condition.code,
            main: data.current.condition.text,
            description: data.current.condition.text,
            icon: data.current.condition.icon.replace("//", "https://") // დავრწმუნდეთ რომ ხატულა სრული URL-ით მოდის
          }
        ],
        wind: {
          speed: data.current.wind_kph
        }
      };
      
      console.log("Weather data transformed successfully");
      res.json(transformedData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      // უკეთესი შეცდომის გამოტანა კლიენტისთვის
      res.status(200).json({ 
        error: true, 
        message: `Weather data unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`,
        // შევქმნათ ცარიელი მონაცემი, რომ კლიენტმა შეცდომა ლამაზად გამოიტანოს
        name: "Unknown",
        sys: { country: "" },
        main: { temp: 0, feels_like: 0, humidity: 0, pressure: 0 },
        weather: [{ id: 0, main: "Unknown", description: "No data available", icon: "" }],
        wind: { speed: 0 }
      });
    }
  });
  
  // საათობრივი პროგნოზის API (4 დღე, 96 საათი)
  app.get("/api/weather/hourly-forecast", async (req, res) => {
    const MAX_RETRIES = 3;
    let retries = 0;
    
    // საგანგებოდ შექმნილი ფუნქცია ხელახალი მცდელობებისთვის
    const fetchWithRetry = async () => {
      try {
        const city = req.query.city || 'Tbilisi'; // Default to Tbilisi if no city provided
        const days = 4; // 4 დღის პროგნოზი (მაქსიმუმი)
        
        console.log(`საათობრივი პროგნოზის მოთხოვნა ქალაქისთვის: ${city}`);
        
        // Forecast API endpoint
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${city}&days=${days}&aqi=no&alerts=no`;
        
        console.log(`WeatherAPI-ის მოთხოვნა: ${url}`);
        
        // გავაკეთოთ მოთხოვნა 1 წამის დაყოვნებით რომ არ დაბლოკოს API-მ
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch(url);
        console.log(`WeatherAPI პასუხის სტატუსი: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API მოთხოვნის შეცდომა: ${errorText}`);
          
          if (retries < MAX_RETRIES) {
            retries++;
            console.log(`ხელახლა ცდა ${retries}/${MAX_RETRIES}...`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 წამი დაყოვნება
            return await fetchWithRetry();
          }
          
          throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`მოთხოვნა წარმატებულია, მონაცემები მიღებულია`);
        
        // მონაცემების ტრანსფორმირება ჩვენი აპლიკაციის ფორმატში
        const transformedData = {
          location: {
            name: data.location.name,
            region: data.location.region,
            country: data.location.country,
            lat: data.location.lat,
            lon: data.location.lon,
            localtime: data.location.localtime
          },
          forecast: data.forecast.forecastday.map((day: any) => ({
            date: day.date,
            hours: day.hour.map((h: any) => ({
              time: h.time,
              temp_c: h.temp_c,
              condition: {
                text: h.condition.text,
                icon: h.condition.icon.replace("//", "https://"),
                code: h.condition.code
              },
              wind_kph: h.wind_kph,
              wind_degree: h.wind_degree,
              wind_dir: h.wind_dir,
              pressure_mb: h.pressure_mb,
              humidity: h.humidity,
              chance_of_rain: h.chance_of_rain,
              chance_of_snow: h.chance_of_snow,
              will_it_rain: h.will_it_rain,
              will_it_snow: h.will_it_snow
            }))
          }))
        };
        
        return res.json(transformedData);
      } catch (error) {
        console.error("Error fetching hourly forecast:", error);
        
        if (retries < MAX_RETRIES) {
          retries++;
          console.log(`ხელახლა ცდა გამონაკლისის შემდეგ ${retries}/${MAX_RETRIES}...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 წამი დაყოვნება
          return await fetchWithRetry();
        }
        
        return res.status(200).json({
          error: true,
          message: `Hourly forecast unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    };
    
    await fetchWithRetry();
  });
  
  // დღიური პროგნოზის API (16 დღე)
  app.get("/api/weather/daily-forecast", async (req, res) => {
    const MAX_RETRIES = 3;
    let retries = 0;
    
    const fetchWithRetry = async () => {
      try {
        const city = req.query.city || 'Tbilisi'; // Default to Tbilisi if no city provided
        const apiKey = '04c70df2f49a49abb73124624250904'; // მომხმარებლის მიერ მოწოდებული API გასაღები
        const days = 16; // 16 დღის პროგნოზი (მაქსიმუმი)
        
        console.log(`დღიური პროგნოზის მოთხოვნა ქალაქისთვის: ${city}`);
        
        // Forecast API endpoint
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${days}&aqi=no&alerts=no`;
        
        console.log(`WeatherAPI-ის მოთხოვნა: ${url}`);
        
        // გავაკეთოთ მოთხოვნა 1 წამის დაყოვნებით რომ არ დაბლოკოს API-მ
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch(url);
        console.log(`WeatherAPI პასუხის სტატუსი: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API მოთხოვნის შეცდომა: ${errorText}`);
          
          if (retries < MAX_RETRIES) {
            retries++;
            console.log(`ხელახლა ცდა ${retries}/${MAX_RETRIES}...`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 წამი დაყოვნება
            return await fetchWithRetry();
          }
          
          throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`მოთხოვნა წარმატებულია, მონაცემები მიღებულია`);
        
        // მონაცემების ტრანსფორმირება ჩვენი აპლიკაციის ფორმატში
        const transformedData = {
          location: {
            name: data.location.name,
            region: data.location.region,
            country: data.location.country,
            lat: data.location.lat,
            lon: data.location.lon,
            localtime: data.location.localtime
          },
          forecast: data.forecast.forecastday.map((day: any) => ({
            date: day.date,
            max_temp_c: day.day.maxtemp_c,
            min_temp_c: day.day.mintemp_c,
            avg_temp_c: day.day.avgtemp_c,
            condition: {
              text: day.day.condition.text,
              icon: day.day.condition.icon.replace("//", "https://"),
              code: day.day.condition.code
            },
            max_wind_kph: day.day.maxwind_kph,
            total_precip_mm: day.day.totalprecip_mm,
            avg_humidity: day.day.avghumidity,
            chance_of_rain: day.day.daily_chance_of_rain,
            chance_of_snow: day.day.daily_chance_of_snow,
            sunrise: day.astro.sunrise,
            sunset: day.astro.sunset
          }))
        };
        
        return res.json(transformedData);
      } catch (error) {
        console.error("Error fetching daily forecast:", error);
        
        if (retries < MAX_RETRIES) {
          retries++;
          console.log(`ხელახლა ცდა გამონაკლისის შემდეგ ${retries}/${MAX_RETRIES}...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 წამი დაყოვნება
          return await fetchWithRetry();
        }
        
        return res.status(200).json({
          error: true,
          message: `Daily forecast unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    };
    
    await fetchWithRetry();
  });
  
  // ამინდის ისტორიის API
  app.get("/api/weather/history", async (req, res) => {
    const MAX_RETRIES = 3;
    let retries = 0;
    
    const fetchWithRetry = async () => {
      try {
        const city = req.query.city || 'Tbilisi'; // Default to Tbilisi if no city provided
        let date = req.query.date as string || new Date().toISOString().split('T')[0]; // Default to today
        const apiKey = '04c70df2f49a49abb73124624250904'; // მომხმარებლის მიერ მოწოდებული API გასაღები
        
        console.log(`ამინდის ისტორიის მოთხოვნა ქალაქისთვის: ${city}, თარიღი: ${date}`);
        
        // History API endpoint
        const url = `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${city}&dt=${date}`;
        
        console.log(`WeatherAPI-ის მოთხოვნა: ${url}`);
        
        // გავაკეთოთ მოთხოვნა 1 წამის დაყოვნებით რომ არ დაბლოკოს API-მ
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch(url);
        console.log(`WeatherAPI პასუხის სტატუსი: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API მოთხოვნის შეცდომა: ${errorText}`);
          
          if (retries < MAX_RETRIES) {
            retries++;
            console.log(`ხელახლა ცდა ${retries}/${MAX_RETRIES}...`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 წამი დაყოვნება
            return await fetchWithRetry();
          }
          
          throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`მოთხოვნა წარმატებულია, მონაცემები მიღებულია`);
        
        // მონაცემების ტრანსფორმირება ჩვენი აპლიკაციის ფორმატში
        const transformedData = {
          location: {
            name: data.location.name,
            region: data.location.region,
            country: data.location.country,
            lat: data.location.lat,
            lon: data.location.lon,
            localtime: data.location.localtime
          },
          history: {
            date: data.forecast.forecastday[0].date,
            day: {
              max_temp_c: data.forecast.forecastday[0].day.maxtemp_c,
              min_temp_c: data.forecast.forecastday[0].day.mintemp_c,
              avg_temp_c: data.forecast.forecastday[0].day.avgtemp_c,
              condition: {
                text: data.forecast.forecastday[0].day.condition.text,
                icon: data.forecast.forecastday[0].day.condition.icon.replace("//", "https://"),
                code: data.forecast.forecastday[0].day.condition.code
              },
              max_wind_kph: data.forecast.forecastday[0].day.maxwind_kph,
              total_precip_mm: data.forecast.forecastday[0].day.totalprecip_mm,
              avg_humidity: data.forecast.forecastday[0].day.avghumidity
            },
            hours: data.forecast.forecastday[0].hour.map((h: any) => ({
              time: h.time,
              temp_c: h.temp_c,
              condition: {
                text: h.condition.text,
                icon: h.condition.icon.replace("//", "https://"),
                code: h.condition.code
              },
              wind_kph: h.wind_kph,
              pressure_mb: h.pressure_mb,
              humidity: h.humidity,
              precip_mm: h.precip_mm
            }))
          }
        };
        
        return res.json(transformedData);
      } catch (error) {
        console.error("Error fetching weather history:", error);
        
        if (retries < MAX_RETRIES) {
          retries++;
          console.log(`ხელახლა ცდა გამონაკლისის შემდეგ ${retries}/${MAX_RETRIES}...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 წამი დაყოვნება
          return await fetchWithRetry();
        }
        
        return res.status(200).json({
          error: true,
          message: `Weather history unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    };
    
    await fetchWithRetry();
  });
  
  // მრავალი ქალაქის ამინდის API
  app.get("/api/weather-all", async (req, res) => {
    try {
      const apiKey = '04c70df2f49a49abb73124624250904'; // მომხმარებლის მიერ მოწოდებული API გასაღები
      
      // შეყოვნების ფუნქცია
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      // განვახორციელოთ მოთხოვნები თანმიმდევრულად, შეყოვნებით
      const results = [];
      
      // რამდენიმე მნიშვნელოვანი ქალაქი საქართველოში 
      // პრიორიტეტულად შევარჩიოთ ყველაზე პოპულარული ადგილები
      type City = typeof GEORGIA_CITIES[0];
      
      const mainCities = [
        GEORGIA_CITIES.find(c => c.apiName === "Tbilisi"), // თბილისი
        GEORGIA_CITIES.find(c => c.apiName === "Batumi"), // ბათუმი
        GEORGIA_CITIES.find(c => c.apiName === "Kutaisi"), // ქუთაისი
        GEORGIA_CITIES.find(c => c.apiName === "Rustavi"), // რუსთავი
        GEORGIA_CITIES.find(c => c.apiName === "Zugdidi"), // ზუგდიდი
        GEORGIA_CITIES.find(c => c.apiName === "Gori"), // გორი
        GEORGIA_CITIES.find(c => c.apiName === "Poti"), // ფოთი
        GEORGIA_CITIES.find(c => c.apiName === "Kobuleti") // ქობულეთი
      ].filter(city => city !== undefined) as City[];
      
      // თუ მთავარი ქალაქების სიის შექმნა ვერ მოხერხდა, გამოვიყენოთ პირველი 8 ქალაქი
      if (mainCities.length === 0) {
        mainCities.push(...GEORGIA_CITIES.slice(0, 8));
      }
      
      // მცდელობების რაოდენობა და ინტერვალი
      const maxRetries = 3;
      const delayBetweenRequests = 800; // 800 მილიწამი
      
      // ცალკეული fetch request-ისთვის ვიყენებთ დამოუკიდებელ AbortController-ებს  
      for (const city of mainCities) {
        let retry = 0;
        let success = false;
        
        while (retry < maxRetries && !success) {
          // ყოველ მცდელობაზე ახალი controller
          const controller = new AbortController();
          let timeoutId: NodeJS.Timeout | null = null;
          
          try {
            if (retry > 0) {
              console.log(`Retrying weather data for ${city.name} (attempt ${retry + 1})`);
              // თუ ხელახლა ვცდილობთ, დავიცადოთ უფრო მეტი
              await delay(delayBetweenRequests * retry);
            }
            
            const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city.apiName}`;
            
            console.log(`Requesting weather data for ${city.name} from: ${url}`);
            
            // 5 წამიანი timeout-ის დაყენება
            timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const fetchResponse = await fetch(url, { 
              signal: controller.signal 
            });
            
            if (!fetchResponse.ok) {
              console.error(`Error fetching data for ${city.name}: ${fetchResponse.statusText}`);
              
              // გავასუფთავოთ timeout
              if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
              }
              
              retry++;
              continue;
            }
            
            const data = await fetchResponse.json();
            
            // გავასუფთავოთ timeout
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            
            if (data.error) {
              console.error(`Error in data for ${city.name}:`, data.error);
              retry++;
              continue;
            }
            
            // თუ აქამდე მოვედით, მოთხოვნა წარმატებულია
            success = true;
            
            results.push({
              id: city.id,
              name: city.name,
              apiName: city.apiName,
              weather: {
                name: data.location.name,
                sys: {
                  country: data.location.country
                },
                main: {
                  temp: data.current.temp_c,
                  feels_like: data.current.feelslike_c,
                  humidity: data.current.humidity,
                  pressure: data.current.pressure_mb
                },
                weather: [
                  {
                    id: data.current.condition.code,
                    main: data.current.condition.text,
                    description: data.current.condition.text,
                    icon: data.current.condition.icon.replace("//", "https://")
                  }
                ],
                wind: {
                  speed: data.current.wind_kph
                }
              }
            });
            
          } catch (error) {
            console.error(`Error processing ${city.name}:`, error);
            
            // გავასუფთავოთ timeout
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            
            retry++;
          }
          
          // ყოველ მოთხოვნას შორის დავიცადოთ API წვდომის შეზღუდვის თავიდან ასაცილებლად
          if (retry < maxRetries && !success) {
            await delay(delayBetweenRequests);
          }
        }
        
        // ქალაქებს შორის დროის შუალედი
        if (results.length > 0) {
          await delay(delayBetweenRequests);
        }
      }
      
      if (results.length === 0) {
        console.error("Could not fetch weather data for any city - returning sample data instead");
        // თუ სერვერიდან ვერაფერი მივიღეთ, გავაგზავნოთ სტატიკური მონაცემები კლიენტის ინტერფეისის ჩვენების მიზნით
        res.json([
          {
            id: "1",
            name: "თბილისი",
            apiName: "Tbilisi",
            weather: {
              name: "თბილისი",
              sys: { country: "საქართველო" },
              main: { temp: 18, feels_like: 17, humidity: 45, pressure: 1015 },
              weather: [{ id: 800, main: "მზიანი", description: "უღრუბლო ცა", icon: "https://cdn.weatherapi.com/weather/64x64/day/113.png" }],
              wind: { speed: 10 }
            }
          }
        ]);
        return;
      }
      
      console.log(`Successfully fetched weather data for ${results.length} cities`);
      res.json(results);
    } catch (error) {
      console.error("Error fetching all weather data:", error);
      res.status(200).json({ 
        error: true, 
        message: `Weather data unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`,
        cities: []
      });
    }
  });
  
  // ახალი ამბების მონაცემები (სერვერის მეხსიერებაში შენახული)
let newsArticles = [
  {
    id: 1,
    source: { 
      id: "sample-1", 
      name: "საქართველოს ახალი ამბები" 
    },
    author: "გიორგი ბერიძე",
    title: "საქართველოში ტურიზმი რეკორდულ დონეს აღწევს",
    description: "ბოლო თვეების განმავლობაში საქართველოში ჩამოსული ტურისტების რაოდენობა 30%-ით გაიზარდა.",
    url: "https://example.com/tourism-record",
    urlToImage: "https://placehold.co/600x400?text=Tourism+News",
    publishedAt: "2023-04-09T09:30:00Z",
    content: "საქართველოში ტურიზმი რეკორდულ მაჩვენებელს აღწევს..."
  },
  {
    id: 2,
    source: { 
      id: "sample-2", 
      name: "ბიზნეს მიმომხილველი" 
    },
    author: "ნინო კახაძე",
    title: "ლარის კურსი მყარდება საერთაშორისო ბაზრებზე",
    description: "ქართული ლარი მყარდება დოლარისა და ევროს მიმართ, ეკონომისტები დადებით ტენდენციას ხედავენ.",
    url: "https://example.com/lari-strengthening",
    urlToImage: "https://placehold.co/600x400?text=Financial+News",
    publishedAt: "2023-04-08T14:15:00Z",
    content: "ბოლო კვირების განმავლობაში ლარის კურსი მნიშვნელოვნად გამყარდა..."
  },
  {
    id: 3,
    source: { 
      id: "sample-3", 
      name: "ტექნოლოგიების პორტალი" 
    },
    author: "დავით მამულაძე",
    title: "ქართული სტარტაპები საერთაშორისო ინვესტორების ყურადღების ცენტრში",
    description: "რამდენიმე ქართულმა სტარტაპმა მნიშვნელოვანი დაფინანსება მოიზიდა ევროპელი ინვესტორებისგან.",
    url: "https://example.com/georgian-startups",
    urlToImage: "https://placehold.co/600x400?text=Tech+News",
    publishedAt: "2023-04-07T10:45:00Z",
    content: "ქართული ტექნოლოგიური სტარტაპები სულ უფრო მეტ ყურადღებას იპყრობენ..."
  },
  {
    id: 4,
    source: { 
      id: "sample-4", 
      name: "სპორტული ამბები" 
    },
    author: "ლევან ჯავახიშვილი",
    title: "საქართველოს ნაკრებმა მნიშვნელოვანი გამარჯვება მოიპოვა",
    description: "საქართველოს ფეხბურთის ნაკრებმა მეგობრულ მატჩში ძლიერი მეტოქე დაამარცხა.",
    url: "https://example.com/georgia-wins",
    urlToImage: "https://placehold.co/600x400?text=Sports+News",
    publishedAt: "2023-04-06T19:20:00Z",
    content: "გუშინ გამართულ მატჩში საქართველოს ნაკრებმა შთამბეჭდავი თამაში აჩვენა..."
  },
  {
    id: 5,
    source: { 
      id: "sample-5", 
      name: "კულტურის ამბები" 
    },
    author: "თამარ მაისურაძე",
    title: "ქართული ფილმი საერთაშორისო ფესტივალის გამარჯვებული გახდა",
    description: "ახალგაზრდა ქართველი რეჟისორის ფილმმა პრესტიჟული ევროპული კინოფესტივალის მთავარი პრიზი მოიპოვა.",
    url: "https://example.com/georgian-film",
    urlToImage: "https://placehold.co/600x400?text=Culture+News",
    publishedAt: "2023-04-05T12:10:00Z",
    content: "ქართულმა ფილმმა საერთაშორისო ჟიურის მაღალი შეფასება დაიმსახურა..."
  }
];

// ახალი ამბების მიღება
app.get("/api/news", async (req, res) => {
  try {
    // მოცემული მოთხოვნის პარამეტრები
    const query = req.query.q || '';
    
    // მივიღოთ ყველა სიახლე ბაზიდან
    const allNews = await getAllNews();
    
    // თუ არის ძიების პარამეტრი, ვფილტრავთ სტატიებს
    let articles = allNews;
    if (query) {
      const lowercaseQuery = query.toString().toLowerCase();
      articles = allNews.filter(article => 
        article.title.toLowerCase().includes(lowercaseQuery) || 
        article.content.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    // გავფორმატოთ ბაზიდან მოსული სიახლეები წინა API-ს მსგავსი ფორმატით
    const formattedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      description: article.content.substring(0, 150) + '...',
      content: article.content,
      urlToImage: article.imageUrl || "",
      url: `/news/${article.id}`,
      publishedAt: article.createdAt.toString(),
      source: {
        name: "UniversalToolkit"
      }
    }));
    
    res.json({
      status: "ok",
      totalResults: formattedArticles.length,
      articles: formattedArticles
    });
  } catch (error) {
    console.error("Error fetching news data:", error);
    res.status(200).json({ 
      status: "error", 
      message: "Failed to fetch news data",
      totalResults: 0,
      articles: []
    });
  }
});

// კონკრეტული სიახლის მიღება
app.get("/api/news/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const article = await getNewsById(id);
    
    if (!article) {
      return res.status(404).json({ message: "News article not found" });
    }
    
    // გავფორმატოთ ბაზიდან მოსული სიახლე წინა API-ს მსგავსი ფორმატით
    const formattedArticle = {
      id: article.id,
      title: article.title,
      description: article.content.substring(0, 150) + '...',
      content: article.content,
      urlToImage: article.imageUrl || "",
      url: `/news/${article.id}`,
      publishedAt: article.createdAt.toString(),
      videoUrl: article.videoUrl || "",
      source: {
        name: "UniversalToolkit"
      }
    };
    
    res.json(formattedArticle);
  } catch (error) {
    console.error("Error fetching news article:", error);
    res.status(500).json({ message: "Failed to fetch news article" });
  }
});

// ახალი სიახლის დამატება
app.post("/api/news", async (req, res) => {
  try {
    const { title, content, urlToImage, videoUrl } = req.body;
    
    // შევქმნათ მონაცემთა ბაზისთვის სწორი ფორმატის ობიექტი
    const newsData = {
      title,
      content,
      imageUrl: urlToImage || "",
      videoUrl: videoUrl || ""
    };
    
    // შევინახოთ ახალი სიახლე ბაზაში
    const newNews = await createNews(newsData);
    
    // გავფორმატოთ პასუხი
    const formattedArticle = {
      id: newNews.id,
      title: newNews.title,
      description: newNews.content.substring(0, 150) + '...',
      content: newNews.content,
      urlToImage: newNews.imageUrl || "",
      url: `/news/${newNews.id}`,
      publishedAt: newNews.createdAt.toString(),
      videoUrl: newNews.videoUrl || "",
      source: {
        name: "UniversalToolkit"
      }
    };
    
    res.status(201).json(formattedArticle);
  } catch (error) {
    console.error("Error creating news article:", error);
    res.status(500).json({ message: "Failed to create news article" });
  }
});

// სიახლის განახლება
app.put("/api/news/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`Updating news article with ID: ${id}`);
    
    const { title, content, urlToImage, videoUrl } = req.body;
    
    // შევქმნათ მონაცემთა ბაზისთვის სწორი ფორმატის ობიექტი
    const newsData = {
      title,
      content,
      imageUrl: urlToImage || "",
      videoUrl: videoUrl || ""
    };
    
    // განვაახლოთ სიახლე ბაზაში
    const updatedNews = await updateNews(id, newsData);
    
    if (!updatedNews) {
      console.log(`Article with ID ${id} not found`);
      return res.status(404).json({ message: "News article not found" });
    }
    
    // გავფორმატოთ პასუხი
    const formattedArticle = {
      id: updatedNews.id,
      title: updatedNews.title,
      description: updatedNews.content.substring(0, 150) + '...',
      content: updatedNews.content,
      urlToImage: updatedNews.imageUrl || "",
      url: `/news/${updatedNews.id}`,
      publishedAt: updatedNews.createdAt.toString(),
      videoUrl: updatedNews.videoUrl || "",
      source: {
        name: "UniversalToolkit"
      }
    };
    
    console.log(`Article with ID ${id} successfully updated`);
    res.json(formattedArticle);
  } catch (error) {
    console.error("Error updating news article:", error);
    res.status(500).json({ message: "Failed to update news article" });
  }
});

// სიახლის წაშლა
app.delete("/api/news/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`Deleting news article with ID: ${id}`);
    
    // წავშალოთ სიახლე ბაზიდან
    await deleteNews(id);
    
    console.log(`Article with ID ${id} successfully deleted`);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting news article:", error);
    res.status(500).json({ message: "Failed to delete news article" });
  }
});
  
  app.get("/api/currency", async (req, res) => {
    try {
      const from = req.query.from || 'USD';
      const to = req.query.to || 'EUR';
      const amount = parseFloat(req.query.amount as string || '1');
      
      // ახალი API-ს გამოყენება exchangerate.host-ის საშუალებით, რომელიც ლარს (GEL) უჭერს მხარს
      // API KEY: 6dabbdc137c248539b87e127e8e7635c - მომხმარებლის მიერ მოწოდებული
      console.log(`Currency API request: from=${from}, to=${to}, amount=${amount}`);
      const apiKey = "6dabbdc137c248539b87e127e8e7635c";
      const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}&access_key=${apiKey}`;
      
      console.log(`Calling currency API: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`ExchangeRate API error: ${response.statusText}`);
      }
      
      const responseText = await response.text();
      console.log(`Currency API response length: ${responseText.length} bytes`);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }
      
      // შევამოწმოთ დავალიდურდა თუ არა მოთხოვნა
      if (!data.success) {
        throw new Error(`ExchangeRate API error: ${data.error?.info || 'Unknown error'}`);
      }
      
      // თუ კონვერტაცია ვერ მოხდა
      if (data.result === undefined) {
        throw new Error('Currency conversion failed');
      }
      
      // მოვამზადოთ პასუხი კლიენტისთვის ConversionResult ფორმატში
      const result = {
        success: true,
        query: {
          from: from,
          to: to,
          amount: amount
        },
        info: {
          rate: data.info?.rate || data.result / amount
        },
        date: data.date || new Date().toISOString().split('T')[0],
        result: data.result
      };
      
      console.log("Currency conversion result:", result);
      res.json(result);
    } catch (error) {
      console.error("Error fetching currency data:", error);
      res.status(200).json({ 
        success: false, 
        message: `Failed to fetch currency data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        query: {
          from: req.query.from || 'USD',
          to: req.query.to || 'EUR',
          amount: parseFloat(req.query.amount as string || '1')
        },
        info: { rate: 0 },
        date: new Date().toISOString().split('T')[0],
        result: 0
      });
    }
  });
  
  // TheMealDB API ინტეგრაცია რეცეპტებისთვის
  app.get("/api/recipes", async (req, res) => {
    try {
      const cuisine = req.query.cuisine || '';
      const query = req.query.q || '';
      const category = req.query.category || '';
      let url = '';
      
      // ძიება კატეგორიის მიხედვით
      if (category) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
      }
      // ძიება სამზარეულოს ტიპის მიხედვით
      else if (cuisine) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${cuisine}`;
      } 
      // ძიება სახელის მიხედვით
      else if (query) {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
      }
      // შემთხვევითი რეცეპტი
      else {
        url = 'https://www.themealdb.com/api/json/v1/1/random.php';
      }
      
      console.log(`Requesting recipes from: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`MealDB API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(200).json({ 
        meals: [],
        error: true,
        message: `Recipes unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });
  
  // მიიღეთ რეცეპტის დეტალები ID-ით
  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const mealId = req.params.id;
      const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
      
      console.log(`Requesting recipe details from: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`MealDB API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.meals || data.meals.length === 0) {
        throw new Error('Recipe not found');
      }
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      res.status(200).json({ 
        meals: [],
        error: true,
        message: `Recipe details unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });
  
  // მიიღეთ რეცეპტების კატეგორიების სია
  app.get("/api/recipe-categories", async (req, res) => {
    try {
      const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
      
      console.log(`Requesting recipe categories from: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`MealDB API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching recipe categories:", error);
      res.status(200).json({ 
        categories: [],
        error: true,
        message: `Recipe categories unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });
  
  // მიიღეთ სამზარეულოების (cuisines) სია
  app.get("/api/recipe-cuisines", async (req, res) => {
    try {
      const url = 'https://www.themealdb.com/api/json/v1/1/list.php?a=list';
      
      console.log(`Requesting cuisines from: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`MealDB API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching cuisines:", error);
      res.status(200).json({ 
        meals: [],
        error: true,
        message: `Cuisines unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });

  // ქართული რეცეპტები
  app.get("/api/georgian-recipes", async (req, res) => {
    try {
      console.log("მოთხოვნილია ქართული რეცეპტები");
      const recipes = await getAllGeorgianRecipes();
      console.log(`მოძიებულია ${recipes.length} რეცეპტი ბაზიდან`);
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching Georgian recipes:", error);
      res.status(500).json({ message: "Failed to fetch Georgian recipes" });
    }
  });
  
  app.get("/api/georgian-recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid recipe ID" });
      }
      
      console.log(`მოთხოვნილია ქართული რეცეპტი ID=${id}`);
      const recipe = await getGeorgianRecipeById(id);
      
      if (!recipe) {
        console.log(`რეცეპტი ID=${id} ვერ მოიძებნა`);
        return res.status(404).json({ message: "Georgian recipe not found" });
      }
      
      console.log(`რეცეპტი მოძიებულია: ${recipe.title}`);
      res.json(recipe);
    } catch (error) {
      console.error("Error fetching Georgian recipe:", error);
      res.status(500).json({ message: "Failed to fetch Georgian recipe" });
    }
  });
  
  app.post("/api/georgian-recipes", async (req, res) => {
    try {
      const { recipe, ingredients, steps } = req.body;
      
      console.log("ახალი რეცეპტის შექმნის მოთხოვნა:", { recipe, ingredients, steps });
      
      if (!recipe || !recipe.title) {
        console.log("რეცეპტი ვერ შეიქმნა: სათაური არ მოითითებულა");
        return res.status(400).json({ message: "Recipe title is required" });
      }

      const newRecipe = await createGeorgianRecipeWithDetails(
        recipe,
        ingredients || [],
        steps || []
      );
      
      console.log(`რეცეპტი წარმატებით შეიქმნა: ID=${newRecipe.id}, სათაური=${newRecipe.title}`);
      res.status(201).json(newRecipe);
    } catch (error) {
      console.error("Error creating Georgian recipe:", error);
      res.status(500).json({ message: "Failed to create Georgian recipe" });
    }
  });

  // რეცეპტის განახლება
  app.put("/api/georgian-recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { recipe, ingredients, steps } = req.body;
      
      if (!recipe || !recipe.title) {
        return res.status(400).json({ message: "Recipe title is required" });
      }

      const updatedRecipe = await updateGeorgianRecipeWithDetails(
        id,
        recipe,
        ingredients || [],
        steps || []
      );
      
      if (!updatedRecipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      res.json(updatedRecipe);
    } catch (error) {
      console.error("Error updating Georgian recipe:", error);
      res.status(500).json({ message: "Failed to update Georgian recipe" });
    }
  });

  // რეცეპტის წაშლა
  app.delete("/api/georgian-recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await deleteGeorgianRecipe(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting Georgian recipe:", error);
      res.status(500).json({ message: "Failed to delete Georgian recipe" });
    }
  });

  // ყველა ქართული რეცეპტის მიღება
  app.get("/api/georgian-recipes", async (req, res) => {
    try {
      console.log('მოთხოვნილია ყველა ქართული რეცეპტი');
      const recipes = await getAllGeorgianRecipes();
      console.log(`მოიძებნა ${recipes.length} რეცეპტი`);
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching Georgian recipes:", error);
      res.status(500).json({ message: "Failed to fetch Georgian recipes" });
    }
  });

  // ===== ამინდის გაფართოებული API-ები =====
  
  // Weather API საშუალებები
  const WEATHER_API_KEY = "04c70df2f49a49abb73124624250904"; // განახლებული API გასაღები (1000 მოთხოვნა დღეში)

  // 1. საათობრივი პროგნოზი 4 დღისთვის (96 საათი)
  app.get("/api/weather/hourly-forecast", async (req, res) => {
    try {
      const city = req.query.city || 'Tbilisi'; // Default to Tbilisi if no city provided
      
      // მოთხოვნა Weather API-სთან საათობრივი მონაცემებისთვის
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${city}&days=4&aqi=no&alerts=no`;
      
      console.log(`Requesting hourly forecast data from: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // ვიღებთ პროგნოზს და ვტრანსფორმირებთ ფორმატს
      const hourlyForecasts = data.forecast.forecastday.map((day: any) => {
        return {
          date: day.date,
          hours: day.hour.map((hour: any) => ({
            time: hour.time,
            temp_c: hour.temp_c,
            condition: {
              text: hour.condition.text,
              icon: hour.condition.icon.replace("//", "https://"),
              code: hour.condition.code
            },
            wind_kph: hour.wind_kph,
            wind_degree: hour.wind_degree,
            wind_dir: hour.wind_dir,
            pressure_mb: hour.pressure_mb,
            humidity: hour.humidity,
            chance_of_rain: hour.chance_of_rain,
            chance_of_snow: hour.chance_of_snow,
            will_it_rain: hour.will_it_rain,
            will_it_snow: hour.will_it_snow
          }))
        };
      });
      
      res.json({
        location: {
          name: data.location.name,
          region: data.location.region,
          country: data.location.country,
          lat: data.location.lat,
          lon: data.location.lon,
          localtime: data.location.localtime
        },
        forecast: hourlyForecasts
      });
    } catch (error) {
      console.error("Error fetching hourly forecast data:", error);
      res.status(200).json({ 
        error: true, 
        message: `Hourly forecast data unavailable: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  });

  // 2. 16 დღის დღიური პროგნოზი
  app.get("/api/weather/daily-forecast", async (req, res) => {
    try {
      const city = req.query.city || 'Tbilisi'; // Default to Tbilisi if no city provided
      const days = Math.min(parseInt(req.query.days as string || '14'), 14); // მაქსიმუმ 14 დღე (Weather API გვაძლევს მაქს. 14 დღეს)
      
      // მოთხოვნა Weather API-სთან დღიური მონაცემებისთვის
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${city}&days=${days}&aqi=no&alerts=no`;
      
      console.log(`Requesting daily forecast data from: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // ვტრანსფორმირებთ მხოლოდ დღიურ მონაცემებს
      const dailyForecasts = data.forecast.forecastday.map((day: any) => ({
        date: day.date,
        max_temp_c: day.day.maxtemp_c,
        min_temp_c: day.day.mintemp_c,
        avg_temp_c: day.day.avgtemp_c,
        condition: {
          text: day.day.condition.text,
          icon: day.day.condition.icon.replace("//", "https://"),
          code: day.day.condition.code
        },
        max_wind_kph: day.day.maxwind_kph,
        total_precip_mm: day.day.totalprecip_mm,
        avg_humidity: day.day.avghumidity,
        chance_of_rain: day.day.daily_chance_of_rain,
        chance_of_snow: day.day.daily_chance_of_snow,
        sunrise: day.astro.sunrise,
        sunset: day.astro.sunset
      }));
      
      res.json({
        location: {
          name: data.location.name,
          region: data.location.region,
          country: data.location.country,
          lat: data.location.lat,
          lon: data.location.lon,
          localtime: data.location.localtime
        },
        forecast: dailyForecasts
      });
    } catch (error) {
      console.error("Error fetching daily forecast data:", error);
      res.status(200).json({ 
        error: true, 
        message: `Daily forecast data unavailable: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  });

  // 3. კლიმატის პროგნოზი 30 დღისთვის (Weather API-ის შეზღუდვების გამო ვიყენებთ არსებულ 14-დღიან პროგნოზს)
  app.get("/api/weather/monthly-forecast", async (req, res) => {
    try {
      const city = req.query.city || 'Tbilisi'; // Default to Tbilisi if no city provided
      const days = 14; // WeatherAPI Free პაკეტი მაქსიმუმ 14 დღის პროგნოზს იძლევა
      
      // მოთხოვნა Weather API-სთან ყოველდღიური მონაცემებისთვის (მაქსიმუმ 14 დღე)
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${city}&days=${days}&aqi=no&alerts=no`;
      
      console.log(`Requesting monthly forecast data from: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // ვიღებთ ხელმისაწვდომ მონაცემებს
      const monthlyForecasts = data.forecast.forecastday.map((day: any) => ({
        date: day.date,
        max_temp_c: day.day.maxtemp_c,
        min_temp_c: day.day.mintemp_c,
        avg_temp_c: day.day.avgtemp_c,
        condition: {
          text: day.day.condition.text,
          icon: day.day.condition.icon.replace("//", "https://"),
          code: day.day.condition.code
        },
        max_wind_kph: day.day.maxwind_kph,
        total_precip_mm: day.day.totalprecip_mm,
        avg_humidity: day.day.avghumidity
      }));
      
      res.json({
        location: {
          name: data.location.name,
          region: data.location.region,
          country: data.location.country,
          lat: data.location.lat,
          lon: data.location.lon,
          localtime: data.location.localtime
        },
        forecast: monthlyForecasts,
        note: "შენიშვნა: WeatherAPI-ის უფასო პაკეტი მხოლოდ 14 დღის პროგნოზს იძლევა."
      });
    } catch (error) {
      console.error("Error fetching monthly forecast data:", error);
      res.status(200).json({ 
        error: true, 
        message: `Monthly forecast data unavailable: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  });

  // 4. ისტორიული ამინდის მონაცემები
  app.get("/api/weather/history", async (req, res) => {
    try {
      const city = req.query.city || 'Tbilisi'; // Default to Tbilisi if no city provided
      const date = req.query.date || new Date().toISOString().split('T')[0]; // Default to today
      
      // მოთხოვნა Weather API-სთან ისტორიული მონაცემებისთვის
      const url = `https://api.weatherapi.com/v1/history.json?key=${WEATHER_API_KEY}&q=${city}&dt=${date}`;
      
      console.log(`Requesting weather history data from: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // ვტრანსფორმირებთ ისტორიულ მონაცემებს
      const historyData = {
        date: data.forecast.forecastday[0].date,
        day: {
          max_temp_c: data.forecast.forecastday[0].day.maxtemp_c,
          min_temp_c: data.forecast.forecastday[0].day.mintemp_c,
          avg_temp_c: data.forecast.forecastday[0].day.avgtemp_c,
          condition: {
            text: data.forecast.forecastday[0].day.condition.text,
            icon: data.forecast.forecastday[0].day.condition.icon.replace("//", "https://"),
            code: data.forecast.forecastday[0].day.condition.code
          },
          max_wind_kph: data.forecast.forecastday[0].day.maxwind_kph,
          total_precip_mm: data.forecast.forecastday[0].day.totalprecip_mm,
          avg_humidity: data.forecast.forecastday[0].day.avghumidity
        },
        hours: data.forecast.forecastday[0].hour.map((hour: any) => ({
          time: hour.time,
          temp_c: hour.temp_c,
          condition: {
            text: hour.condition.text,
            icon: hour.condition.icon.replace("//", "https://"),
            code: hour.condition.code
          },
          wind_kph: hour.wind_kph,
          pressure_mb: hour.pressure_mb,
          humidity: hour.humidity,
          precip_mm: hour.precip_mm
        }))
      };
      
      res.json({
        location: {
          name: data.location.name,
          region: data.location.region,
          country: data.location.country,
          lat: data.location.lat,
          lon: data.location.lon,
          localtime: data.location.localtime
        },
        history: historyData
      });
    } catch (error) {
      console.error("Error fetching weather history data:", error);
      res.status(200).json({ 
        error: true, 
        message: `Weather history data unavailable: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  });

  return httpServer;
}

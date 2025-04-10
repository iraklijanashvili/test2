import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from "react-helmet-async";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import CalculatorPage from "@/pages/calculator";
import TimerPage from "@/pages/timer";
import CurrencyPage from "@/pages/currency";
import WeatherPage from "@/pages/weather";
import NewsPage from "@/pages/news";
import NewsManagerPage from "@/pages/newsManager";
import TutorialsPage from "@/pages/tutorials";
import RecipesPage from "@/pages/recipes";
import RecipeDetailPage from "@/pages/recipeDetail";
import RecipeAdminPage from "@/pages/recipeAdmin";
import RecipeManagerPage from "@/pages/recipeManager";
import TipsPage from "@/pages/tips";
import { AdminPanel } from "@/pages/AdminPanel";
import { RecipeForm, NewsForm } from "@/pages/EditForms";
import TutorialManagerPage from "@/pages/tutorialManager";
import TipManagerPage from "@/pages/tipManager";
import HoroscopeDetailPage from "@/pages/horoscopeDetail";
import Horoscope from "@/components/content/Horoscope";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/recipe-manager" component={RecipeManagerPage} />
      <Route path="/calculator" component={CalculatorPage} />
      <Route path="/timer" component={TimerPage} />
      <Route path="/currency" component={CurrencyPage} />
      <Route path="/weather" component={WeatherPage} />
      <Route path="/news" component={NewsPage} />
      <Route path="/news-manager" component={NewsManagerPage} />
      <Route path="/tutorials" component={TutorialsPage} />
      <Route path="/recipes" component={RecipesPage} />
      <Route path="/recipe/:id" component={RecipeDetailPage} />
      <Route path="/recipe-admin" component={RecipeAdminPage} />
      <Route path="/recipe-edit/:id" component={RecipeAdminPage} />
      <Route path="/tips" component={TipsPage} />
      <Route path="/horoscope" component={Horoscope} />
      <Route path="/horoscope/:sign" component={HoroscopeDetailPage} />
      {/* ადმინისტრატორის მარშრუტები */}
      <Route path="/iraklijanashvili" component={AdminPanel} />
      <Route path="/iraklijanashvili/recipe/:id" component={RecipeForm} />
      <Route path="/iraklijanashvili/news/:id" component={NewsForm} />
      <Route path="/iraklijanashvili/tutorial/:id" component={TutorialManagerPage} />
      <Route path="/iraklijanashvili/tip/:id" component={TipManagerPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;

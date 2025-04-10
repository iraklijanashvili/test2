import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Sun, Cloud, CloudRain, CloudSnow, CloudFog, Wind, CloudOff, 
  Thermometer, Droplets, Gauge, RefreshCw, CloudLightning, Sunrise, 
  Sunset, Calendar, Clock, History, ArrowDownAZ
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, subDays } from "date-fns";
import { ka } from "date-fns/locale";

// საქართველოს ქალაქის ინტერფეისი
interface GeorgiaCity {
  id: string;
  name: string;
  apiName: string;
}

// ამინდის მონაცემების ინტერფეისი
interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
  error?: boolean;
  message?: string;
}

// ქალაქის ინტერფეისი ამინდის მონაცემებით
interface CityWeather {
  id: string;
  name: string;
  apiName: string;
  weather: WeatherData;
}

// ამინდის პროგნოზის ინტერფეისი
interface HourlyForecast {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  forecast: {
    date: string;
    hours: {
      time: string;
      temp_c: number;
      condition: {
        text: string;
        icon: string;
        code: number;
      };
      wind_kph: number;
      wind_degree: number;
      wind_dir: string;
      pressure_mb: number;
      humidity: number;
      chance_of_rain: number;
      chance_of_snow: number;
      will_it_rain: number;
      will_it_snow: number;
    }[];
  }[];
  error?: boolean;
  message?: string;
}

// დღიური პროგნოზის ინტერფეისი
interface DailyForecast {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  forecast: {
    date: string;
    max_temp_c: number;
    min_temp_c: number;
    avg_temp_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    max_wind_kph: number;
    total_precip_mm: number;
    avg_humidity: number;
    chance_of_rain: number;
    chance_of_snow: number;
    sunrise: string;
    sunset: string;
  }[];
  error?: boolean;
  message?: string;
}

// ამინდის ისტორიის ინტერფეისი
interface WeatherHistory {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  history: {
    date: string;
    day: {
      max_temp_c: number;
      min_temp_c: number;
      avg_temp_c: number;
      condition: {
        text: string;
        icon: string;
        code: number;
      };
      max_wind_kph: number;
      total_precip_mm: number;
      avg_humidity: number;
    };
    hours: {
      time: string;
      temp_c: number;
      condition: {
        text: string;
        icon: string;
        code: number;
      };
      wind_kph: number;
      pressure_mb: number;
      humidity: number;
      precip_mm: number;
    }[];
  };
  error?: boolean;
  message?: string;
}

export default function WeatherExtended() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("current");
  const [selectedCity, setSelectedCity] = useState<string>("Tbilisi");
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  
  // ქალაქების მისაღებად
  const {
    data: georgiaCities,
    isLoading: isLoadingCities,
    error: citiesError,
  } = useQuery<GeorgiaCity[]>({
    queryKey: ["/api/georgia-cities"],
    queryFn: async () => {
      const response = await fetch("/api/georgia-cities");
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 საათი
  });

  // მიმდინარე ამინდი
  const {
    data: currentWeather,
    isLoading: isLoadingCurrent,
    error: currentError,
    refetch: refetchCurrent,
  } = useQuery<WeatherData>({
    queryKey: ["/api/weather", selectedCity],
    queryFn: async () => {
      const response = await fetch(`/api/weather?city=${selectedCity}`);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    staleTime: 30 * 60 * 1000, // 30 წუთი
    enabled: !!selectedCity,
  });

  // საათობრივი პროგნოზი 4 დღე (96 საათი)
  const {
    data: hourlyForecast,
    isLoading: isLoadingHourly,
    error: hourlyError,
    refetch: refetchHourly,
  } = useQuery<HourlyForecast>({
    queryKey: ["/api/weather/hourly-forecast", selectedCity],
    queryFn: async () => {
      try {
        console.log(`Fetching hourly forecast for ${selectedCity}`);
        const response = await fetch(`/api/weather/hourly-forecast?city=${selectedCity}`);
        
        console.log(`Hourly forecast response status: ${response.status}`);
        const data = await response.json();
        console.log("Hourly forecast data loaded successfully");
        
        return data;
      } catch (err) {
        console.error("Error fetching hourly forecast:", err);
        throw new Error(`Network response error: ${err instanceof Error ? err.message : String(err)}`);
      }
    },
    staleTime: 60 * 60 * 1000, // 1 საათი
    enabled: selectedTab === "hourly" && !!selectedCity,
    retry: 2,
  });

  // 16 დღის პროგნოზი
  const {
    data: dailyForecast,
    isLoading: isLoadingDaily,
    error: dailyError,
    refetch: refetchDaily,
  } = useQuery<DailyForecast>({
    queryKey: ["/api/weather/daily-forecast", selectedCity],
    queryFn: async () => {
      try {
        console.log(`Fetching daily forecast for ${selectedCity}`);
        const response = await fetch(`/api/weather/daily-forecast?city=${selectedCity}`);
        
        console.log(`Daily forecast response status: ${response.status}`);
        const data = await response.json();
        console.log("Daily forecast data loaded successfully");
        
        return data;
      } catch (err) {
        console.error("Error fetching daily forecast:", err);
        throw new Error(`Network response error: ${err instanceof Error ? err.message : String(err)}`);
      }
    },
    staleTime: 6 * 60 * 60 * 1000, // 6 საათი
    enabled: selectedTab === "daily" && !!selectedCity,
    retry: 2,
  });

  // ამინდის ისტორია
  const {
    data: weatherHistory,
    isLoading: isLoadingHistory,
    error: historyError,
    refetch: refetchHistory,
  } = useQuery<WeatherHistory>({
    queryKey: ["/api/weather/history", selectedCity, selectedHistoryDate],
    queryFn: async () => {
      try {
        console.log(`Fetching weather history for ${selectedCity} on ${selectedHistoryDate}`);
        const response = await fetch(`/api/weather/history?city=${selectedCity}&date=${selectedHistoryDate}`);
        
        console.log(`Weather history response status: ${response.status}`);
        const data = await response.json();
        console.log("Weather history data loaded successfully");
        
        return data;
      } catch (err) {
        console.error("Error fetching weather history:", err);
        throw new Error(`Network response error: ${err instanceof Error ? err.message : String(err)}`);
      }
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 საათი (ისტორიული მონაცემები არ იცვლება)
    enabled: selectedTab === "history" && !!selectedCity && !!selectedHistoryDate,
    retry: 2,
  });

  // არჩეული ქალაქის შეცვლა
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    
    // თუ ამინდის ისტორია არის არჩეული, დავარესეტოთ თარიღიც
    if (selectedTab === "history") {
      setSelectedHistoryDate(format(new Date(), "yyyy-MM-dd"));
    }
  };

  // შესაბამისი მონაცემების განახლება
  const handleRefresh = () => {
    switch (selectedTab) {
      case "current":
        refetchCurrent();
        break;
      case "hourly":
        refetchHourly();
        break;
      case "daily":
        refetchDaily();
        break;
      case "history":
        refetchHistory();
        break;
    }
    
    toast({
      title: "განახლება",
      description: "ამინდის მონაცემების განახლება დაიწყო",
    });
  };

  // ამინდის ხატულას გამოსახვა კოდის მიხედვით
  const renderWeatherIcon = (code: number) => {
    // ხატულების კოდების მიხედვით (ეს არის მიახლოებითი და შეიძლება მოითხოვოს დაზუსტება)
    if (code >= 200 && code < 300) return <CloudLightning size={24} className="text-yellow-500" />;
    if (code >= 300 && code < 400) return <CloudRain size={24} className="text-blue-400" />;
    if (code >= 500 && code < 600) return <CloudRain size={24} className="text-blue-500" />;
    if (code >= 600 && code < 700) return <CloudSnow size={24} className="text-blue-200" />;
    if (code >= 700 && code < 800) return <CloudFog size={24} className="text-gray-400" />;
    if (code === 800) return <Sun size={24} className="text-yellow-500" />;
    if (code > 800) return <Cloud size={24} className="text-gray-400" />;
    return <CloudOff size={24} className="text-gray-500" />;
  };

  // დროის ფორმატირება
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return format(date, "HH:mm");
  };

  // თარიღის ფორმატირება
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMM yyyy", { locale: ka });
  };

  // საათობრივი პროგნოზის რენდერი
  const renderHourlyForecast = () => {
    if (isLoadingHourly) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="mb-3">
              <CardContent className="p-4">
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <Skeleton key={j} className="h-20 w-full" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (hourlyError || !hourlyForecast || hourlyForecast.error) {
      return (
        <Card className="mb-3">
          <CardContent className="p-4 flex flex-col items-center justify-center min-h-[200px]">
            <CloudOff size={48} className="text-gray-400 mb-2" />
            <h3 className="text-xl font-medium text-gray-700">
              საათობრივი პროგნოზის მიღება ვერ მოხერხდა
            </h3>
            <p className="text-gray-500 mt-1 text-center">
              {hourlyForecast?.message || "გთხოვთ, სცადოთ მოგვიანებით"}
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {hourlyForecast.forecast.map((day) => (
          <Card key={day.date} className="mb-3">
            <CardHeader className="py-3">
              <CardTitle className="text-lg font-medium">
                {formatDate(day.date)}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex p-4 space-x-4">
                  {day.hours.map((hour) => (
                    <div 
                      key={hour.time} 
                      className="flex flex-col items-center justify-center rounded-md border p-3 w-[100px] shrink-0"
                    >
                      <span className="text-sm font-medium mb-1">{formatTime(hour.time)}</span>
                      {hour.condition.icon ? (
                        <img 
                          src={hour.condition.icon} 
                          alt={hour.condition.text} 
                          className="w-12 h-12 my-1"
                        />
                      ) : (
                        renderWeatherIcon(hour.condition.code)
                      )}
                      <span className="text-xl font-bold">{Math.round(hour.temp_c)}°</span>
                      <span className="text-xs text-gray-500 mt-1">{hour.condition.text}</span>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Droplets size={12} className="mr-1" />
                        <span>{hour.humidity}%</span>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Wind size={12} className="mr-1" />
                        <span>{Math.round(hour.wind_kph)} კმ/სთ</span>
                      </div>
                      {hour.chance_of_rain > 0 && (
                        <Badge variant="outline" className="mt-2 text-blue-500">
                          <CloudRain size={12} className="mr-1" />
                          {hour.chance_of_rain}%
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // დღიური პროგნოზის რენდერი
  const renderDailyForecast = () => {
    if (isLoadingDaily) {
      return (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      );
    }

    if (dailyError || !dailyForecast || dailyForecast.error) {
      return (
        <Card className="mb-3">
          <CardContent className="p-4 flex flex-col items-center justify-center min-h-[200px]">
            <CloudOff size={48} className="text-gray-400 mb-2" />
            <h3 className="text-xl font-medium text-gray-700">
              დღიური პროგნოზის მიღება ვერ მოხერხდა
            </h3>
            <p className="text-gray-500 mt-1 text-center">
              {dailyForecast?.message || "გთხოვთ, სცადოთ მოგვიანებით"}
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {dailyForecast.forecast.map((day) => (
          <Card key={day.date} className="mb-3">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap">
                <div className="flex items-center space-x-4">
                  {day.condition.icon ? (
                    <img 
                      src={day.condition.icon} 
                      alt={day.condition.text} 
                      className="w-14 h-14"
                    />
                  ) : (
                    <div className="w-14 h-14 flex items-center justify-center">
                      {renderWeatherIcon(day.condition.code)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-medium">{formatDate(day.date)}</h3>
                    <p className="text-gray-600">{day.condition.text}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">{Math.round(day.max_temp_c)}°</span>
                  <span className="text-gray-500">/ {Math.round(day.min_temp_c)}°</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                <div className="flex items-center space-x-2">
                  <Sunrise size={16} className="text-orange-500" />
                  <span className="text-sm">{day.sunrise}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sunset size={16} className="text-purple-500" />
                  <span className="text-sm">{day.sunset}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplets size={16} className="text-blue-500" />
                  <span className="text-sm">{day.avg_humidity}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wind size={16} className="text-gray-500" />
                  <span className="text-sm">{Math.round(day.max_wind_kph)} კმ/სთ</span>
                </div>
              </div>
              
              {(day.chance_of_rain > 0 || day.chance_of_snow > 0) && (
                <div className="mt-3 flex space-x-2">
                  {day.chance_of_rain > 0 && (
                    <Badge variant="outline" className="text-blue-500">
                      <CloudRain size={14} className="mr-1" />
                      ნალექი {day.chance_of_rain}%
                    </Badge>
                  )}
                  {day.chance_of_snow > 0 && (
                    <Badge variant="outline" className="text-blue-300">
                      <CloudSnow size={14} className="mr-1" />
                      თოვლი {day.chance_of_snow}%
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // ამინდის ისტორიის რენდერი
  const renderWeatherHistory = () => {
    if (isLoadingHistory) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      );
    }

    if (historyError || !weatherHistory || weatherHistory.error) {
      return (
        <Card className="mb-3">
          <CardContent className="p-4 flex flex-col items-center justify-center min-h-[200px]">
            <CloudOff size={48} className="text-gray-400 mb-2" />
            <h3 className="text-xl font-medium text-gray-700">
              ისტორიული ამინდის მიღება ვერ მოხერხდა
            </h3>
            <p className="text-gray-500 mt-1 text-center">
              {weatherHistory?.message || "გთხოვთ, სცადოთ მოგვიანებით"}
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>
              {weatherHistory.location.name}, {formatDate(weatherHistory.history.date)}
            </CardTitle>
            <CardDescription>
              დღის საშუალო ტემპერატურა: {Math.round(weatherHistory.history.day.avg_temp_c)}°C
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center justify-center p-3 border rounded-md">
                <Thermometer size={20} className="text-red-500 mb-1" />
                <div className="text-2xl font-bold">{Math.round(weatherHistory.history.day.max_temp_c)}°</div>
                <div className="text-xs text-gray-500">მაქსიმუმი</div>
              </div>
              
              <div className="flex flex-col items-center justify-center p-3 border rounded-md">
                <Thermometer size={20} className="text-blue-500 mb-1" />
                <div className="text-2xl font-bold">{Math.round(weatherHistory.history.day.min_temp_c)}°</div>
                <div className="text-xs text-gray-500">მინიმუმი</div>
              </div>
              
              <div className="flex flex-col items-center justify-center p-3 border rounded-md">
                <Droplets size={20} className="text-blue-400 mb-1" />
                <div className="text-2xl font-bold">{weatherHistory.history.day.avg_humidity}%</div>
                <div className="text-xs text-gray-500">ტენიანობა</div>
              </div>
              
              <div className="flex flex-col items-center justify-center p-3 border rounded-md">
                <Wind size={20} className="text-gray-500 mb-1" />
                <div className="text-2xl font-bold">{Math.round(weatherHistory.history.day.max_wind_kph)}</div>
                <div className="text-xs text-gray-500">ქარი კმ/სთ</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>საათობრივი მონაცემები</CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex p-4 space-x-4">
                {weatherHistory.history.hours.map((hour) => (
                  <div 
                    key={hour.time} 
                    className="flex flex-col items-center justify-center rounded-md border p-3 w-[100px] shrink-0"
                  >
                    <span className="text-sm font-medium mb-1">{formatTime(hour.time)}</span>
                    {hour.condition.icon ? (
                      <img 
                        src={hour.condition.icon} 
                        alt={hour.condition.text} 
                        className="w-12 h-12 my-1"
                      />
                    ) : (
                      renderWeatherIcon(hour.condition.code)
                    )}
                    <span className="text-xl font-bold">{Math.round(hour.temp_c)}°</span>
                    <span className="text-xs text-gray-500 mt-1">{hour.condition.text}</span>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Droplets size={12} className="mr-1" />
                      <span>{hour.humidity}%</span>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Wind size={12} className="mr-1" />
                      <span>{Math.round(hour.wind_kph)} კმ/სთ</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  };

  // მიმდინარე ამინდის რენდერი
  const renderCurrentWeather = () => {
    if (isLoadingCurrent) {
      return (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-16 w-32" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (currentError || !currentWeather) {
      return (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
            <CloudOff size={48} className="text-gray-400 mb-2" />
            <h3 className="text-xl font-medium text-gray-700">
              ამინდის მონაცემების მიღება ვერ მოხერხდა
            </h3>
            <p className="text-gray-500 mt-1 text-center">
              გთხოვთ, სცადოთ მოგვიანებით
            </p>
          </CardContent>
        </Card>
      );
    }

    // Handling error field if it exists
    if ('error' in currentWeather && currentWeather.error) {
      return (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
            <CloudOff size={48} className="text-gray-400 mb-2" />
            <h3 className="text-xl font-medium text-gray-700">
              ამინდის მონაცემების მიღება ვერ მოხერხდა
            </h3>
            <p className="text-gray-500 mt-1 text-center">
              {'message' in currentWeather ? currentWeather.message : "გთხოვთ, სცადოთ მოგვიანებით"}
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {currentWeather.name}, {currentWeather.sys.country}
              </h2>
              <p className="text-gray-500 mb-2">
                {new Date().toLocaleDateString("ka-GE", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
              
              <div className="flex items-center mb-4">
                {currentWeather.weather[0]?.icon ? (
                  <img 
                    src={currentWeather.weather[0].icon} 
                    alt={currentWeather.weather[0].description} 
                    className="w-16 h-16 mr-3"
                  />
                ) : (
                  <div className="w-16 h-16 mr-3 flex items-center justify-center">
                    {renderWeatherIcon(currentWeather.weather[0]?.id || 800)}
                  </div>
                )}
                <div>
                  <div className="text-4xl font-bold">{Math.round(currentWeather.main.temp)}°C</div>
                  <div className="text-gray-600">{currentWeather.weather[0]?.description || "ამინდი"}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Thermometer size={20} className="text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">იგრძნობა როგორც</div>
                    <div className="font-medium">{Math.round(currentWeather.main.feels_like)}°C</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Droplets size={20} className="text-blue-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">ტენიანობა</div>
                    <div className="font-medium">{currentWeather.main.humidity}%</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Wind size={20} className="text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">ქარი</div>
                    <div className="font-medium">{Math.round(currentWeather.wind.speed)} კმ/სთ</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Gauge size={20} className="text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">წნევა</div>
                    <div className="font-medium">{currentWeather.main.pressure} ჰპა</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ისტორიული თარიღების გენერირება (ბოლო 7 დღე)
  const generateHistoryDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = subDays(today, i);
      dates.push({
        value: format(date, "yyyy-MM-dd"),
        label: format(date, "d MMM yyyy", { locale: ka })
      });
    }
    
    return dates;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex-1">
          <Select onValueChange={handleCityChange} value={selectedCity}>
            <SelectTrigger>
              <SelectValue placeholder="აირჩიეთ ქალაქი" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingCities ? (
                <SelectItem value="loading" disabled>
                  იტვირთება...
                </SelectItem>
              ) : georgiaCities && Array.isArray(georgiaCities) && georgiaCities.length > 0 ? (
                georgiaCities.map((city: GeorgiaCity) => (
                  <SelectItem key={city.id} value={city.apiName}>
                    {city.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="tbilisi">თბილისი</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        {selectedTab === "history" && (
          <div className="flex-1">
            <Select 
              onValueChange={setSelectedHistoryDate} 
              value={selectedHistoryDate}
            >
              <SelectTrigger>
                <SelectValue placeholder="აირჩიეთ თარიღი" />
              </SelectTrigger>
              <SelectContent>
                {generateHistoryDates().map((date) => (
                  <SelectItem key={date.value} value={date.value}>
                    {date.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <Button 
          onClick={handleRefresh}
          variant="outline"
          className="shrink-0"
        >
          <RefreshCw size={16} className="mr-2" />
          განახლება
        </Button>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="current">
            <Thermometer size={16} className="mr-2" />
            <span className="hidden sm:inline">მიმდინარე</span>
          </TabsTrigger>
          <TabsTrigger value="hourly">
            <Clock size={16} className="mr-2" />
            <span className="hidden sm:inline">საათობრივი</span>
          </TabsTrigger>
          <TabsTrigger value="daily">
            <Calendar size={16} className="mr-2" />
            <span className="hidden sm:inline">დღიური</span>
          </TabsTrigger>
          <TabsTrigger value="history">
            <History size={16} className="mr-2" />
            <span className="hidden sm:inline">ისტორია</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="mt-0">
          {renderCurrentWeather()}
        </TabsContent>
        
        <TabsContent value="hourly" className="mt-0">
          {renderHourlyForecast()}
        </TabsContent>
        
        <TabsContent value="daily" className="mt-0">
          {renderDailyForecast()}
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          {renderWeatherHistory()}
        </TabsContent>
      </Tabs>
      
    </div>
  );
}
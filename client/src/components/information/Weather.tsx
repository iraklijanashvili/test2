import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Sun, Cloud, CloudRain, CloudSnow, CloudFog, Wind, CloudOff, 
  Thermometer, Droplets, Gauge, RefreshCw, CloudLightning, Sunrise, Sunset 
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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

export default function Weather() {
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // ქალაქების სიის მიღება
  const { data: cities } = useQuery<GeorgiaCity[]>({
    queryKey: ['/api/georgia-cities'],
  });

  // ყველა ქალაქის ამინდის მიღება
  const {
    data: allCitiesData,
    isLoading,
    isError,
    refetch
  } = useQuery<CityWeather[]>({
    queryKey: ['/api/weather-all'],
  });

  // ცვლილების დამუშავება და ამინდის განახლება
  const handleRefresh = async () => {
    try {
      await refetch();
      setLastUpdate(new Date());
      toast({
        title: "ამინდი განახლდა",
        description: "ამინდის მონაცემები წარმატებით განახლდა ყველა ქალაქისთვის.",
      });
    } catch (error) {
      toast({
        title: "შეცდომა",
        description: "ამინდის მონაცემების განახლება ვერ მოხერხდა. გთხოვთ, სცადოთ მოგვიანებით.",
        variant: "destructive",
      });
    }
  };

  // წარმატებით მიღების შეტყობინება
  useEffect(() => {
    if (allCitiesData && allCitiesData.length > 0) {
      setLastUpdate(new Date());
    }
  }, [allCitiesData]);

  // ხატულების მიღება ამინდის კოდის მიხედვით
  // ამინდის აღწერების თარგმანები
  const weatherTranslations: { [key: string]: string } = {
    "Sunny": "მზიანი",
    "Partly cloudy": "ნაწილობრივ მოღრუბლული",
    "Cloudy": "ღრუბლიანი",
    "Overcast": "მოღრუბლული",
    "Mist": "ნისლიანი",
    "Patchy rain possible": "შესაძლოა წვიმა",
    "Patchy snow possible": "შესაძლოა თოვლი",
    "Patchy sleet possible": "შესაძლოა თოვლჭყაპი",
    "Patchy freezing drizzle possible": "შესაძლოა ყინულოვანი წვიმა",
    "Thundery outbreaks possible": "შესაძლოა ჭექა-ქუხილი",
    "Blowing snow": "თოვლის ქარბუქი",
    "Blizzard": "ქარბუქი",
    "Fog": "ნისლი",
    "Freezing fog": "ყინულოვანი ნისლი",
    "Light drizzle": "სუსტი წვიმა",
    "Freezing drizzle": "ყინულოვანი წვიმა",
    "Heavy freezing drizzle": "ძლიერი ყინულოვანი წვიმა",
    "Light rain": "სუსტი წვიმა",
    "Moderate rain": "ზომიერი წვიმა",
    "Heavy rain": "ძლიერი წვიმა",
    "Light freezing rain": "სუსტი ყინულოვანი წვიმა",
    "Moderate or heavy freezing rain": "ზომიერი ან ძლიერი ყინულოვანი წვიმა",
    "Light sleet": "სუსტი თოვლჭყაპი",
    "Moderate or heavy sleet": "ზომიერი ან ძლიერი თოვლჭყაპი",
    "Light snow": "სუსტი თოვლი",
    "Moderate snow": "ზომიერი თოვლი",
    "Heavy snow": "ძლიერი თოვლი",
    "Ice pellets": "სეტყვა",
    "Torrential rain shower": "ძლიერი წვიმა",
    "Light sleet showers": "სუსტი თოვლჭყაპი",
    "Moderate or heavy sleet showers": "ზომიერი ან ძლიერი თოვლჭყაპი",
    "Light snow showers": "სუსტი თოვლი",
    "Moderate or heavy snow showers": "ზომიერი ან ძლიერი თოვლი",
    "Light showers of ice pellets": "სუსტი სეტყვა",
    "Moderate or heavy showers of ice pellets": "ზომიერი ან ძლიერი სეტყვა",
    "Patchy light rain with thunder": "სუსტი წვიმა ჭექა-ქუხილით",
    "Moderate or heavy rain with thunder": "ზომიერი ან ძლიერი წვიმა ჭექა-ქუხილით",
    "Patchy light snow with thunder": "სუსტი თოვლი ჭექა-ქუხილით",
    "Moderate or heavy snow with thunder": "ზომიერი ან ძლიერი თოვლი ჭექა-ქუხილით",
    "Clear": "მზიანი",
    "Light rain shower": "სუსტი წვიმის ნაკადი",
    "Patchy rain nearby": "წვიმა მოახლოებულ ტერიტორიაზე"
  };

  const getWeatherIcon = (weatherId?: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeMap = {
      sm: "h-6 w-6",
      md: "h-10 w-10",
      lg: "h-16 w-16"
    };

    const iconClasses = sizeMap[size];

    if (!weatherId) return <Sun className={`${iconClasses} text-amber-500`} />;

    // Weather condition codes
    if (weatherId >= 200 && weatherId < 300) return <CloudLightning className={`${iconClasses} text-gray-500`} />; // Thunderstorm
    if (weatherId >= 300 && weatherId < 400) return <CloudRain className={`${iconClasses} text-blue-300`} />; // Drizzle
    if (weatherId >= 500 && weatherId < 600) return <CloudRain className={`${iconClasses} text-blue-500`} />; // Rain
    if (weatherId >= 600 && weatherId < 700) return <CloudSnow className={`${iconClasses} text-blue-200`} />; // Snow
    if (weatherId >= 700 && weatherId < 800) return <CloudFog className={`${iconClasses} text-gray-400`} />; // Atmosphere (fog, mist)
    if (weatherId === 800) return <Sun className={`${iconClasses} text-amber-500`} />; // Clear
    if (weatherId > 800) return <Cloud className={`${iconClasses} text-gray-400`} />; // Clouds

    return <Sun className={`${iconClasses} text-amber-500`} />;
  };

  // თარიღის ფორმატი
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('ka-GE', options);
  };

  // ამინდის ბარათი თითოეული ქალაქისთვის
  const renderWeatherCard = (cityWeather: CityWeather) => {
    const data = cityWeather.weather;

    if (data.error) {
      return (
        <Card className="rounded-lg overflow-hidden border-gray-200 shadow-sm" key={cityWeather.id}>
          <div className="bg-red-50 p-3">
            <h4 className="font-medium text-lg">{cityWeather.name}</h4>
            <p className="text-red-500 text-sm mt-1">მონაცემები ვერ მოიძებნა</p>
          </div>
        </Card>
      );
    }

    return (
      <Card className="rounded-lg overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200" key={cityWeather.id}>
        <div className="bg-gradient-to-br from-blue-50 to-white">
          <div className="p-3 flex items-start justify-between">
            <div>
              <div className="flex items-center">
                <h4 className="font-semibold text-lg">{cityWeather.name}</h4>
                <Badge variant="outline" className="ml-2 font-normal text-xs bg-white/40">
                  {data.sys.country}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-0.5">
                {weatherTranslations[data.weather[0]?.description] || data.weather[0]?.description || "უცნობი"}
              </p>
            </div>
            <div className="text-3xl font-bold text-primary flex items-center">
              {Math.round(data.main.temp)}°
            </div>
          </div>

          <div className="p-3 pt-0 flex items-center justify-between gap-2">
            <div className="flex gap-3 items-center">
              {data.weather && data.weather[0] && data.weather[0].icon ? (
                <img 
                  src={data.weather[0].icon.startsWith('http') ? data.weather[0].icon : `https:${data.weather[0].icon}`} 
                  alt={data.weather[0].description || "ამინდის პიქტოგრამა"} 
                  className="h-14 w-14" 
                />
              ) : (
                getWeatherIcon(data.weather && data.weather[0] ? data.weather[0].id : undefined, 'md')
              )}

              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1 text-sm text-gray-600 min-w-[120px]">
                  <Thermometer className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">შეგრძნებით {Math.round(data.main.feels_like)}°</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 min-w-[100px]">
                  <Wind className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">ქარი {data.wind.speed} კმ/სთ</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 min-w-[100px]">
                  <Droplets className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">ტენიანობა {data.main.humidity}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // ჩატვირთვის ბარათი
  const renderSkeletonCard = (index: number) => (
    <Card className="rounded-lg overflow-hidden border-gray-200" key={`skeleton-${index}`}>
      <div className="p-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 w-12 rounded-md" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-18" />
          </div>
        </div>
      </div>
    </Card>
  );

  // შეცდომის შემთხვევაში
  if (isError) {
    return (
      <Card className="border shadow-md">
        <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            <h3 className="text-lg font-semibold">საქართველოს ამინდი</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="bg-white text-gray-800 hover:bg-gray-100"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            განახლება
          </Button>
        </div>
        <CardContent className="p-4">
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <div className="flex justify-center mb-3">
              <CloudOff className="h-14 w-14 text-red-500" />
            </div>
            <p className="text-red-600 mb-2 font-semibold text-lg">ამინდის მონაცემების ჩატვირთვა ვერ მოხერხდა</p>
            <p className="text-gray-600 text-sm max-w-md mx-auto mb-4">
              არ მოხერხდა ამინდის მონაცემების მიღება. გთხოვთ, შეამოწმოთ ინტერნეტთან კავშირი 
              და სცადოთ მოგვიანებით.
            </p>
            <Button 
              onClick={handleRefresh}
              className="bg-primary hover:bg-indigo-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              ხელახლა ცდა
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-md">
      <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          <h3 className="text-lg font-semibold">საქართველოს ამინდი</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          className="bg-white text-gray-800 hover:bg-gray-100"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-1"></div>
              ჩატვირთვა...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-1" />
              განახლება
            </>
          )}
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h4 className="font-medium text-lg mb-1">ამინდი საქართველოს ქალაქებში</h4>
            <p className="text-gray-500 text-sm">
              ბოლო განახლება: {formatDate(lastUpdate)}
            </p>
          </div>
        </div>

        <ScrollArea className="h-[680px] pr-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              // სქელეტონები ჩატვირთვისას
              Array.from({ length: 10 }).map((_, index) => renderSkeletonCard(index))
            ) : allCitiesData && allCitiesData.length > 0 ? (
              // ამინდის ბარათები
              allCitiesData.map(cityWeather => renderWeatherCard(cityWeather))
            ) : (
              // ცარიელი მდგომარეობა
              <div className="col-span-full text-center p-6 bg-gray-50 rounded-lg">
                <div className="flex justify-center mb-3">
                  <CloudOff className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-2 font-medium">ამინდის მონაცემები არ არის ხელმისაწვდომი</p>
                <p className="text-gray-500 text-sm mb-4">დააჭირეთ განახლების ღილაკს ამინდის მონაცემების მისაღებად</p>
                <Button 
                  onClick={handleRefresh}
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  განახლება
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* მთხოვნით მოშორებულია ამინდის მონაცემების წყაროს შესახებ მინიშნება */}
      </CardContent>
    </Card>
  );
}
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";

// ვალუტების მონაცემები
const CURRENCY_RATES = {
  USD: 2.7563,
  EUR: 3.0143,
  RUB: 0.0322,
  GEL: 1
};

// ვალუტების დროშები
const CURRENCY_FLAGS = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  RUB: "🇷🇺",
  GEL: "🇬🇪"
};

// ვალუტის ტიპი
type CurrencyCode = 'USD' | 'EUR' | 'RUB' | 'GEL';

export default function CurrencyConverter() {
  const [amounts, setAmounts] = useState<{ [key in CurrencyCode]: string }>({
    USD: "1",
    EUR: "",
    RUB: "",
    GEL: ""
  });
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleString());
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>("USD");
  const { toast } = useToast();

  // ვალუტების კურსები
  const [rates] = useState<{ [key in CurrencyCode]: number }>(CURRENCY_RATES);

  // კონვერტაციის ფუნქცია ვალუტებს შორის
  const convertCurrency = (amount: number, from: CurrencyCode, to: CurrencyCode): number => {
    // ჯერ გადავიყვანოთ ლარში
    const amountInGEL = from === 'GEL' ? amount : amount * rates[from];
    // შემდეგ გადავიყვანოთ საჭირო ვალუტაში
    return to === 'GEL' ? amountInGEL : amountInGEL / rates[to];
  };

  // ველის შეცვლისას განხორციელება
  const handleAmountChange = (value: string, currency: CurrencyCode) => {
    // მხოლოდ რიცხვებისა და წერტილის დაშვება
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      // ახალი მნიშვნელობები
      const newAmounts = { ...amounts, [currency]: value };
      
      // თუ ველი ცარიელი არ არის, შევასრულოთ კონვერტაცია
      if (value !== "") {
        const amount = parseFloat(value);
        if (!isNaN(amount)) {
          // დავაფიქსიროთ აქტიური ვალუტა
          setActiveCurrency(currency);
          
          // გადავიყვანოთ ყველა სხვა ვალუტაში
          Object.keys(rates).forEach((otherCurrency) => {
            if (otherCurrency !== currency) {
              const converted = convertCurrency(amount, currency, otherCurrency as CurrencyCode);
              newAmounts[otherCurrency as CurrencyCode] = converted.toFixed(4);
            }
          });
        }
      } else {
        // თუ ველი ცარიელია, გავასუფთაოთ ყველა სხვა ველიც
        Object.keys(rates).forEach((otherCurrency) => {
          if (otherCurrency !== currency) {
            newAmounts[otherCurrency as CurrencyCode] = "";
          }
        });
      }
      
      setAmounts(newAmounts);
    }
  };

  const handleRefresh = () => {
    // დავაფიქსიროთ განახლების დრო
    setLastUpdated(new Date().toLocaleString());
    
    // თუ აქტიური ველი არ არის ცარიელი, ხელახლა გამოვითვალოთ მნიშვნელობები
    const activeAmount = amounts[activeCurrency];
    if (activeAmount && activeAmount !== "") {
      handleAmountChange(activeAmount, activeCurrency);
    }
    
    toast({
      title: "კურსი განახლდა",
      description: "ვალუტის კურსი წარმატებით განახლდა.",
    });
  };

  // ვალუტის ბარათის რენდერინგი
  const renderCurrencyCard = (currency: CurrencyCode, name: string) => {
    const isActive = activeCurrency === currency;
    
    return (
      <div className={`border ${isActive ? 'border-primary' : 'border-gray-200'} rounded-lg overflow-hidden transition-all`}>
        <div className="flex items-center">
          <div className="w-1/3 p-3 flex items-center font-medium border-r border-gray-200 bg-gray-50">
            <span className="mr-2 text-xl">{CURRENCY_FLAGS[currency]}</span>
            <span>{name}</span>
          </div>
          <div className="w-1/3 p-3 font-medium text-lg border-r border-gray-200 text-center">
            {rates[currency].toFixed(currency === 'GEL' ? 0 : 4)}
          </div>
          <div className="w-1/3 p-3">
            <Input
              type="text"
              value={amounts[currency]}
              onChange={(e) => handleAmountChange(e.target.value, currency)}
              onFocus={() => setActiveCurrency(currency)}
              className={`w-full text-center ${isActive ? 'border-primary' : ''}`}
              placeholder="0.0000"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-primary px-4 py-3 text-white flex justify-between items-center">
        <h3 className="text-lg font-semibold">ვალუტის კონვერტერი</h3>
        <div className="text-sm flex items-center gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>განახლებულია</span>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-4">
          {renderCurrencyCard("USD", "დოლარი")}
          {renderCurrencyCard("EUR", "ევრო")}
          {renderCurrencyCard("RUB", "რუბლი")}
          {renderCurrencyCard("GEL", "ლარი")}
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            ბოლო განახლება: {lastUpdated}
          </div>
          
          <Button
            onClick={handleRefresh}
            className="bg-primary/10 hover:bg-primary/20 text-primary flex items-center gap-1.5"
            variant="ghost"
          >
            <RefreshCw className="h-4 w-4" />
            განახლება
          </Button>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 border-t pt-4">
          <p>შეიყვანეთ რიცხვი ნებისმიერ ველში და ყველა დანარჩენი ავტომატურად გამოითვლება. 
          კურსები არის 2025 წლის 9 აპრილის მდგომარეობით.</p>
        </div>
      </CardContent>
    </Card>
  );
}

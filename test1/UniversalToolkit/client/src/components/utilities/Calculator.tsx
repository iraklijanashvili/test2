import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Calculator() {
  const [displayValue, setDisplayValue] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const handleNumberInput = (num: string) => {
    if (displayValue === "0" || shouldResetDisplay) {
      setDisplayValue(num);
      setShouldResetDisplay(false);
    } else {
      setDisplayValue(displayValue + num);
    }
  };

  const handleOperationInput = (op: string) => {
    const currentValue = parseFloat(displayValue);
    
    if (previousValue !== null && !shouldResetDisplay) {
      // Perform the previous operation
      let result;
      switch (operation) {
        case "+":
          result = previousValue + currentValue;
          break;
        case "-":
          result = previousValue - currentValue;
          break;
        case "×":
          result = previousValue * currentValue;
          break;
        case "÷":
          result = previousValue / currentValue;
          break;
        default:
          result = currentValue;
      }
      
      setDisplayValue(String(result));
      setPreviousValue(result);
    } else {
      setPreviousValue(currentValue);
    }
    
    setOperation(op);
    setShouldResetDisplay(true);
  };

  const handleEquals = () => {
    if (previousValue === null || operation === null) return;
    
    const currentValue = parseFloat(displayValue);
    let result;
    
    switch (operation) {
      case "+":
        result = previousValue + currentValue;
        break;
      case "-":
        result = previousValue - currentValue;
        break;
      case "×":
        result = previousValue * currentValue;
        break;
      case "÷":
        result = previousValue / currentValue;
        break;
      default:
        result = currentValue;
    }
    
    setDisplayValue(String(result));
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(true);
  };

  const handleClear = () => {
    setDisplayValue("0");
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const handleBackspace = () => {
    if (displayValue.length > 1) {
      setDisplayValue(displayValue.slice(0, -1));
    } else {
      setDisplayValue("0");
    }
  };

  const handlePercentage = () => {
    const value = parseFloat(displayValue) / 100;
    setDisplayValue(String(value));
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-primary px-4 py-3 text-white">
        <h3 className="text-lg font-semibold">კალკულატორი</h3>
      </div>
      <CardContent className="p-4">
        <div className="p-2 bg-gray-100 rounded-lg mb-4">
          <Input
            id="calculatorDisplay"
            className="w-full bg-transparent text-right text-xl font-medium p-2 focus:outline-none"
            readOnly
            value={displayValue}
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {/* First Row */}
          <Button
            variant="secondary"
            onClick={handleClear}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
          >
            C
          </Button>
          <Button
            variant="secondary"
            onClick={() => {/* Implement parentheses */}}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
          >
            ()
          </Button>
          <Button
            variant="secondary"
            onClick={handlePercentage}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
          >
            %
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleOperationInput("÷")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
          >
            ÷
          </Button>
          
          {/* Second Row */}
          <Button
            variant="outline"
            onClick={() => handleNumberInput("7")}
            className="bg-white hover:bg-gray-100 text-gray-800 font-medium"
          >
            7
          </Button>
          <Button
            variant="outline"
            onClick={() => handleNumberInput("8")}
            className="bg-white hover:bg-gray-100 text-gray-800 font-medium"
          >
            8
          </Button>
          <Button
            variant="outline"
            onClick={() => handleNumberInput("9")}
            className="bg-white hover:bg-gray-100 text-gray-800 font-medium"
          >
            9
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleOperationInput("×")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
          >
            ×
          </Button>
          
          {/* Third Row */}
          <Button
            variant="outline"
            onClick={() => handleNumberInput("4")}
            className="bg-white hover:bg-gray-100 text-gray-800 font-medium"
          >
            4
          </Button>
          <Button
            variant="outline"
            onClick={() => handleNumberInput("5")}
            className="bg-white hover:bg-gray-100 text-gray-800 font-medium"
          >
            5
          </Button>
          <Button
            variant="outline"
            onClick={() => handleNumberInput("6")}
            className="bg-white hover:bg-gray-100 text-gray-800 font-medium"
          >
            6
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleOperationInput("-")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
          >
            -
          </Button>
          
          {/* Fourth Row */}
          <Button
            variant="outline"
            onClick={() => handleNumberInput("1")}
            className="bg-white hover:bg-gray-100 text-gray-800 font-medium"
          >
            1
          </Button>
          <Button
            variant="outline"
            onClick={() => handleNumberInput("2")}
            className="bg-white hover:bg-gray-100 text-gray-800 font-medium"
          >
            2
          </Button>
          <Button
            variant="outline"
            onClick={() => handleNumberInput("3")}
            className="bg-white hover:bg-gray-100 text-gray-800 font-medium"
          >
            3
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleOperationInput("+")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
          >
            +
          </Button>
          
          {/* Fifth Row */}
          <Button
            variant="outline"
            onClick={() => handleNumberInput("0")}
            className="bg-white hover:bg-gray-100 text-gray-800 font-medium"
          >
            0
          </Button>
          <Button
            variant="outline"
            onClick={() => handleNumberInput(".")}
            className="bg-white hover:bg-gray-100 text-gray-800 font-medium"
          >
            .
          </Button>
          <Button
            variant="outline"
            onClick={handleBackspace}
            className="bg-white hover:bg-gray-100 text-gray-800 font-medium"
          >
            ⌫
          </Button>
          <Button
            onClick={handleEquals}
            className="bg-primary hover:bg-indigo-700 text-white font-medium"
          >
            =
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

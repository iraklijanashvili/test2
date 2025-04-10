import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTimer } from 'react-timer-hook';
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Play, Pause, RefreshCw, Clock, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ხმოვანი შეტყობინების URL
const ALARM_SOUND_URL = "https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3";

export default function Timer() {
  const [setupHours, setSetupHours] = useState(0);
  const [setupMinutes, setSetupMinutes] = useState(5);
  const [setupSeconds, setSetupSeconds] = useState(0);
  
  // პაუზის მდგომარეობის სტატუსი
  const [isPaused, setIsPaused] = useState(false);
  
  // ხმის ჩართვა-გამორთვა
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  
  // ხმოვანი შეტყობინების აუდიო ელემენტი
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { toast } = useToast();
  
  // ხმოვანი შეტყობინების ინიციალიზაცია
  useEffect(() => {
    // გამოვიყენოთ DOM ელემენტი ბრაუზერის შეზღუდვების გვერდის ასავლელად
    const audioElement = document.getElementById('alarmSound') as HTMLAudioElement;
    if (audioElement) {
      audioRef.current = audioElement;
    } else {
      audioRef.current = new Audio(ALARM_SOUND_URL);
    }
    
    // მოვუსმინოთ მომხმარებლის ინტერაქციას, რათა გავახმოვანოთ აუდიო
    const enableAudio = () => {
      const audioElement = document.getElementById('alarmSound') as HTMLAudioElement;
      if (audioElement) {
        // მხოლოდ ერთხელ დავუკრათ და გავჩერთ ბრაუზერის შეზღუდვების გასავლელად
        audioElement.volume = 0.01; // ძალიან დაბალი ხმა, რომ არ შეაწუხოს
        audioElement.play().then(() => {
          setTimeout(() => {
            audioElement.pause();
            audioElement.currentTime = 0;
            audioElement.volume = 1.0; // აღვადგინოთ ნორმალური ხმა
          }, 100);
        }).catch(e => console.log('აუდიოს ინიციალიზაციის შეცდომა', e));
      }
    };
    
    // დავამატოთ ივენთ ლისენერები მომხმარებლის ინტერაქციის დასაფიქსირებლად
    window.addEventListener('click', enableAudio, { once: true });
    window.addEventListener('touchstart', enableAudio, { once: true });
    window.addEventListener('keydown', enableAudio, { once: true });
    
    return () => {
      // კომპონენტის დამთავრებისას გავასუფთაოთ
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('touchstart', enableAudio);
      window.removeEventListener('keydown', enableAudio);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // ხმოვანი შეტყობინების დაკვრის ფუნქცია
  const playAlarmSound = () => {
    if (isSoundEnabled && audioRef.current) {
      // დავრწმუნდეთ, რომ ხმა თავიდან დაიწყება
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 1.0;
      
      // დავუკრათ ხმა რამდენიმეჯერ ზედიზედ უფრო ხანგრძლივი ეფექტისთვის
      const playMultipleTimes = () => {
        audioRef.current?.play().catch(error => {
          console.error("ხმის დაკვრის შეცდომა:", error);
        });
        
        // 5-ჯერ გავიმეოროთ ხმა
        let count = 0;
        const interval = setInterval(() => {
          count++;
          if (count < 5 && isSoundEnabled && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => clearInterval(interval));
          } else {
            clearInterval(interval);
          }
        }, 1000); // ყოველ 1 წამში გავიმეოროთ
      };
      
      playMultipleTimes();
    }
  };
  
  // ხმოვანი შეტყობინების გაჩერების ფუნქცია
  const stopAlarmSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  
  // ვქმნით ახალ დროის ობიექტს საწყისი მნიშვნელობით
  const getExpiryTimestamp = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + setupHours * 3600 + setupMinutes * 60 + setupSeconds);
    return time;
  };
  
  // react-timer-hook-ის კომპონენტს ვიყენებთ
  const {
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    resume,
    restart
  } = useTimer({
    expiryTimestamp: getExpiryTimestamp(),
    onExpire: () => {
      console.log('ტაიმერი ამოიწურა');
      
      // ხმოვანი შეტყობინება
      playAlarmSound();
      
      // შეტყობინება
      toast({
        title: "ტაიმერი დასრულდა!",
        description: "მითითებული დრო ამოიწურა",
      });
    },
    autoStart: false,
  });
  
  // პანელის გადატვირთვა და საწყისი მნიშვნელობის დაყენება
  const handleReset = () => {
    const newExpiryTimestamp = getExpiryTimestamp();
    restart(newExpiryTimestamp, false);
    setIsPaused(false);
    
    // გავაჩეროთ ხმოვანი შეტყობინება თუ უკვე ჟღერს
    stopAlarmSound();
  };
  
  // ტაიმერის დაწყება
  const handleStart = () => {
    // გავაჩეროთ ხმოვანი შეტყობინება თუ უკვე ჟღერს
    stopAlarmSound();
    
    if (isPaused) {
      resume();
      setIsPaused(false);
    } else {
      const newExpiryTimestamp = getExpiryTimestamp();
      restart(newExpiryTimestamp, true);
    }
  };
  
  // პაუზა
  const handlePause = () => {
    pause();
    setIsPaused(true);
  };
  
  // ხმის გადართვა
  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    if (!isSoundEnabled) {
      toast({
        title: "ხმა ჩართულია",
        description: "ტაიმერის ამოწურვისას მოისმენთ ხმოვან შეტყობინებას",
      });
    } else {
      stopAlarmSound(); // თუ ხმა გამორთულია, ვაჩერებთ მიმდინარე დაკვრასაც
      toast({
        title: "ხმა გამორთულია",
        description: "ტაიმერის ამოწურვისას ხმოვანი შეტყობინება არ გაჟღერდება",
      });
    }
  };
  
  // მხოლოდ რიცხვების დაშვება
  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: string,
    max: number
  ) => {
    const numValue = value === "" ? 0 : parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= max) {
      setter(numValue);
    }
  };
  
  // ტესტირების ფუნქცია
  const handleTestSound = () => {
    playAlarmSound();
    toast({
      title: "ხმის ტესტი",
      description: "მიმდინარეობს ხმოვანი შეტყობინების ტესტირება",
    });
  };
  
  // ფორმატი საათი:წუთი:წამი
  const formatTwoDigits = (n: number) => n.toString().padStart(2, '0');

  return (
    <Card className="overflow-hidden">
      <div className="bg-primary px-4 py-3 text-white flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          ტაიმერი
        </h3>
        <div className="flex items-center space-x-2">
          {isRunning && (
            <div className="bg-green-500 px-2 py-1 rounded text-sm flex items-center animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full mr-1 inline-block"></span>
              მიმდინარეობს
            </div>
          )}
          {isPaused && (
            <div className="bg-amber-500 px-2 py-1 rounded text-sm flex items-center">
              <AlertCircle className="mr-1 h-3 w-3" />
              დაპაუზებული
            </div>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-gray-800 mb-2" id="timerDisplay">
            {formatTwoDigits(hours)}:{formatTwoDigits(minutes)}:{formatTwoDigits(seconds)}
          </div>
          <div className="text-sm text-gray-500">საათი : წუთი : წამი</div>
        </div>
        
        {!isRunning && !isPaused && (
          <div className="flex justify-center space-x-3 mb-6">
            <div>
              <Label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
                საათი
              </Label>
              <Input
                type="number"
                id="hours"
                min={0}
                max={23}
                value={setupHours}
                onChange={(e) => handleInputChange(setSetupHours, e.target.value, 23)}
                className="w-16 text-center"
              />
            </div>
            <div>
              <Label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-1">
                წუთი
              </Label>
              <Input
                type="number"
                id="minutes"
                min={0}
                max={59}
                value={setupMinutes}
                onChange={(e) => handleInputChange(setSetupMinutes, e.target.value, 59)}
                className="w-16 text-center"
              />
            </div>
            <div>
              <Label htmlFor="seconds" className="block text-sm font-medium text-gray-700 mb-1">
                წამი
              </Label>
              <Input
                type="number"
                id="seconds"
                min={0}
                max={59}
                value={setupSeconds}
                onChange={(e) => handleInputChange(setSetupSeconds, e.target.value, 59)}
                className="w-16 text-center"
              />
            </div>
          </div>
        )}
        
        <div className="flex flex-col space-y-4">
          <div className="flex justify-center space-x-4">
            {!isRunning && (
              <Button
                id="startTimer"
                onClick={handleStart}
                disabled={isRunning || (setupHours === 0 && setupMinutes === 0 && setupSeconds === 0 && !isPaused)}
                className="bg-primary hover:bg-indigo-700 text-white flex items-center"
              >
                <Play className="mr-1 h-4 w-4" />
                {isPaused ? "გაგრძელება" : "დაწყება"}
              </Button>
            )}
            
            {isRunning && (
              <Button
                id="pauseTimer"
                onClick={handlePause}
                className="bg-amber-500 hover:bg-amber-600 text-white flex items-center"
              >
                <Pause className="mr-1 h-4 w-4" />
                პაუზა
              </Button>
            )}
            
            <Button
              id="resetTimer"
              onClick={handleReset}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center"
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              გადატვირთვა
            </Button>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <div className="flex items-center">
              {isSoundEnabled ? (
                <Volume2 className="h-5 w-5 text-primary mr-2" />
              ) : (
                <VolumeX className="h-5 w-5 text-gray-400 mr-2" />
              )}
              <span className="text-sm">ხმოვანი შეტყობინება</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleTestSound}
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                disabled={!isSoundEnabled}
              >
                ტესტი
              </Button>
              
              <Switch
                checked={isSoundEnabled}
                onCheckedChange={toggleSound}
              />
            </div>
          </div>
        </div>
        
        {(isRunning || isPaused) && (
          <div className="text-center mt-4 text-sm text-gray-500">
            {isPaused ? "ტაიმერი დაპაუზებულია" : "ტაიმერი აქტიურია"}
          </div>
        )}
        
        {/* ფარული აუდიო ელემენტი */}
        <audio id="alarmSound" src={ALARM_SOUND_URL} preload="auto" />
      </CardContent>
    </Card>
  );
}

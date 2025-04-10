import { Link } from "wouter";
import { ExternalLink, Github, Mail, Zap } from "lucide-react";

export default function Footer() {
  const utilityLinks = [
    { title: "კალკულატორი", path: "/calculator" },
    { title: "ტაიმერი", path: "/timer" },
    { title: "ვალუტის კონვერტერი", path: "/currency" }
  ];
  
  const infoLinks = [
    { title: "ამინდი", path: "/weather" },
    { title: "სიახლეები", path: "/news" }
  ];
  
  const contentLinks = [
    { title: "ინსტრუქციები", path: "/tutorials" },
    { title: "რეცეპტები", path: "/recipes" },
    { title: "რჩევები", path: "/tips" }
  ];
  
  return (
    <footer className="footer mt-12 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Zap className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold ml-2">მულტიფუნქციური</h3>
            </div>
            <p className="text-gray-300">თქვენი ყველაფერი-ერთში პლატფორმა სასარგებლო ინსტრუმენტებით.</p>
            <div className="flex space-x-4 mt-6">
              <a href="https://github.com/universaltoolkit/app" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:info@multitool.ge" className="text-gray-300 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">სწრაფი ბმულები</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-bold text-primary mb-3">ხელსაწყოები</h4>
                <ul className="space-y-2">
                  {utilityLinks.map((link, index) => (
                    <li key={index}>
                      <Link href={link.path}>
                        <div className="text-gray-300 hover:text-white hover:translate-x-1 transition-all cursor-pointer flex items-center">
                          <span className="mr-1">›</span> {link.title}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary mb-3">ინფორმაცია</h4>
                <ul className="space-y-2">
                  {infoLinks.map((link, index) => (
                    <li key={index}>
                      <Link href={link.path}>
                        <div className="text-gray-300 hover:text-white hover:translate-x-1 transition-all cursor-pointer flex items-center">
                          <span className="mr-1">›</span> {link.title}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <h4 className="text-sm font-bold text-primary mb-3 mt-5">კონტენტი</h4>
                <ul className="space-y-2">
                  {contentLinks.map((link, index) => (
                    <li key={index}>
                      <Link href={link.path}>
                        <div className="text-gray-300 hover:text-white hover:translate-x-1 transition-all cursor-pointer flex items-center">
                          <span className="mr-1">›</span> {link.title}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">კონტაქტი</h3>
            <p className="text-gray-300">გაქვთ შენიშვნები ან იპოვეთ შეცდომა? შეგვატყობინეთ!</p>
            <a href="mailto:info@multitool.ge" className="text-white font-medium bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-lg inline-flex items-center mt-4 hover:shadow-lg transition-all">
              <Mail className="h-4 w-4 mr-2" />
              info@multitool.ge
              <ExternalLink className="h-3 w-3 ml-2 opacity-70" />
            </a>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} მულტიფუნქციური. ყველა უფლება დაცულია.</p>
        </div>
      </div>
    </footer>
  );
}

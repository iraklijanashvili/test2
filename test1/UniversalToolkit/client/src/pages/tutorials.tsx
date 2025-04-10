import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/layout/SEO";
import Tutorials from "@/components/content/Tutorials";

export default function TutorialsPage() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <SEO 
        title="ინსტრუქციები და სახელმძღვანელოები | მულტიფუნქციური აპლიკაცია"
        description="სასარგებლო ინსტრუქციები და სახელმძღვანელოები სხვადასხვა თემაზე. პრაქტიკული რჩევები და დეტალური ახსნა-განმარტებები."
        canonicalUrl="/tutorials"
        ogType="website"
        keywords="ინსტრუქციები, სახელმძღვანელოები, გზამკვლევი, რჩევები, პრაქტიკული ინფორმაცია"
      />
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">ინსტრუქციები</h1>
        <div className="max-w-3xl mx-auto">
          <Tutorials />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
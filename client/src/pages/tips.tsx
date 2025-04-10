import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Tips from "@/components/content/Tips";

export default function TipsPage() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">რჩევები</h1>
        <div className="max-w-3xl mx-auto">
          <Tips />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
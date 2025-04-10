import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/layout/SEO";
import News from "@/components/information/News";

export default function NewsPage() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <SEO 
        title="სიახლეები | მულტიფუნქციური აპლიკაცია"
        description="უახლესი სიახლეები და ინფორმაცია. იყავით საქმის კურსში უახლესი მოვლენების შესახებ."
        canonicalUrl="/news"
        ogType="website"
        keywords="სიახლეები, ახალი ამბები, ინფორმაცია, აქტუალური, მიმდინარე მოვლენები"
      />
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">სიახლეები</h1>
        <div className="max-w-3xl mx-auto">
          <News />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
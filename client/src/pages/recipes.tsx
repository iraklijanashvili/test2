import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/layout/SEO";
import Recipes from "@/components/content/Recipes";

export default function RecipesPage() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <SEO 
        title="რეცეპტები - ქართული და მსოფლიო კერძები | მულტიფუნქციური აპლიკაცია"
        description="აღმოაჩინეთ გემრიელი კერძების რეცეპტები მსოფლიოს სხვადასხვა კუთხიდან. ქართული და უცხოური სამზარეულოს საუკეთესო რეცეპტები."
        canonicalUrl="/recipes"
        ogType="website"
        keywords="ქართული რეცეპტები, უცხოური რეცეპტები, კულინარია, სამზარეულო, გემრიელი კერძები"
      />
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">რეცეპტები</h1>
        <p className="text-gray-600 mb-6 max-w-3xl">
          აღმოაჩინეთ გემრიელი კერძების რეცეპტები მსოფლიოს სხვადასხვა კუთხიდან. 
          შეგიძლიათ მოძებნოთ რეცეპტები სამზარეულოს ან კატეგორიის მიხედვით.
        </p>
        <div className="max-w-5xl mx-auto">
          <Recipes />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
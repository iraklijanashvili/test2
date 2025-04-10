import { useRoute, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Heart, Calendar, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/layout/SEO';

interface HoroscopeData {
  name: string;
  date: string;
  icon: string;
  color: string;
  description: string;
  compatibility: string[];
  luckyNumbers: number[];
  luckyColors: string[];
  dailyForecast: string;
  mood: string;
  luckySide: string;
}

const horoscopeData: { [key: string]: HoroscopeData } = {
  'ვერძი': {
    name: 'ვერძი',
    date: '21 მარტი - 20 აპრილი',
    icon: '♈',
    color: 'text-red-500',
    description: 'ვერძი არის ენერგიული და თავდაჯერებული. ისინი არიან ლიდერები და ინიციატივის მქონე ადამიანები, რომლებიც ყოველთვის მზად არიან ახალი გამოწვევებისთვის.',
    compatibility: ['ლომი', 'მშვილდოსანი', 'კურო'],
    luckyNumbers: [1, 9, 17],
    luckyColors: ['წითელი', 'ნარინჯისფერი'],
    dailyForecast: 'დღეს თქვენი ენერგია მაღალ დონეზეა. გამოიყენეთ ეს შესაძლებლობა ახალი პროექტების დასაწყებად. ნუ მოერიდებით ინიციატივის გამოჩენას და ლიდერობას.',
    mood: 'ენერგიული',
    luckySide: 'პროფესიული წინსვლა'
  },
  'კურო': {
    name: 'კურო',
    date: '21 აპრილი - 21 მაისი',
    icon: '♉',
    color: 'text-green-600',
    description: 'კურო არის პრაქტიკული და საიმედო. მოთმინების და სიმტკიცის მქონე ადამიანები, რომლებიც აფასებენ სტაბილურობას და კომფორტს.',
    compatibility: ['ქალწული', 'თხის რქა', 'კირჩხიბი'],
    luckyNumbers: [2, 6, 15],
    luckyColors: ['მწვანე', 'ყავისფერი'],
    dailyForecast: 'დღეს ფინანსური საკითხები წინა პლანზე გამოდის. დაფიქრდით გრძელვადიან ინვესტიციებზე. თქვენი პრაქტიკული მიდგომა დაგეხმარებათ სწორი გადაწყვეტილებების მიღებაში.',
    mood: 'მშვიდი',
    luckySide: 'ფინანსური სტაბილურობა'
  },
  'ტყუპები': {
    name: 'ტყუპები',
    date: '22 მაისი - 21 ივნისი',
    icon: '♊',
    color: 'text-yellow-500',
    description: 'ტყუპები არის ცნობისმოყვარე და ადაპტირებადი. კომუნიკაბელური და მოქნილი ადამიანები, რომლებიც ყოველთვის ეძებენ ახალ ინფორმაციას.',
    compatibility: ['სასწორი', 'მერწყული', 'ლომი'],
    luckyNumbers: [3, 12, 21],
    luckyColors: ['ყვითელი', 'ცისფერი'],
    dailyForecast: 'დღეს კომუნიკაცია თქვენი ძლიერი მხარეა. გამოიყენეთ ეს უნარი მნიშვნელოვანი ურთიერთობების გასაუმჯობესებლად. ახალი იდეები და პროექტები წარმატებას მოგიტანთ.',
    mood: 'ცნობისმოყვარე',
    luckySide: 'სოციალური კავშირები'
  },
  'კირჩხიბი': {
    name: 'კირჩხიბი',
    date: '22 ივნისი - 22 ივლისი',
    icon: '♋',
    color: 'text-blue-400',
    description: 'კირჩხიბი არის ემოციური და ინტუიციური. მზრუნველი და დამცველი ადამიანები, რომლებისთვისაც ოჯახი და სახლი უმნიშვნელოვანესია.',
    compatibility: ['თევზები', 'მორიელი', 'კურო'],
    luckyNumbers: [4, 13, 22],
    luckyColors: ['ვერცხლისფერი', 'თეთრი'],
    dailyForecast: 'დღეს ოჯახური საკითხები პრიორიტეტულია. გამოიყენეთ თქვენი ინტუიცია მნიშვნელოვანი გადაწყვეტილებების მისაღებად. ზრუნვა საკუთარ თავზე ისევე მნიშვნელოვანია, როგორც სხვებზე ზრუნვა.',
    mood: 'მგრძნობიარე',
    luckySide: 'ოჯახური ჰარმონია'
  },
  'ლომი': {
    name: 'ლომი',
    date: '23 ივლისი - 22 აგვისტო',
    icon: '♌',
    color: 'text-orange-500',
    description: 'ლომი არის თავდაჯერებული და ამბიციური. შემოქმედებითი და გულუხვი ადამიანები, რომლებიც ყოველთვის ცენტრში ყოფნას ცდილობენ.',
    compatibility: ['მშვილდოსანი', 'ვერძი', 'სასწორი'],
    luckyNumbers: [5, 14, 23],
    luckyColors: ['ოქროსფერი', 'ნარინჯისფერი'],
    dailyForecast: 'დღეს თქვენი შემოქმედებითი ენერგია პიკზეა. გამოიყენეთ ეს დრო ახალი პროექტების დასაწყებად. თქვენი ლიდერული თვისებები აღიარებული იქნება გარშემომყოფების მიერ.',
    mood: 'თავდაჯერებული',
    luckySide: 'შემოქმედებითი წარმატება'
  },
  'ქალწული': {
    name: 'ქალწული',
    date: '23 აგვისტო - 22 სექტემბერი',
    icon: '♍',
    color: 'text-emerald-600',
    description: 'ქალწული არის ანალიტიკური და პრაქტიკული. დეტალებზე ორიენტირებული ადამიანები, რომლებიც ყოველთვის სრულყოფილებისკენ ისწრაფვიან.',
    compatibility: ['თხის რქა', 'კურო', 'კირჩხიბი'],
    luckyNumbers: [6, 15, 24],
    luckyColors: ['მწვანე', 'ყავისფერი'],
    dailyForecast: 'დღეს ორგანიზებულობა და დეტალებზე ყურადღება წარმატების გასაღებია. გამოიყენეთ თქვენი ანალიტიკური უნარები პრობლემების გადასაჭრელად. ჯანმრთელობაზე ზრუნვა პრიორიტეტი უნდა იყოს.',
    mood: 'ანალიტიკური',
    luckySide: 'პროფესიული აღიარება'
  },
  'სასწორი': {
    name: 'სასწორი',
    date: '23 სექტემბერი - 23 ოქტომბერი',
    icon: '♎',
    color: 'text-pink-500',
    description: 'სასწორი არის დიპლომატიური და სამართლიანი. ჰარმონიის მოყვარული ადამიანები, რომლებიც ყოველთვის ბალანსის შენარჩუნებას ცდილობენ.',
    compatibility: ['მერწყული', 'ტყუპები', 'ლომი'],
    luckyNumbers: [7, 16, 25],
    luckyColors: ['ვარდისფერი', 'ცისფერი'],
    dailyForecast: 'დღეს ურთიერთობები წინა პლანზე გამოდის. გამოიყენეთ თქვენი დიპლომატიური უნარები კონფლიქტების მოსაგვარებლად. ბალანსის პოვნა სამუშაოსა და პირად ცხოვრებას შორის მნიშვნელოვანია.',
    mood: 'ჰარმონიული',
    luckySide: 'პარტნიორული ურთიერთობები'
  },
  'მორიელი': {
    name: 'მორიელი',
    date: '24 ოქტომბერი - 22 ნოემბერი',
    icon: '♏',
    color: 'text-red-600',
    description: 'მორიელი არის ინტენსიური და პასიური. ძლიერი ინტუიციის მქონე ადამიანები, რომლებიც სიღრმისეულად ჩაწვდომას ცდილობენ ყველაფერს.',
    compatibility: ['კირჩხიბი', 'თევზები', 'თხის რქა'],
    luckyNumbers: [8, 17, 26],
    luckyColors: ['წითელი', 'შავი'],
    dailyForecast: 'დღეს თქვენი ინტუიცია განსაკუთრებით ძლიერია. ენდეთ თქვენს შინაგან ხმას მნიშვნელოვანი გადაწყვეტილებების მიღებისას. ტრანსფორმაციული ცვლილებები მოსალოდნელია.',
    mood: 'ინტენსიური',
    luckySide: 'პირადი ტრანსფორმაცია'
  },
  'მშვილდოსანი': {
    name: 'მშვილდოსანი',
    date: '23 ნოემბერი - 21 დეკემბერი',
    icon: '♐',
    color: 'text-purple-500',
    description: 'მშვილდოსანი არის ოპტიმისტური და თავისუფლების მოყვარული. მოგზაური სულის მქონე ადამიანები, რომლებიც ყოველთვის ახალ ჰორიზონტებს ეძებენ.',
    compatibility: ['ვერძი', 'ლომი', 'მერწყული'],
    luckyNumbers: [9, 18, 27],
    luckyColors: ['იისფერი', 'ლურჯი'],
    dailyForecast: 'დღეს ახალი შესაძლებლობები გელით. გამოიყენეთ თქვენი ოპტიმიზმი და ავანტიურისტული სული ახალი გამოცდილებების მისაღებად. სწავლა და განვითარება წარმატების გასაღებია.',
    mood: 'ოპტიმისტური',
    luckySide: 'მოგზაურობა და განათლება'
  },
  'თხის-რქა': {
    name: 'თხის რქა',
    date: '22 დეკემბერი - 20 იანვარი',
    icon: '♑',
    color: 'text-gray-700',
    description: 'თხის რქა არის დისციპლინირებული და პასუხისმგებლიანი. ამბიციური და მიზანდასახული ადამიანები, რომლებიც ყოველთვის წარმატებისკენ ისწრაფვიან.',
    compatibility: ['ქალწული', 'კურო', 'მორიელი'],
    luckyNumbers: [10, 19, 28],
    luckyColors: ['ყავისფერი', 'შავი'],
    dailyForecast: 'დღეს კარიერული წინსვლა პრიორიტეტულია. გამოიყენეთ თქვენი დისციპლინა და ორგანიზებულობა მიზნების მისაღწევად. გრძელვადიანი გეგმები წარმატებას მოგიტანთ.',
    mood: 'მიზანდასახული',
    luckySide: 'კარიერული წინსვლა'
  },
  'მერწყული': {
    name: 'მერწყული',
    date: '21 იანვარი - 18 თებერვალი',
    icon: '♒',
    color: 'text-blue-500',
    description: 'მერწყული არის ინოვაციური და დამოუკიდებელი. პროგრესული მოაზროვნე ადამიანები, რომლებიც ყოველთვის ორიგინალურ იდეებს ეძებენ.',
    compatibility: ['სასწორი', 'ტყუპები', 'მშვილდოსანი'],
    luckyNumbers: [11, 20, 29],
    luckyColors: ['ცისფერი', 'ვერცხლისფერი'],
    dailyForecast: 'დღეს ინოვაციური იდეები წინა პლანზე გამოდის. გამოიყენეთ თქვენი კრეატიულობა და ორიგინალური აზროვნება პრობლემების გადასაჭრელად. სოციალური კავშირები მნიშვნელოვან როლს ითამაშებს.',
    mood: 'ინოვაციური',
    luckySide: 'ტექნოლოგიები და ინოვაცია'
  },
  'თევზები': {
    name: 'თევზები',
    date: '19 თებერვალი - 20 მარტი',
    icon: '♓',
    color: 'text-indigo-500',
    description: 'თევზები არის ინტუიციური და ემპათიური. შემოქმედებითი და მგრძნობიარე ადამიანები, რომლებიც ღრმად განიცდიან ემოციებს.',
    compatibility: ['მორიელი', 'კირჩხიბი', 'თხის რქა'],
    luckyNumbers: [12, 21, 30],
    luckyColors: ['ლურჯი', 'იისფერი'],
    dailyForecast: 'დღეს თქვენი ინტუიცია და შემოქმედებითი უნარები გაძლიერებულია. მიჰყევით შინაგან ხმას და ნუ შეეწინააღმდეგებით ემოციებს. ხელოვნება და მუსიკა დადებით გავლენას მოახდენს თქვენზე.',
    mood: 'შემოქმედებითი',
    luckySide: 'სულიერი განვითარება'
  }
};

export default function HoroscopeDetailPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/horoscope/:sign');
  const sign = params?.sign;
  const data = sign ? horoscopeData[decodeURIComponent(sign)] : null;

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/horoscope')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            უკან დაბრუნება
          </Button>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-xl text-gray-600">ზოდიაქოს ნიშანი ვერ მოიძებნა</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <SEO 
        title={`${data.name} - ჰოროსკოპი | მულტიფუნქციური აპლიკაცია`}
        description={`${data.name}ის დღის ჰოროსკოპი და ზოგადი დახასიათება. ${data.description.substring(0, 100)}...`}
        canonicalUrl={`/horoscope/${sign}`}
        ogType="website"
        keywords={`ჰოროსკოპი, ზოდიაქო, ${data.name}, დღის პროგნოზი, ასტროლოგია`}
      />
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/horoscope')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            უკან დაბრუნება
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* მთავარი ინფორმაცია */}
          <div className="lg:col-span-8">
            <Card className="mb-6">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`text-6xl ${data.color}`}>{data.icon}</div>
                    <div>
                      <CardTitle className="text-3xl font-bold">{data.name}</CardTitle>
                      <p className="text-gray-500 flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        {data.date}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-3">დღის პროგნოზი</h3>
                    <p className="text-gray-700 leading-relaxed">{data.dailyForecast}</p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-3">ზოგადი დახასიათება</h3>
                    <p className="text-gray-700 leading-relaxed">{data.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* გვერდითი ინფორმაცია */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">დღის დეტალები</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-600 mb-2">განწყობა</h4>
                    <p className="text-lg font-semibold">{data.mood}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-600 mb-2">იღბლიანი მხარე</h4>
                    <p className="text-lg font-semibold">{data.luckySide}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-600 mb-2">იღბლიანი რიცხვები</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.luckyNumbers.map((number) => (
                        <span key={number} className="px-3 py-1 bg-white rounded-full text-sm font-medium shadow-sm">
                          {number}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-600 mb-2">იღბლიანი ფერები</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.luckyColors.map((color) => (
                        <span key={color} className="px-3 py-1 bg-white rounded-full text-sm font-medium shadow-sm">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-600 mb-2">თავსებადი ნიშნები</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.compatibility.map((sign) => (
                        <span key={sign} className="px-3 py-1 bg-white rounded-full text-sm font-medium shadow-sm">
                          {sign}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
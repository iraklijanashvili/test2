# Supabase და Netlify ინტეგრაციის გზამკვლევი

## ნაბიჯი 1: Supabase-ში ცხრილების შექმნა

1. შედით თქვენს Supabase პროექტში და გადადით **SQL Editor** განყოფილებაში.
2. შექმენით ახალი SQL ფაილი (New Query) და ჩააკოპირეთ `supabase_tables.sql` ფაილის შიგთავსი:

```sql
-- tutorials ცხრილი
CREATE TABLE tutorials (
  id serial PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  image_url text,
  read_time text NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- tips ცხრილი
CREATE TABLE tips (
  id serial PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  is_tip_of_day boolean DEFAULT FALSE,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- ინდექსების შექმნა
CREATE INDEX idx_tutorials_category ON tutorials(category);
CREATE INDEX idx_tips_category ON tips(category);
CREATE INDEX idx_tips_is_tip_of_day ON tips(is_tip_of_day);

-- სატესტო მონაცემების ჩასმა tutorials ცხრილში
INSERT INTO tutorials (title, content, category, read_time) VALUES
('როგორ გამოვიყენოთ აპლიკაცია', 'დეტალური ინსტრუქცია აპლიკაციის გამოყენების შესახებ...', 'ტექნოლოგიები', '5 წუთი'),
('ფინანსური დაგეგმვის საფუძვლები', 'ფინანსური დაგეგმვის ძირითადი პრინციპები და რჩევები...', 'ფინანსები', '10 წუთი'),
('პირადი განვითარების გზამკვლევი', 'როგორ განვავითაროთ პიროვნული უნარები და თვისებები...', 'პირადი განვითარება', '7 წუთი');

-- სატესტო მონაცემების ჩასმა tips ცხრილში
INSERT INTO tips (title, content, category, is_tip_of_day) VALUES
('დღის რჩევა', 'რეგულარულად შეამოწმეთ თქვენი ფინანსური მდგომარეობა', 'ფინანსები', TRUE),
('დროის მენეჯმენტი', 'გამოიყენეთ პომოდორო ტექნიკა პროდუქტიულობის გასაზრდელად', 'პირადი განვითარება', FALSE),
('უსაფრთხოება', 'რეგულარულად შეცვალეთ პაროლები თქვენს ანგარიშებზე', 'ტექნოლოგიები', FALSE);
```

3. გაუშვით SQL კოდი **Run** ღილაკზე დაჭერით.

## ნაბიჯი 2: Supabase-ის API გასაღებების მოპოვება

1. Supabase-ის პროექტში გადადით **Project Settings** -> **API** განყოფილებაში.
2. დააკოპირეთ შემდეგი მნიშვნელობები:
   - **URL**: `https://[your-project-id].supabase.co`
   - **anon/public** გასაღები (API Key)

## ნაბიჯი 3: ლოკალური გარემოს კონფიგურაცია

1. გახსენით `.env` ფაილი პროექტის ძირითად დირექტორიაში და ჩაანაცვლეთ პლეისჰოლდერები რეალური მნიშვნელობებით:

```
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

2. გადატვირთეთ აპლიკაცია, რომ ცვლილებები ძალაში შევიდეს.

## ნაბიჯი 4: Netlify-ზე დაჰოსტვა

1. დარწმუნდით, რომ `netlify.toml` ფაილში გაქვთ შემდეგი კონფიგურაცია:

```toml
[build]
  command = "npm run build"
  publish = "dist/public"

[build.environment]
  # Supabase გარემოს ცვლადები
  VITE_SUPABASE_URL = "https://[your-project-id].supabase.co"
  VITE_SUPABASE_ANON_KEY = "your-anon-key"

# API პროქსი - გადაამისამართებს /api/* მოთხოვნებს ბექენდზე
[[redirects]]
  from = "/api/*"
  to = "https://universal-toolkit-server.onrender.com/api/:splat"
  status = 200
  force = true
  headers = {Access-Control-Allow-Origin = "*"}

# SPA რედირექტი
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. ჩაანაცვლეთ `[your-project-id]` და `your-anon-key` თქვენი Supabase პროექტის შესაბამისი მნიშვნელობებით.

3. დააჰოსტეთ პროექტი Netlify-ზე:
   - დააკავშირეთ თქვენი GitHub რეპოზიტორია Netlify-სთან
   - ან გამოიყენეთ Netlify CLI: `netlify deploy --prod`

## ნაბიჯი 5: Netlify-ზე გარემოს ცვლადების დამატება

1. Netlify-ის დეშბორდში გადადით **Site settings** -> **Environment variables** განყოფილებაში.
2. დაამატეთ შემდეგი გარემოს ცვლადები:
   - `VITE_SUPABASE_URL`: თქვენი Supabase პროექტის URL
   - `VITE_SUPABASE_ANON_KEY`: თქვენი Supabase პროექტის ანონიმური API გასაღები

3. დააჭირეთ **Save** ღილაკს.
4. გადატვირთეთ თქვენი საიტი Netlify-ზე: გადადით **Deploys** განყოფილებაში და დააჭირეთ **Trigger deploy** -> **Deploy site**.

## ნაბიჯი 6: აპლიკაციის ტესტირება

1. გახსენით თქვენი დაჰოსტილი საიტი Netlify-ზე.
2. შეამოწმეთ, რომ აპლიკაცია წარმატებით უკავშირდება Supabase-ს და აჩვენებს მონაცემებს.
3. შეგიძლიათ გამოიყენოთ კონსოლი ბრაუზერში, რომ დარწმუნდეთ, რომ Supabase-თან კავშირი წარმატებულია.

## როგორ მუშაობს ინტეგრაცია

როდესაც თქვენი ფრონტენდი დაჰოსტილია Netlify-ზე, ის პირდაპირ უკავშირდება Supabase-ის API-ს გარემოს ცვლადებში მითითებული URL-ისა და API გასაღების გამოყენებით. ეს ნიშნავს, რომ:

1. ფრონტენდი აგზავნის მოთხოვნებს პირდაპირ Supabase-ის API-ზე.
2. Supabase-ი ამუშავებს მოთხოვნებს და აბრუნებს შედეგებს.
3. ფრონტენდი იღებს და აჩვენებს ამ მონაცემებს.

ამ გზით, თქვენ არ გჭირდებათ საკუთარი ბექენდის შექმნა და მართვა - Supabase გთავაზობთ მზა API-ს, რომელიც შეგიძლიათ გამოიყენოთ პირდაპირ თქვენი ფრონტენდიდან.

## მონაცემების წვდომა კოდში

მონაცემების წამოსაღებად Supabase-დან, გამოიყენეთ `supabase` კლიენტი, რომელიც განსაზღვრულია `client/src/lib/supabase.ts` ფაილში:

```typescript
// მაგალითი: tips ცხრილიდან მონაცემების წამოღება
const { data: tips, error } = await supabase.from('tips').select('*');

// მაგალითი: tutorials ცხრილიდან მონაცემების წამოღება
const { data: tutorials, error } = await supabase.from('tutorials').select('*');

// მაგალითი: კონკრეტული კატეგორიის tutorials-ების წამოღება
const { data: techTutorials, error } = await supabase
  .from('tutorials')
  .select('*')
  .eq('category', 'ტექნოლოგიები');
```

## დასკვნა

ამ გზამკვლევის გამოყენებით, თქვენ შეძლებთ:

1. Supabase-ში ცხრილების შექმნას და მონაცემების დამატებას
2. ფრონტენდის დაკავშირებას Supabase-თან
3. პროექტის დაჰოსტვას Netlify-ზე Supabase ინტეგრაციით

ეს არის მარტივი და ეფექტური გზა, რომ შექმნათ სრულფასოვანი აპლიკაცია ბექენდის სერვერის გარეშე, Supabase-ის BaaS (Backend as a Service) გამოყენებით.
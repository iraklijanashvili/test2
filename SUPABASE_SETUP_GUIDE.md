# Supabase-ის კონფიგურაციის გზამკვლევი

## ნაბიჯი 1: Supabase-ში ცხრილების შექმნა

1. შედით თქვენს Supabase პროექტში და გადადით **SQL Editor** განყოფილებაში.
2. შექმენით ახალი SQL ფაილი (New Query) და ჩააკოპირეთ შემდეგი SQL კოდი (ან გამოიყენეთ პროექტში არსებული `supabase_tables.sql` ფაილი):

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

## ნაბიჯი 2: API გასაღებების მოპოვება

1. Supabase-ის პროექტში გადადით **Project Settings** განყოფილებაში.
2. აირჩიეთ **API** ქვეგანყოფილება.
3. დააკოპირეთ შემდეგი მნიშვნელობები:
   - **URL**: `https://[your-project-id].supabase.co`
   - **anon/public** key (ანონიმური/საჯარო გასაღები)

## ნაბიჯი 3: აპლიკაციის კონფიგურაცია

1. შექმენით `.env` ფაილი პროექტის ძირითად დირექტორიაში (თუ არ არსებობს) და დაამატეთ შემდეგი ცვლადები:

```
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

2. ჩაანაცვლეთ `[your-project-id]` და `your-anon-key` თქვენი Supabase პროექტის შესაბამისი მნიშვნელობებით.

3. გადატვირთეთ აპლიკაცია, რომ ცვლილებები ძალაში შევიდეს.

## ნაბიჯი 4: ტიპების განახლება (არასავალდებულო)

თუ გსურთ განაახლოთ ტიპების ფაილი, რომ მოიცვას ახალი ცხრილები, შეგიძლიათ გამოიყენოთ `supabase-js` CLI ან ხელით განაახლოთ `/client/src/types/supabase.ts` ფაილი.

## ნაბიჯი 5: აპლიკაციის ტესტირება

1. გაუშვით აპლიკაცია ლოკალურად:

```bash
npm run dev
```

2. შეამოწმეთ, რომ მონაცემები სწორად იტვირთება `Tips` და `Tutorials` კომპონენტებში.

## დამატებითი რესურსები

- [Supabase დოკუმენტაცია](https://supabase.io/docs)
- [supabase-js კლიენტის დოკუმენტაცია](https://supabase.io/docs/reference/javascript/start)
- [Supabase Auth დოკუმენტაცია](https://supabase.io/docs/guides/auth)
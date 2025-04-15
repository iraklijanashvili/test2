-- ცხრილების შექმნა Supabase-ში

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
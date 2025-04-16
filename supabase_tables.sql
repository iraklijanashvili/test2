-- 1. წაშლა არსებული ცხრილებისა სწორი თანმიმდევრობით (foreign key-ების გამო)
DROP TABLE IF EXISTS steps;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS tips;
DROP TABLE IF EXISTS tutorials;

-- 2. ცხრილების შექმნა

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

-- news ცხრილი
CREATE TABLE news (
  id serial PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  video_url text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- recipes ცხრილი
CREATE TABLE recipes (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  category text NOT NULL,
  prep_time integer NOT NULL,
  cook_time integer NOT NULL,
  servings integer NOT NULL,
  difficulty text NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- ingredients ცხრილი
CREATE TABLE ingredients (
  id serial PRIMARY KEY,
  recipe_id integer NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount text NOT NULL,
  unit text NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL
);

-- steps ცხრილი
CREATE TABLE steps (
  id serial PRIMARY KEY,
  recipe_id integer NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  instruction text NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL
);

-- 3. ინდექსების შექმნა
CREATE INDEX idx_tutorials_category ON tutorials(category);
CREATE INDEX idx_tips_category ON tips(category);
CREATE INDEX idx_tips_is_tip_of_day ON tips(is_tip_of_day);
CREATE INDEX idx_news_created_at ON news(created_at);
CREATE INDEX idx_recipes_category ON recipes(category);
CREATE INDEX idx_ingredients_recipe_id ON ingredients(recipe_id);
CREATE INDEX idx_steps_recipe_id ON steps(recipe_id);
CREATE INDEX idx_steps_recipe_id_step_number ON steps(recipe_id, step_number);

-- 4. სატესტო მონაცემების ჩასმა

-- tutorials
INSERT INTO tutorials (title, content, category, read_time) VALUES
('როგორ გამოვიყენოთ აპლიკაცია', 'დეტალური ინსტრუქცია აპლიკაციის გამოყენების შესახებ...', 'ტექნოლოგიები', '5 წუთი'),
('ფინანსური დაგეგმვის საფუძვლები', 'ფინანსური დაგეგმვის ძირითადი პრინციპები და რჩევები...', 'ფინანსები', '10 წუთი'),
('პირადი განვითარების გზამკვლევი', 'როგორ განვავითაროთ პიროვნული უნარები და თვისებები...', 'პირადი განვითარება', '7 წუთი');

-- tips
INSERT INTO tips (title, content, category, is_tip_of_day) VALUES
('დღის რჩევა', 'რეგულარულად შეამოწმეთ თქვენი ფინანსური მდგომარეობა', 'ფინანსები', TRUE),
('დროის მენეჯმენტი', 'გამოიყენეთ პომოდორო ტექნიკა პროდუქტიულობის გასაზრდელად', 'პირადი განვითარება', FALSE),
('უსაფრთხოება', 'რეგულარულად შეცვალეთ პაროლები თქვენს ანგარიშებზე', 'ტექნოლოგიები', FALSE);

-- news
INSERT INTO news (title, content, image_url) VALUES
('ახალი ტექნოლოგიური მიღწევები', 'უახლესი ინფორმაცია ტექნოლოგიურ სიახლეებზე და ინოვაციებზე...', 'https://placehold.co/600x400?text=Tech+News'),
('ეკონომიკური მიმოხილვა', 'მიმდინარე ეკონომიკური ტენდენციები და პროგნოზები...', 'https://placehold.co/600x400?text=Economy'),
('კულტურული ღონისძიებები', 'ინფორმაცია უახლოეს კულტურულ და გასართობ ღონისძიებებზე...', 'https://placehold.co/600x400?text=Culture');

-- recipes
INSERT INTO recipes (title, description, category, prep_time, cook_time, servings, difficulty) VALUES
('ხაჭაპური აჭარული', 'ტრადიციული აჭარული ხაჭაპური კვერცხით', 'ქართული სამზარეულო', 30, 20, 2, 'საშუალო'),
('ჩაშუშული', 'ტრადიციული ქართული კერძი ხორცით და სანელებლებით', 'ქართული სამზარეულო', 20, 60, 4, 'მარტივი'),
('ხინკალი', 'ქართული ხინკალი საქონლის ხორცით', 'ქართული სამზარეულო', 60, 30, 6, 'რთული');

-- ingredients
INSERT INTO ingredients (recipe_id, name, amount, unit) VALUES
(1, 'ფქვილი', '500', 'გრამი'),
(1, 'ყველი', '300', 'გრამი'),
(1, 'კვერცხი', '1', 'ცალი'),
(2, 'ხორცი', '500', 'გრამი'),
(2, 'ხახვი', '2', 'ცალი'),
(2, 'ნიორი', '3', 'კბილი'),
(3, 'ფქვილი', '1', 'კგ'),
(3, 'ხორცი', '700', 'გრამი'),
(3, 'წყალი', '500', 'მლ');

-- steps
INSERT INTO steps (recipe_id, step_number, instruction) VALUES
(1, 1, 'მოზილეთ ცომი ფქვილისგან, წყლისა და მარილისგან'),
(1, 2, 'გააბრტყელეთ ცომი და ჩაყარეთ ყველი'),
(1, 3, 'გამოაცხვეთ 200 გრადუსზე 15-20 წუთი'),
(2, 1, 'დაჭერით ხორცი კუბიკებად'),
(2, 2, 'მოშუშეთ ხახვი და ნიორი'),
(2, 3, 'დაამატეთ ხორცი და სანელებლები'),
(3, 1, 'მოამზადეთ ცომი'),
(3, 2, 'მოამზადეთ შიგთავსი ხორცისგან'),
(3, 3, 'გამოძერწეთ ხინკლები');

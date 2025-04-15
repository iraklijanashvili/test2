# SQLite-დან PostgreSQL-ზე მიგრაციის ინსტრუქცია Supabase-ის გამოყენებით

## შესავალი

ეს ინსტრუქცია გაგატარებთ SQLite მონაცემთა ბაზიდან Supabase-ის PostgreSQL მონაცემთა ბაზაზე მიგრაციის პროცესს. Supabase არის ღია წყაროს Firebase ალტერნატივა, რომელიც იყენებს PostgreSQL-ს და გთავაზობთ ავთენტიფიკაციას, რეალურ დროში განახლებებს და API-ს.

## ნაბიჯი 1: Supabase პროექტის შექმნა

1. შედით [Supabase](https://supabase.com/) ვებგვერდზე და შექმენით ანგარიში (თუ არ გაქვთ)
2. შექმენით ახალი პროექტი:
   - დააჭირეთ "New Project" ღილაკს
   - მიუთითეთ პროექტის სახელი
   - აირჩიეთ რეგიონი (სასურველია თქვენთან ახლოს)
   - დააყენეთ პაროლი (დაიმახსოვრეთ ეს პაროლი!)
   - დააჭირეთ "Create new project"

## ნაბიჯი 2: სქემის მიგრაცია

### 2.1 SQLite სქემის ექსპორტი

პირველ რიგში, უნდა მოვიპოვოთ არსებული სქემა SQLite-დან:

```bash
sqlite3 dev.db .schema > schema.sql
```

### 2.2 სქემის ადაპტაცია PostgreSQL-სთვის

SQLite და PostgreSQL სინტაქსი განსხვავდება. უნდა შევცვალოთ სქემა PostgreSQL-სთვის:

1. შეცვალეთ ტიპები:
   - `INTEGER PRIMARY KEY AUTOINCREMENT` → `serial PRIMARY KEY`
   - `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` → `timestamp DEFAULT now()`
   - `BOOLEAN` ტიპები უცვლელად რჩება, მაგრამ უმჯობესია დაიწეროს პატარა ასოებით: `boolean`

2. თქვენი პროექტის მიგრაციის ფაილები უკვე შეიცავს PostgreSQL-თვის შესაბამის სქემას. იხილეთ `/Users/imac/test2/migrations/0000_ambitious_mephistopheles.sql` და `/Users/imac/test2/migrations/0001_tips_tutorials.sql`.

### 2.3 სქემის შექმნა Supabase-ში

არსებობს რამდენიმე გზა სქემის შესაქმნელად Supabase-ში:

#### ვარიანტი 1: SQL რედაქტორის გამოყენება

1. Supabase დეშბორდში გადადით "SQL Editor" განყოფილებაში
2. დააჭირეთ "New Query"
3. ჩასვით ადაპტირებული SQL სქემა
4. გაუშვით მოთხოვნა

#### ვარიანტი 2: Supabase CLI-ის გამოყენება

1. დააინსტალირეთ Supabase CLI:

```bash
npm install -g supabase
```

2. ინიციალიზაცია:

```bash
supabase login
supabase init
```

3. დააკონფიგურირეთ პროექტი:

```bash
supabase link --project-ref YOUR_PROJECT_ID
```

4. მიგრაციის ფაილების შექმნა და გაშვება:

```bash
supabase migration new initial_schema
# ჩასვით ადაპტირებული SQL სქემა შექმნილ ფაილში
supabase migration up
```

## ნაბიჯი 3: მონაცემების მიგრაცია

### 3.1 მონაცემების ექსპორტი SQLite-დან

მონაცემების ექსპორტისთვის SQLite-დან CSV ფორმატში:

```bash
# ცხრილების სია
sqlite3 dev.db ".tables"

# თითოეული ცხრილისთვის:
sqlite3 -header -csv dev.db "SELECT * FROM recipes;" > recipes.csv
sqlite3 -header -csv dev.db "SELECT * FROM ingredients;" > ingredients.csv
sqlite3 -header -csv dev.db "SELECT * FROM steps;" > steps.csv
sqlite3 -header -csv dev.db "SELECT * FROM news;" > news.csv
sqlite3 -header -csv dev.db "SELECT * FROM tutorials;" > tutorials.csv
sqlite3 -header -csv dev.db "SELECT * FROM tips;" > tips.csv
```

### 3.2 მონაცემების იმპორტი Supabase-ში

#### ვარიანტი 1: Supabase დეშბორდის გამოყენება

1. Supabase დეშბორდში გადადით "Table Editor" განყოფილებაში
2. აირჩიეთ ცხრილი
3. დააჭირეთ "Import" ღილაკს
4. აირჩიეთ CSV ფაილი და დააჭირეთ "Import"
5. გაიმეორეთ ყველა ცხრილისთვის

#### ვარიანტი 2: pgAdmin ან სხვა PostgreSQL კლიენტის გამოყენება

1. დააკავშირეთ pgAdmin Supabase მონაცემთა ბაზასთან (კავშირის დეტალები იხილეთ Supabase დეშბორდში "Settings" > "Database")
2. გამოიყენეთ "Import/Export" ფუნქცია CSV ფაილების იმპორტისთვის

#### ვარიანტი 3: პროგრამული იმპორტი

შეგიძლიათ შექმნათ სკრიპტი, რომელიც წაიკითხავს CSV ფაილებს და ჩაწერს მონაცემებს Supabase-ში API-ის გამოყენებით:

```javascript
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import csv from 'csv-parser'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

// მაგალითი: recipes ცხრილის იმპორტი
fs.createReadStream('recipes.csv')
  .pipe(csv())
  .on('data', async (row) => {
    const { error } = await supabase
      .from('recipes')
      .insert([
        {
          title: row.title,
          description: row.description,
          image_url: row.image_url,
          category: row.category,
          prep_time: parseInt(row.prep_time),
          cook_time: parseInt(row.cook_time),
          servings: parseInt(row.servings),
          difficulty: row.difficulty,
          created_at: row.created_at,
          updated_at: row.updated_at
        }
      ])
    
    if (error) console.error('Error inserting recipe:', error)
  })
```

## ნაბიჯი 4: აპლიკაციის კოდის განახლება

### 4.1 Supabase კლიენტის დამატება

```bash
npm install @supabase/supabase-js
```

### 4.2 კონფიგურაციის განახლება

შექმენით ფაილი `server/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 4.3 .env ფაილის განახლება

```
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@[YOUR_PROJECT_ID].supabase.co:5432/postgres
SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
SUPABASE_KEY=[YOUR_SUPABASE_KEY]
```

### 4.4 მონაცემთა ბაზის ადაპტერის განახლება

განაახლეთ `server/db.ts` ფაილი, რომ გამოიყენოთ PostgreSQL Drizzle ადაპტერი SQLite-ის ნაცვლად:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { recipes as georgianRecipes, ingredients as recipeIngredients, steps as recipeSteps, news, tutorials, tips } from '@shared/schema'
import { eq } from 'drizzle-orm'
import 'dotenv/config'

// ბაზის კავშირის სტრინგი
const connectionString = process.env.DATABASE_URL || ''

// PostgreSQL კავშირის შექმნა
const client = postgres(connectionString)
export const db = drizzle(client)

console.log(`🔌 Using PostgreSQL database`)

// რეცეპტის მიღება ID-ის მიხედვით
export async function getGeorgianRecipeById(id: number) {
  try {
    // რეცეპტის მიღება
    const [recipe] = await db.select().from(georgianRecipes).where(
      eq(georgianRecipes.id, id)
    )

    if (!recipe) {
      return null
    }

    // ინგრედიენტების მიღება
    const ingredients = await db.select().from(recipeIngredients).where(
      eq(recipeIngredients.recipeId, id)
    )

    // ნაბიჯების მიღება
    const steps = await db.select().from(recipeSteps).where(
      eq(recipeSteps.recipeId, id)
    ).orderBy(recipeSteps.stepNumber)

    // სრული რეცეპტის დაბრუნება
    return {
      ...recipe,
      ingredients,
      steps
    }
  } catch (error) {
    console.error('Error getting recipe by ID:', error)
    throw error
  }
}

// დანარჩენი ფუნქციები...
```

### 4.5 დამოკიდებულებების დამატება

```bash
npm install postgres drizzle-orm@latest
```

ან შეგიძლიათ განაახლოთ თქვენი package.json ფაილი შემდეგნაირად:

```json
{
  "dependencies": {
    // სხვა დამოკიდებულებები...
    "postgres": "^3.4.3",
    "drizzle-orm": "^0.29.3"
  }
}
```

და შემდეგ გაუშვათ:

```bash
npm install
```

## ნაბიჯი 5: აპლიკაციის ტესტირება

1. ლოკალურად გაუშვით აპლიკაცია ახალი კონფიგურაციით:

```bash
npm run dev
```

2. შეამოწმეთ, რომ ყველა ფუნქციონალი მუშაობს კორექტულად
3. შეამოწმეთ ლოგები შეცდომების დასადგენად

## ნაბიჯი 6: დეპლოიმენტი

1. განაახლეთ Render.com-ის კონფიგურაცია ახალი გარემოს ცვლადებით:
   - `DATABASE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`

2. გადააგზავნეთ ცვლილებები GitHub-ზე და დეპლოი გააკეთეთ Render.com-ზე

## დამატებითი რჩევები

1. **ბექაპი**: ყოველთვის შექმენით SQLite მონაცემთა ბაზის ბექაპი მიგრაციამდე
2. **ტესტირება**: ჯერ ტესტურ გარემოში გატესტეთ მიგრაცია
3. **ინდექსები**: დარწმუნდით, რომ ყველა საჭირო ინდექსი გადატანილია PostgreSQL-ში
4. **ტრანზაქციები**: გამოიყენეთ ტრანზაქციები დიდი მოცულობის მონაცემების იმპორტისას
5. **მონიტორინგი**: გამოიყენეთ Supabase-ის მონიტორინგის ინსტრუმენტები პრობლემების დასადგენად

## Supabase-ის უპირატესობები

- **მასშტაბირება**: PostgreSQL უკეთესად მასშტაბირდება, ვიდრე SQLite
- **მრავალი მომხმარებელი**: ერთდროულად რამდენიმე მომხმარებლის მხარდაჭერა
- **დამატებითი სერვისები**: ავთენტიფიკაცია, სტორიჯი, რეალურ დროში განახლებები
- **API**: ავტომატურად გენერირებული RESTful და GraphQL API
- **ექსტენციები**: PostgreSQL-ის მძლავრი ექსტენციების მხარდაჭერა

მიგრაციის შემდეგ, თქვენი აპლიკაცია ისარგებლებს Supabase-ის ყველა უპირატესობით და მზად იქნება მასშტაბირებისთვის.
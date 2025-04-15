# Netlify-ზე ფრონტენდის და ბექენდის დაკავშირების ინსტრუქცია

## პრობლემა

Netlify-ზე ჰოსტინგისას ფრონტენდი ვერ უკავშირდება Render.com-ზე განთავსებულ ბექენდს. ეს შეიძლება გამოწვეული იყოს რამდენიმე მიზეზით:

1. CORS (Cross-Origin Resource Sharing) შეზღუდვები
2. API მისამართის არასწორი კონფიგურაცია
3. Netlify-ის რედირექტების არასწორი კონფიგურაცია

## გადაწყვეტა

### 1. API მისამართის კონფიგურაცია

შეამოწმეთ `client/src/lib/config.ts` ფაილში API_BASE_URL კონფიგურაცია:

```typescript
// დაჰოსტილი გარემო - beamish-fox-7ea396.netlify.app
if (window.location.hostname.includes('netlify.app')) {
  // დაჰოსტილი ბექენდის მისამართი Render.com-ზე
  return 'https://universal-toolkit-server.onrender.com'; // დაჰოსტილი ბექენდის URL
}
```

დარწმუნდით, რომ მითითებული URL არის სწორი და ბექენდი მუშაობს ამ მისამართზე. შეგიძლიათ შეამოწმოთ ბექენდის მუშაობა ბრაუზერში URL-ის გახსნით (მაგ., `https://universal-toolkit-server.onrender.com/api/health`).

### 2. Netlify-ის კონფიგურაცია

განაახლეთ `netlify.toml` ფაილი, რომ დაამატოთ პროქსი API მოთხოვნებისთვის:

```toml
[build]
  command = "npm run build"
  publish = "dist/public"

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

### 3. ფრონტენდის კოდის განახლება

თუ გსურთ გამოიყენოთ ფარდობითი URL-ები API მოთხოვნებისთვის, შეგიძლიათ შეცვალოთ `client/src/lib/config.ts` ფაილი:

```typescript
// API კონფიგურაცია

// ბექენდის მისამართი გარემოს მიხედვით
export const API_BASE_URL = (() => {
  // ლოკალური გარემო
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  
  // დაჰოსტილი გარემო - netlify.app
  if (window.location.hostname.includes('netlify.app')) {
    // გამოიყენეთ ფარდობითი URL, რომელიც გადამისამართდება netlify.toml-ის წესებით
    return '';
  }
  
  // სხვა გარემოებისთვის
  return '';
})();
```

ამ ცვლილებით, API მოთხოვნები გაიგზავნება ფარდობით URL-ზე (მაგ., `/api/georgian-recipes`), რომელიც შემდეგ გადამისამართდება Netlify-ის რედირექტის წესებით.

### 4. CORS კონფიგურაცია ბექენდზე

დარწმუნდით, რომ ბექენდის CORS კონფიგურაცია ნებას რთავს მოთხოვნებს Netlify დომენიდან. შეამოწმეთ `server/index.ts` ფაილში CORS კონფიგურაცია:

```typescript
// CORS კონფიგურაცია
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "https://beamish-fox-7ea396.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400 // CORS preflight cache 24 საათი
}));
```

დაამატეთ თქვენი Netlify დომენი `origin` მასივში, თუ ის განსხვავდება ზემოთ მითითებულისგან.

### 5. ცვლილებების დეპლოიმენტი

1. განაახლეთ კოდი და ატვირთეთ GitHub რეპოზიტორიაში
2. გადააგზავნეთ ცვლილებები Netlify-ზე (ავტომატურად მოხდება, თუ CI/CD კონფიგურირებულია)
3. გადააგზავნეთ ცვლილებები Render.com-ზე (ბექენდისთვის, თუ CORS კონფიგურაცია შეცვალეთ)

## დამატებითი რჩევები

1. გამოიყენეთ Netlify-ის ფუნქცია "Functions" ან "Edge Functions" მცირე ბექენდ ფუნქციონალისთვის
2. თუ ბექენდი მოითხოვს ავთენტიფიკაციას, დარწმუნდით რომ credentials გადაეცემა სწორად
3. შეამოწმეთ ბრაუზერის კონსოლი CORS შეცდომების დასადგენად
4. გამოიყენეთ Netlify-ის ლოგები პრობლემების დიაგნოსტიკისთვის

## ტესტირება

ცვლილებების შემდეგ, შეამოწმეთ API კავშირი ბრაუზერის კონსოლში:

```javascript
fetch('/api/georgian-recipes')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```
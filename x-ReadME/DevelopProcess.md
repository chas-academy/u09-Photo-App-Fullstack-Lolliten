## Förarbete

    → Gör undersökning:
            ○ Skapa Google form, skicka ut.
            ○ Sammanställ svar
    → Figma:
            ○ Skapa lowfi prototyp
            ○ Skapa highfi prototyp
    → Sitemap:
            ○ Skapa  sitemap lägg in i Figma
    → ER-diagram:
            ○ Skapa ER-diagram lägg in i Figma
    
    
## Backend

    - Cd till önskad mapp
    - Git clone <project-url> från Github cd <project>
    - Skapa backend server mapp och frontend client mapp
    - Cd server
    - Npm init -y
    - npm i express nodemon

    - Npm i mongodb mongoose dotenv cors

    Cors:
        npm install cors (för att kunna importa från backend och server)
        (kom ihåg import cors i komponenter och app.use(cors()) i app.jsx)
        (cors kan användas bara på vissa routes (endpoints) men vanligast sätta app.use(cors()) i början av projekt då följer alla routes under där cors))
        (cors separerar frontend och backend och skapar ett slags middleware)
        (cors ställs in på backend och frontend och bestämmer vad som får hämtas till frontenden)
    
```
- Npm i multer

https://www.npmjs.com/package/multer
Uppladdning react
Don't forget the enctype="multipart/form-data" in your form.
Define Multer where to store your images, the upload dest should only store refs.
```
Tre middleware man ofta kan vilja använda är :
express.urlencoded och Express.json 
(i gamla tutorials kan de beskrivas som bodyparser.json eller bodyparser.urlencoded)
Exempel:
app.use(espress.urlencoded({extended:true}))
app.use(express.json())
Cors middleware för att köra API:et mellan två servrar:
app.use(cors())

Package.json :
Include more scripts like: build, start, lint

npm update --save (uppdatera alla dependencies till senaste version)

Filstruktur:
    -Skapa filstruktur:

    config
    src
        routes
        models
        db
        controllers
        server.js
        auth.js
    .gitignore
    package.json
    

Se till att alla scripts och main är rätt inställda för TS och dist:

Tester: 
    - Skapa test mapp för alla tester och lägg till i scripts (src/tests/*).
    - npx ts-jest config:init (Skapar config för jest)
    - npm test (för att testa)

Felsökning, kolla så mappar ligger rätt, kolla stavning, se terminalen i vs code, kolla konsolen i browser osv.

## MongoDB

    - Skapa nytt cluster/databas:
        ○ New connection
        ○ Användarnamn + lösenord
        ○ Copy connection string
    - Klistra in connection string i db.ts filen:
    - Välj cluster i Atlas GUI och connecta. 
    - Lägg in mockdata i databas (finns som val i Atlas)

## Frontend

    - npm create vite@latest 
    https://vitejs.dev/guide/

    - Cd till Frontend om du har en sådan
    - npm create vite@latest (installerar vite, skapar en ny mapp som du får döpa. Jag hade redan en Frontend mapp, så kopierade allt i nya vite mappen och la i Frontend och raderade sedan vite mappen, efter valt namn på projekt välj React sen TypeScript eller TypeScript med SWC som är en snabb web compiler bibliotek)
    - Kör nu:
     cd Frontend (eller valt projektnamn)
      npm install
      npm run dev

Cors:
    - npm install cors (för att kunna importa från backend och server)
    - npm install @types/cors (för cors TS)
    (kom ihåg import cors i komponenter och app.use(cors()) i app.tsx)

Dependencies:
    - Installera dependencies: (kopierar från tidigare projekt, tar bort det jag inte behöver)

    - npm update --save (uppdatera alla dependencies till senaste version)

    - npm run dev (för att se så allt funkar)
    
Filstruktur:
    - Skapa filstruktur och komponenter

 src/
    ├── assets/
    ├── api/
    ├── configs/
    ├── components/
    │   ├── SignUpForm.tsx
    │   ├── Employees.tsx
    │   ├── PaymentForm.tsx
    │   └── Button.tsx
    ├── hooks/
    │   ├── usePayment.ts
    │   ├── useUpdateEmployee.ts
    │   ├── useEmployees.ts
    │   └── useAuth.tsx
    ├── lib/
    ├── services/
    ├── states/
    └── utils/

Börja koda:
    - Starta med login och register design
    - Profile dashboard
    - Edit profile
    - Welcome
    - Navbar
    - Search
    - Widgets
    - Comments

    - Använda fetch för anrop till backend.

## GitHub Workflow:

    - Skapa projekt och lägg in issues.
    - Koppla issue till branch på github.
    - Jobba med små issues och försök avsluta 1-2 issues per dag.
    - Rebase eller squash and merge om branchen har många commits. 

## Deploya

    - Frontend Netlify
    - Backend Render
(Auto update kopplat till main brach)
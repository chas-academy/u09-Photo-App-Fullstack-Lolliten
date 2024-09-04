    
    Backend:

    - Cd till önskad mapp
    - Git clone <project-url> från Github, sen cd <project>
    - Skapa server mapp och frontend mapp
    - Cd server
    - Npm init -y (skapar package.json fil)
    - npm i express nodemon mongodb mongoose

     - importera express i app eller index (eller använd require, valfritt dock börjar require bli deprecated)

     nodemon app.js för att starta backend (alt index.js/ts)

    Backend setup klar.

    Forts.

    Skapa fil-system:
        - models
        - controllers
        - views
        - routes
        - middleware

        - main.js: 
        - app.js:
        - index.js: 

    - Skapa Crud i routes users
    - 

    
    Frontend: 

    - Cd client
    - npm create vite@latest 
    (installerar vite, skapar en ny mapp som du får döpa. Jag hade en Frontend mapp, så kopierade allt i nya vite mappen och la i Frontend och raderade sedan vite mappen. 
    Efter valt namn på projekt välj React sen TypeScript eller TypeScript med SWC som är en snabb web compiler bibliotek)
    - cd client
    - npm install
    - npm run dev (startar vite/react)

    - fetch eller axios för att koppla ihop front med backend api.

    - skapa fil-system

    - Använd Redux istället för useStates, skapar states globalt för hela front

    - package.json eslint config: ??  
    "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
    "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }

MongoDB:

- Gå till https://www.mongodb.com/ logga in, ladda ner compass (Atlas UI)
- Skapa nytt cluster/databas:
        ○ New connection
        ○ Användarnamn + lösenord
        ○ Copy connection string 

- Connecta till compass

- Klistra in connection string i db.ts filen i node
    Kan se ut nåt sånt här: (eller gör en mongoose connection)

```js
    const connectDB = async () => {
      try {
        const mongoURI: string =
          "mongodb+srv://lolo:<lösenord>@u09-cluster.jn5av.mongodb.net/"; //ditt eget lösenord
        await connect(mongoURI);
        console.log("MongoDB Connected!");
      } catch (err: any) {
        console.error(err.message);
        console.log("Connection failed...");
        // Exit process with failure
        process.exit(1);
      }
    };

export default connectDB;
```

importera connctDB i app eller index (den du använder) och intitera conncetDB; 

Extra:

npm run dev (för att se så allt funkar)

npm update --save (uppdatera alla dependencies till senaste version)

Cors:
    (config av cors senare i projekt)
    https://dev.to/speaklouder/how-to-configure-cors-in-nodejs-with-express-11h
    - npm install cors (för att kunna importa från backend och server)
    (kom ihåg import cors i komponenter och app.use(cors()) i app.jsx)
    (cors kan användas bara på vissa routes (endpoints) men vanligast sätta app.use(cors()) i början av projekt då följer alla routes under där cors)
   

## To Do:

Branches with issues:

git fetch origin
git checkout 5-check-appfileuploaderjsx

git fetch origin
git checkout 4-create-login-form


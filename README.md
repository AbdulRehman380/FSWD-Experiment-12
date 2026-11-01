# EX-11 Portfolio

## Run locally

1. Install Node.js 18 or newer and start a MongoDB server, or create a MongoDB Atlas database.
2. Install the project dependencies:

   ```powershell
   npm install
   ```

3. Create your local environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

   If you use MongoDB Atlas, replace `MONGO_URI` in `.env` with your connection string.
4. Build the React frontend and start the Express server:

   ```powershell
   npm start
   ```

5. Open <http://localhost:5107>.

The server builds the frontend into `public/` each time `npm start` runs. The API and frontend are served by the same server.

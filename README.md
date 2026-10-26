# Student Management System (CA-03) - PRN 25070521144

Full-stack app: **React (Vite)** client + **Node.js/Express** server + **MongoDB** (Users, Students).

## Run it
1. Start MongoDB (open MongoDB Compass and connect to `mongodb://127.0.0.1:27017`).
2. Server:
   ```
   cd server
   npm install
   npm start        # http://localhost:5000
   ```
3. Client (new terminal):
   ```
   cd client
   npm install
   npm run dev      # http://localhost:5173
   ```
4. Open http://localhost:5173, click **Create an account**, then log in.

## API (all `/api/students` routes need the login token)
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Log in, returns JWT |
| GET | /api/students?search= | List / search |
| GET | /api/students/:id | View details |
| POST | /api/students | Add |
| PUT | /api/students/:id | Edit |
| DELETE | /api/students/:id | Delete |

## Push to GitHub (repo name: 25070521144-CA-03)
```
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/<your-username>/25070521144-CA-03.git
git push -u origin main
```

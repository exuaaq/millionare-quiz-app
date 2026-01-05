# Ko želi biti milioner? - Kviz aplikacija
Eldar Alić
Eniz Dajić
Feđa Čoloman

## Arhitektura

### Backend (Express.js)
- **Express.js** server sa TypeScript
- **RESTful API** sa JWT autentifikacijom
- **MySQL** baza podataka
- **Bcrypt** za hashovanje lozinki
- **CORS** konfiguracija

### Frontend (React + Vite)
- **React 19** sa TypeScript
- **Vite** za brzi development
- **React Router** za client-side routing
- **Axios** za API pozive
- **Tailwind CSS** + **Radix UI** komponente
- **JWT token** storage u localStorage

## Pokretanje projekta

### Preduslovi
- Node.js 18+ 
- MySQL baza podataka
- npm ili pnpm

### Instalacija

1. Instalirajte dependencies: `npm run install:all`
2. Konfigurišite backend: `.env` fajl
3. Dodati u mySQL iz foldera `scripts`
4. Pokrenite sa `npm run dev`

Backend: `http://localhost:5000`
Frontend: `http://localhost:5173`

## API Endpoints

- Auth: `/api/auth/*`
- Quiz: `/api/quiz/*`
- Users: `/api/users/*`
- Admin: `/api/admin/*`
- Leaderboard: `/api/leaderboard/*`
- Games: `/api/games/*`

## Sigurnost

- JWT autentifikacija
- Bcrypt hashovanje lozinki
- CORS zaštita
- Input validacija sa Zod

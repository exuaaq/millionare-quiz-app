# Ko želi biti milioner? - Kviz aplikacija
- Eldar Alić
- Eniz Dajić
- Feđa Čoloman

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

## Uloge
### **Član 1: Eldar Alić**
**Uloga:** Backend Developer & Database Administrator

**Obavljeni zadaci:**
- Postavljanje i konfiguracija Express.js servera sa TypeScript-om
- Implementacija RESTful API strukture i svih endpoint-ova
- Dizajn i kreiranje MySQL baze podataka šeme
- Implementacija autentifikacije i autorizacije koristeći JWT (JSON Web Tokens)
- Integracija Bcrypt biblioteke za sigurno hashovanje korisničkih lozinki
- Kreiranje API endpoint-ova: 
  - `/api/auth/*` - Registracija, login, logout
  - `/api/users/*` - Upravljanje korisničkim profilima
  - `/api/games/*` - CRUD operacije za kviz igre
- Konfiguracija CORS politika za frontend-backend komunikaciju
- Input validacija koristeći Zod biblioteku
- Priprema SQL skripti za inicijalizaciju baze podataka
- Pisanje dokumentacije za backend API
- Testiranje backend funkcionalnosti i sigurnosnih mehanizama

---

### **Član 2: Eniz Dajić**
**Uloga:** Frontend Developer & UI/UX Designer

**Obavljeni zadaci:**
- Postavljanje React 19 projekta sa Vite build tool-om
- Implementacija TypeScript konfiguracije za frontend
- Dizajn i implementacija korisničkog interfejsa (UI)
- Integracija Tailwind CSS framework-a za stilizovanje
- Implementacija Radix UI komponenti za pristupačan i moderan interfejs
- Kreiranje i upravljanje ruta koristeći React Router v6
- Razvoj glavnih komponenti aplikacije:
  - Login/Register forme
  - Dashboard stranica
  - Quiz interfejs sa pitanjima i odgovorima
  - Leaderboard (tabela rezultata)
  - Admin panel
- Implementacija responsive dizajna za različite veličine ekrana
- State management i data flow između komponenti
- Integracija animacija pomoću tailwindcss-animate
- Testiranje korisničkog iskustva (UX) na različitim uređajima

---

### **Član 3: Feđa Čoloman**
**Uloga:** Full-Stack Integration Engineer & DevOps

**Obavljeni zadaci:**
- Integracija frontend-a i backend-a
- Konfiguracija Axios klijenta za HTTP zahteve
- Implementacija API poziva iz React komponenti ka Express serveru
- Upravljanje JWT token-ima u localStorage-u
- Kreiranje API endpoint-ova: 
  - `/api/quiz/*` - Dohvatanje pitanja, provera odgovora, prikaz rezultata
  - `/api/admin/*` - Admin funkcionalnosti (dodavanje pitanja, upravljanje korisnicima)
  - `/api/leaderboard/*` - Prikaz najboljih igrača i statistika
- Konfiguracija . env fajlova za environment varijable
- Postavljanje concurrent skripta za paralelno pokretanje frontend-a i backend-a
- Implementacija error handling-a i loading states
- Kreiranje build skripti za produkcijsko okruženje
- Dokumentovanje instalacionih koraka i pokretanja projekta
- Integracija form validacije pomoću React Hook Form i Zod resolvers
- Debugging i optimizacija performansi aplikacije
- Priprema projekta za deployment

---

-- =====================================================
-- MYSQL VERZIJA:  Kreiranje tabela za "Ko zeli biti milioner?"
-- Baza: MySQL 8.0+
-- =====================================================
--
-- UPUTSTVO ZA POKRETANJE:
-- 1. Instaliraj MySQL 8.0+ na svom računaru
-- 2. Otvori MySQL Workbench ili Command Line
-- 3. Pokreni ovu skriptu:  source /path/to/mysql-setup-database.sql
-- 4. Ili kopiraj i zalepi sve u MySQL editor i izvrši
--
-- NAPOMENA:
-- - Skript automatski kreira bazu podataka ako ne postoji
-- - Tabele se kreiraju samo ako vec ne postoje
-- - Siguran za ponovno pokretanje
-- =====================================================

-- Provjeri da li baza postoji i kreiraj je
DROP DATABASE IF EXISTS millionaire_quiz;
CREATE DATABASE millionaire_quiz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE millionaire_quiz;

-- =====================================================
-- MODEL 1: USERS (Korisnici)
-- Cuva podatke o registriranim korisnicima
-- =====================================================
CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                       INDEX idx_users_email (email),
                       INDEX idx_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- MODEL 2: QUESTIONS (Pitanja)
-- Cuva sva pitanja za kviz sa odgovorima
-- =====================================================
CREATE TABLE questions (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           question_text TEXT NOT NULL,
                           option_a VARCHAR(255) NOT NULL,
                           option_b VARCHAR(255) NOT NULL,
                           option_c VARCHAR(255) NOT NULL,
                           option_d VARCHAR(255) NOT NULL,
                           correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
                           difficulty INT NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 15),
                           category VARCHAR(100) DEFAULT 'Opce znanje',
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                           INDEX idx_questions_difficulty (difficulty),
                           INDEX idx_questions_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- MODEL 3: GAMES (Igre)
-- Cuva historiju odigranih igara
-- =====================================================
CREATE TABLE games (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       user_id INT NOT NULL,
                       score INT NOT NULL DEFAULT 0,
                       questions_answered INT NOT NULL DEFAULT 0,
                       prize_won INT NOT NULL DEFAULT 0,
                       completed BOOLEAN DEFAULT FALSE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       finished_at TIMESTAMP NULL,

                       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                       INDEX idx_games_user_id (user_id),
                       INDEX idx_games_score (score DESC),
                       INDEX idx_games_completed (completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- POTVRDA I PROVJERA
-- =====================================================
SELECT 'Baza podataka uspjesno kreirana!' AS status;
SELECT TABLE_NAME, TABLE_ROWS
FROM information_schema. TABLES
WHERE TABLE_SCHEMA = 'millionaire_quiz';
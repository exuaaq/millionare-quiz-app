-- =====================================================
-- MYSQL VERZIJA: Seed podataka - IT Pitanja za kviz
-- 15 pitanja za kompletnu igru (IT tematika)
-- =====================================================

USE millionaire_quiz;

-- =====================================================
-- LAKA PITANJA (1-5) - 100 do 1.000 BAM
-- =====================================================

INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, category) VALUES
('Sta znaci skracenica CPU? ', 'Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit', 'A', 1, 'IT'),
('Koji je najpopularniji web pretraživač?', 'Firefox', 'Safari', 'Chrome', 'Edge', 'C', 2, 'IT'),
('Sta je RAM? ', 'Radna memorija', 'Hard disk', 'Graficka kartica', 'Procesor', 'A', 3, 'IT'),
('Koja ekstenzija oznacava tekstualni fajl?', '. exe', '.jpg', '.txt', '.mp3', 'C', 4, 'IT'),
('Koji programski jezik se koristi za kreiranje web stranica?', 'Python', 'HTML', 'C++', 'Java', 'B', 5, 'IT'),

-- =====================================================
-- SREDNJA PITANJA (6-10) - 2.000 do 32.000 BAM
-- =====================================================

('Koja kompanija je napravila operativni sistem Windows?', 'Apple', 'Google', 'Microsoft', 'IBM', 'C', 6, 'IT'),
('Sta je JavaScript?', 'Programski jezik', 'Baza podataka', 'Operativni sistem', 'Web server', 'A', 7, 'IT'),
('Koliko bita ima jedan bajt?', '4', '8', '16', '32', 'B', 8, 'IT'),
('Ko je kreator programskog jezika Python?', 'Guido van Rossum', 'James Gosling', 'Bjarne Stroustrup', 'Dennis Ritchie', 'A', 9, 'IT'),
('Sta je SQL?', 'Jezik za upite u bazama podataka', 'Programski jezik za web', 'Operativni sistem', 'Tip procesora', 'A', 10, 'IT'),

-- =====================================================
-- TEŠKA PITANJA (11-15) - 64.000 do 1.000.000 BAM
-- =====================================================

('U kojoj godini je napravljen prvi programabilni računar ENIAC?', '1936', '1946', '1956', '1966', 'B', 11, 'IT'),
('Koji protokol se koristi za siguran prenos podataka preko interneta?', 'HTTP', 'FTP', 'HTTPS', 'SMTP', 'C', 12, 'IT'),
('Sta predstavlja skracenica API?', 'Application Programming Interface', 'Advanced Program Integration', 'Automated Process Identifier', 'Application Process Integration', 'A', 13, 'IT'),
('Koja struktura podataka radi po FIFO principu?', 'Stack', 'Queue', 'Tree', 'Graph', 'B', 14, 'IT'),
('Koji algoritam sortiranja ima prosjecnu vremensku slozenost O(n log n)?', 'Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Selection Sort', 'C', 15, 'IT');

-- Potvrda unosa
SELECT CONCAT('Uspjesno uneseno ', COUNT(*), ' IT pitanja!') AS status FROM questions WHERE category = 'IT';
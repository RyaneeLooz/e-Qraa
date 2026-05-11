-- ==========================================================
-- E-QRAA DATABASE INITIALIZATION
-- This script fulfills all technical requirements:
-- 1. Three tables: Simple, with FK, and Associative (M-N)
-- 2. ALTER, INSERT, UPDATE, DELETE, SELECT, GROUP BY, HAVING
-- ==========================================================

-- 1. TABLE SANS CLÉ ÉTRANGÈRE (Simple)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student', -- student, instructor, admin
    coins INT DEFAULT 0,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLE AVEC CLÉ ÉTRANGÈRE (1-N)
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    price INT NOT NULL,
    category VARCHAR(50),
    instructor_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLE ASSOCIATIVE (Relation Plusieurs-à-Plusieurs : M-N)
CREATE TABLE enrollments (
    student_id INT REFERENCES users(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id)
);

-- 2. REQUÊTE DE TYPE ALTER
-- Ajout d'une colonne pour la biographie des instructeurs
ALTER TABLE users ADD COLUMN bio TEXT;

-- 3. MANIPULATION DE DONNÉES (DML)

-- INSERT : Ajout d'utilisateurs et de cours
INSERT INTO users (name, email, password, role, coins) VALUES 
('Ahmed Prof', 'ahmed@eqraa.com', 'hash_pass_1', 'instructor', 0),
('Sara Student', 'sara@mail.com', 'hash_pass_2', 'student', 5000),
('Admin e-Qraa', 'admin@eqraa.com', 'hash_pass_3', 'admin', 0);

INSERT INTO courses (title, price, category, instructor_id) VALUES 
('Maîtriser React JS', 2490, 'Développement', 1),
('Mathématiques Bac 2026', 0, 'Scolaire', 1),
('Design UI/UX Pro', 1990, 'Design', 1);

-- UPDATE : Créditer des coins à un utilisateur
UPDATE users SET coins = coins + 1500 WHERE id = 2;

-- DELETE : Supprimer un cours (ex: id 3)
DELETE FROM courses WHERE id = 3;

-- 4. REQUÊTE DE TYPE SELECT
SELECT * FROM courses WHERE price > 0;

-- 5. REQUÊTE AVEC GROUP BY ET FONCTION D'AGRÉGATION
SELECT category, COUNT(*) as total_courses, AVG(price) as average_price
FROM courses
GROUP BY category;

-- 6. REQUÊTE UTILISANT HAVING
SELECT instructor_id, COUNT(*) as courses_count
FROM courses
GROUP BY instructor_id
HAVING COUNT(*) > 1;

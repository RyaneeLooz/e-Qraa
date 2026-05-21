# e-Qraa: Project Overview and Presentation Guide

## 🌟 General Vision

**Project Name:** e-Qraa  
**Main Objective:** Create a modern and accessible educational marketplace, specifically designed for the Algerian context, facilitating the meeting between qualified trainers and students.  
**Problem Solved:** Lack of centralized platforms for online learning in Algeria, difficulty in payment (absence of international cards), and the need for rigorous validation of trainers' skills.

**Target Audience:**
- Students (university, school, professional) looking for quality training.
- Teachers and experts wishing to monetize their knowledge.
- Administrators looking to regulate and ensure educational quality.

**Project Utility:** Democratizes access to knowledge with a local payment system (Coins), offers an intuitive and premium interface, and guarantees quality via a manual verification process.

---

## 🏗️ Complete Architecture

- **Frontend:** React 19 with Vite for exceptional development and rendering speed.
- **Backend:** Node.js with Express.js, offering a robust and scalable RESTful architecture.
- **Communication:** Asynchronous HTTP requests via the Fetch API, secured by JWT Tokens (JSON Web Tokens).
- **Database:** PostgreSQL for integral relational data management (users, courses, enrollments).

### Technological Choices
| Technology | Reason |
| :--- | :--- |
| **React & Vite** | Reusable components, virtual DOM for performance, and ultra-fast hot reloading with Vite. |
| **Tailwind CSS v4** | Premium design, responsive and extremely fast to implement without bulky CSS files. |
| **Node/Express** | Unified JavaScript ecosystem (JS everywhere), efficient management of non-blocking I/O. |
| **PostgreSQL** | Transaction reliability, support for complex relations, and scalability for thousands of users. |

---

## 📂 Folder and File Structure

### Backend
- `config/db.js`: Configuration of the PostgreSQL pool connection. Centralizes database access.
- `controllers/`: Business logic. Processes requests, interacts with the DB, and returns JSON responses.
- `middleware/`: Security filters. `auth.js` verifies the JWT, `checkRole.js` restricts access according to role (Admin/Prof).
- `routes/`: Definition of API entry points. Links URLs to controller methods.
- `uploads/`: Physical storage of profile pictures and course thumbnails.
- `server.js`: Main entry point. Initializes Express, global middlewares, and routes.

### Frontend
- `src/components/`: Reusable UI elements (Navbar, Footer, Spinner, CourseCard).
- `src/context/AuthContext.jsx`: Application brain. Manages global user state, Coins balance, and cart.
- `src/pages/`: Main views (Dashboard, Marketplace, Admin, Cart).
- `src/services/api.js`: API abstraction layer. Groups all Fetch calls for easy maintenance.
- `App.jsx`: Main route manager (React Router).

---

## 💻 Technical Details

### Frontend Details
- **State Management:** Use of React's Context API to avoid prop drilling and share user state globally.
- **Routing:** React Router DOM for smooth Single Page Application (SPA) navigation without page reloads.
- **UI/UX:** 'Glassmorphism' and 'Clean UI' design with modern gradients and subtle animations for a premium experience.
- **API Calls:** Encapsulated in objects (authAPI, coursesAPI, etc.) with centralized management of security headers.

### Backend Details
- **Security:** Password hashing (Bcrypt), protection against SQL injections via parameterized queries, and JWT authentication.
- **Error Management:** Global error middleware returning clear messages to the frontend to improve user experience.
- **API Design:** REST architecture respecting standard HTTP codes (200 OK, 201 Created, 401 Unauthorized, 500 Error).

---

## 🔄 Operating Flow

1. **Loading:** The site checks if a valid JWT Token is present in localStorage.
2. **Authentication:** AuthContext retrieves the full profile (balance, role) from the backend.
3. **Navigation:** The user explores courses (GET request to `/api/courses`).
4. **Action:** The user adds a course to the cart (local state) and then pays (POST request to `/api/enrollments`).
5. **Persistence:** The server verifies the balance, deducts coins, creates the enrollment, and responds to the client.
6. **Update:** The frontend refreshes the balance and displays a success message.

---

## ⭐ Key Features

1. **e-Qraa Coins System**
   - *Operation:* Virtual currency allowing users to bypass online payment limits in Algeria.
   - *Technical:* Server-side calculations with SQL transactions to guarantee balance integrity.

2. **Admin Panel & Validation**
   - *Operation:* Manual validation of trainers to ensure pedagogical quality.
   - *Technical:* Role system and flags (`is_verified`) in the database.

3. **Promo Codes**
   - *Operation:* Marketing and loyalty via recharge codes.
   - *Technical:* `promo_codes` table with use limits (`max_uses`) and state (Active/Expired).

---

## 🛡️ Difficulties and Solutions

- **Problem:** Desynchronization of the Coins balance between the frontend and backend.
  - **Solution:** Implementation of a `refreshUser()` function called after each major transaction to ensure the frontend always reflects the database.
- **Problem:** Complexity of role management (Admin/Prof/Student).
  - **Solution:** Creation of a dynamic `checkRole` middleware on the backend capable of checking multiple roles simultaneously.

---

## 🔮 Future Perspectives

- Native mobile application (React Native) using the same backend.
- Live course system (WebRTC / Zoom Integration).
- Artificial Intelligence to recommend courses based on the student's profile.

---

## 🎤 Oral Presentation Summaries

- **2 Minutes:** e-Qraa is an innovative educational marketplace for Algeria. We built a complete platform with React and Node.js using a virtual currency system 'e-Qraa Coins' to facilitate access to knowledge. Strengths include JWT security, a PostgreSQL database for payment integrity, and a robust admin panel for moderation.
- **5 Minutes:** Presentation of the problem (payment and quality) -> e-Qraa Solution -> Quick Demo (Marketplace, Purchase, Dashboard) -> Technical focus (REST Architecture, Context API for state, Security middlewares) -> Conclusion on added value.
- **10 Minutes:** Detailed explanation of the MERN stack (Postgres instead of Mongo) -> Code walkthrough (Express Routes, Transaction logic for enrollment) -> Presentation of gamification (Leaderboard) -> Security analysis (JWT, Bcrypt) -> Prepared Q&A session.

### Anticipated Jury Questions
- **Q: Why choose PostgreSQL over MongoDB?**
  - **A:** For the integrity of financial data (Coins). SQL transactions guarantee that if a payment fails, no coin is lost and no enrollment is mistakenly created.
- **Q: How do you handle the security of uploaded files?**
  - **A:** Files are served statically via Express, and we limit the types of accepted files to prevent the execution of malicious scripts.
- **Q: How does the cart system survive a page refresh?**
  - **A:** The cart is stored in `localStorage` via `AuthContext`, allowing persistence without a database for unpurchased items.

---

## 🎯 Conclusion

This project demonstrates complete mastery of the web development lifecycle (Fullstack). Beyond the technical aspect, it responds to a real societal need in Algeria by modernizing access to quality education.

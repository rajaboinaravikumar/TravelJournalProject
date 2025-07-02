# 🧳 Travel Journal Web Application

An interactive web application that allows users to record and share their travel experiences. Users can create journal entries, upload photos, tag visited locations, and view their journeys in a timeline format. This project emphasizes user-generated content, multimedia handling, and dynamic content sharing.

---

## ✨ Features

- 📌 Add and edit travel entries with text and images
- 🖼️ Upload and manage photos for each travel journal
- 🗺️ Tag locations using map coordinates or city names
- 📤 Share travel experiences with other users
- 🕒 Timeline view to visualize journeys in chronological order
- 🔐 Secure login/signup system with JWT authentication
- ⚙️ Responsive UI design for mobile and desktop

## 🛠️ Technologies Used

### 🔹 Frontend (React.js)
- **React.js** – For building the user interface
- **React Router** – For navigation between pages
- **Axios** – For API requests to the backend
- **Bootstrap / Tailwind CSS** – For responsive styling
- **HTML5 & CSS3** – Base structure and design
- **JavaScript (ES6+)** – Dynamic frontend logic

### 🔹 Backend (Node.js + Express)
- **Node.js** – Server-side JavaScript runtime
- **Express.js** – RESTful API creation
- **MongoDB** – NoSQL database for storing entries and user data
- **Mongoose** – MongoDB ODM for schema and query building
- **Multer** – Handling image uploads and file storage
- **JWT (JSON Web Token)** – For authenticating users
- **bcrypt.js** – For password hashing
- **Dotenv** – For environment variable management
- **Cors** – Handling frontend-backend requests

### 🔹 Tools & DevOps
- **VS Code** – Development environment
- **Postman** – API testing tool
- **Git & GitHub** – Version control
- **Render / Railway / Vercel** – Deployment platforms (if applicable)

---

#### FOLDER STRUCTURE
Travel_Journal-CP-/
├── travel-journal-frontend/ # React frontend
│ └── src/
│ ├── components/
│ ├── pages/
│ └── App.js
├── travel-journal-backend/ # Node.js backend
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ └── server.js
└── README.md

# 🎬 CineMatch — AI Movie Recommendation System

CineMatch is a full-stack AI-powered movie recommendation web application that suggests similar movies based on user preferences using Machine Learning.

The project uses a content-based recommendation system trained on movie metadata and integrates TMDB API for fetching movie posters.

---

# 🚀 Live Demo

## Frontend
https://cinematch-movie-recommendation-syst.vercel.app/

## Backend API
https://cinematch-movie-recommendation-system.onrender.com

⚠️ Note:
The backend is hosted on Render free tier, which may sleep after inactivity.
An uptime monitor is used to reduce cold-start delays.

---

# ✨ Features

- 🎥 AI-powered movie recommendations
- 🔍 Real-time movie search suggestions
- 🧠 Machine Learning recommendation engine
- 🖼️ TMDB movie poster integration
- ⚡ Flask backend API
- 🎨 Cinematic modern UI/UX
- 🌌 Animated background effects
- 🖱️ Custom animated cursor
- 📱 Fully responsive design
- ☁️ Online deployment support

---

# 🛠️ Tech Stack

## Frontend
- React.js
- JavaScript
- CSS3
- Vite

## Backend
- Flask
- Python
- Pandas
- NumPy
- Scikit-learn

## Machine Learning
- Content-Based Filtering
- Cosine Similarity
- Text Vectorization

## API
- TMDB API

## Deployment
- Vercel (Frontend)
- Render (Backend)

---

# 🧠 Machine Learning Workflow

The recommendation model was trained using movie metadata such as:

- Genres
- Keywords
- Cast
- Crew
- Overview
- Movie tags

Workflow:
1. Data Cleaning
2. Feature Engineering
3. Tags Creation
4. Text Vectorization
5. Cosine Similarity Calculation
6. Recommendation Generation

---

# 📂 Project Structure

```bash
MOVIE-RECOMMENDATION-APP/
│
├── backend/
│   ├── .env
│   ├── .gitignore
│   ├── app.py
│   ├── movies.pkl
│   ├── similarity.pkl
│   ├── Procfile
│   └── requirements.txt
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── model/
│   ├── dataset/
│   │   └── movies.csv
│   │
│   └── notebooks/
│       └── Movie_Recommendation_System.ipynb
│
└── README.md
```

---

# 📊 Dataset

Dataset Used:
- TMDB 5000 Movie Dataset

Dataset contains:
- Movie titles
- Genres
- Cast information
- Crew details
- Keywords
- Overview descriptions

---

# ⚙️ Environment Variables

Create a `.env` file inside the backend folder.

```env
TMDB_API_KEY=your_tmdb_api_key
```

---

# 🔐 Security

Sensitive API keys are stored securely using environment variables.

`.gitignore`

```gitignore
.env
```

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/Md-Shahriar-Rahman-Shihab/Cinematch---Movie-Recommendation-System.git
```

---

# ▶️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# ▶️ Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

---

# 🧠 Model Training

Open Jupyter Notebook:

```bash
jupyter notebook
```

Then open:

```bash
Movie_Recommendation_System.ipynb
```

The notebook:
- Cleans the dataset
- Creates movie tags
- Vectorizes text
- Calculates cosine similarity
- Generates recommendation files

Generated Files:
- `movies.pkl`
- `similarity.pkl`

---

# 🌐 API Endpoints

## Search Movies

```http
GET /search?query=movie_name
```

Example:

```http
/search?query=batman
```

---

## Get Recommendations

```http
POST /recommend
```

Request Body:

```json
{
  "movie": "Inception"
}
```

---

# ☁️ Deployment Guide

## Frontend Deployment

### Build Command

```bash
npm run build
```

### Output Directory

```bash
dist
```

---

## Backend Deployment (Render)

### Build Command

```bash
pip install -r requirements.txt
```

### Start Command

```bash
gunicorn app:app
```

### Environment Variable

```env
TMDB_API_KEY=your_tmdb_api_key
```

---

# 🧪 Recommendation Algorithm

## Content-Based Filtering

Movies are recommended based on similarity between movie features.

## Cosine Similarity

Similarity scores are calculated using vectorized movie tags.

---

# 🧠 Future Improvements

- 🎞️ Movie trailers
- ⭐ Ratings system
- ❤️ Watchlist feature
- 👤 Authentication system
- 🤖 Better recommendation engine
- 🎤 Voice search
- 🌓 Multiple themes

---

# 👨‍💻 Author

## Md Shahriar Rahman Shihab

- CSE Student
- Full Stack Web Developer
- AI Enthusiast
- UI/UX Learner

GitHub:
https://github.com/Md-Shahriar-Rahman-Shihab

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub.

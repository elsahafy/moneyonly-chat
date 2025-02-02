🚀 Deployment Guide: AI-Powered Personal Finance Web App

This document provides a step-by-step deployment guide for both the backend (Node.js, Express, MongoDB) on DigitalOcean and the frontend (React/Next.js) on Cloudflare Pages.

📌 Overview of Deployment
	•	Backend: DigitalOcean App Platform (Node.js & MongoDB Atlas)
	•	Frontend: Cloudflare Pages (React.js / Vite)
	•	Database: MongoDB Atlas (Cloud-based NoSQL DB)
	•	AI Services: Python ML Model (Runs on DigitalOcean)

📂 Folder Structure

finance-app/
│── backend/                 # Backend (Node.js, Express.js)
│   ├── ai/                  # AI & Machine Learning Models
│   ├── config/              # Database & Environment Config
│   ├── routes/              # API Routes (Auth, Transactions, AI)
│   ├── models/              # MongoDB Schemas
│   ├── middleware/          # Authentication & Security
│   ├── server.js            # Express Server Entry Point
│── frontend/                # Frontend (React.js, Vite)
│   ├── components/          # Reusable UI Components
│   ├── pages/               # Main Application Pages
│   ├── styles/              # Global Styles & Themes
│   ├── utils/               # API Handlers & Helper Functions
│   ├── vite.config.js       # Frontend Build Configuration
│── README.md                # Project Documentation
│── .gitignore               # Git Ignore File
│── deploy-doc.md            # Deployment Guide (This File)

📌 Step 1: Setup Backend on DigitalOcean App Platform

1️⃣ Create a MongoDB Atlas Database
	1.	Go to MongoDB Atlas
	2.	Sign up or log in → Click Create Cluster
	3.	Choose Shared Cluster (Free Tier)
	4.	Select Cloud Provider & Region (Choose closest to your DigitalOcean region)
	5.	Click Create Cluster
	6.	Add Database User:
	•	Go to Database Access
	•	Click Add New Database User
	•	Set Username & Password (Save them)
	•	Grant Access: Select Read & Write
	7.	Whitelist IP Address:
	•	Go to Network Access
	•	Click Add IP Address
	•	Select Allow Access from Anywhere
	8.	Copy Connection String:
	•	Go to Clusters → Click Connect
	•	Choose Connect Your Application
	•	Copy the MongoDB Connection String
	•	Replace <password> with the user password you created

2️⃣ Deploy Backend to DigitalOcean

Step 1: Create a DigitalOcean Account
	•	Sign up at DigitalOcean

Step 2: Create a New App
	1.	Go to DigitalOcean App Platform
	2.	Click Create App
	3.	Select GitHub Repository (Connect Your Backend Repo)
	4.	Choose the backend branch
	5.	Set the runtime to Node.js
	6.	Set Environment Variables:

PORT=5000
MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/financeDB
JWT_SECRET=your_jwt_secret



Step 3: Enable Auto Deploy
	•	Check Enable Auto Deploy (Deploy new updates automatically from GitHub)

Step 4: Deploy the App
	•	Click “Create App” → DigitalOcean will deploy your backend 🚀

3️⃣ Configure Server for Production

Update backend/server.js

require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const winston = require('winston');

// Initialize Express App
const app = express();
connectDB();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors({ origin: ['https://your-frontend-url.com'], credentials: true })); // Restrict API access
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Log HTTP requests

// Rate Limiting (Protect API from abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per IP
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

// Routes
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const aiRoutes = require('./routes/ai');

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/ai', aiRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('🚀 AI Finance App Backend is Running!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

📌 Step 2: Deploy Frontend on Cloudflare Pages

1️⃣ Connect Cloudflare Pages
	1.	Go to Cloudflare Pages
	2.	Click “Create a Project”
	3.	Select GitHub Repository (Connect your frontend repo)
	4.	Choose the frontend branch
	5.	Set Framework Preset: React (Vite)

2️⃣ Configure Build Settings
	•	Build Command: npm run build
	•	Output Directory: dist
	•	Environment Variables:

REACT_APP_API_URL=https://your-backend-url.com/api



3️⃣ Deploy Frontend
	•	Click Deploy Project 🚀

📌 Step 3: Test and Verify Deployment

Backend API Verification
	•	Open Postman or a browser and test:

GET https://your-backend-url.com/api/auth/test


	•	Expected response:

{ "message": "Backend is running!" }



Frontend Verification
	•	Visit your Cloudflare Pages URL to ensure:
	•	Login/Register Works ✅
	•	Dashboard Displays Transactions ✅
	•	AI Insights Page Loads ✅

📌 Step 4: Final Security & Optimization

1️⃣ Secure Backend

npm install express-rate-limit helmet compression

Modify server.js:

const compression = require('compression');
app.use(compression()); // Optimize API response size

2️⃣ Enable HTTPS on DigitalOcean
	•	Enable SSL/TLS Certificate on App Platform settings.

✅ Deployment Checklist

✔️ MongoDB Atlas Database Created
✔️ Backend Deployed on DigitalOcean App Platform
✔️ Frontend Hosted on Cloudflare Pages
✔️ Security Configured (CORS, Rate Limiting, Helmet.js)
✔️ Performance Optimized (Compression, Auto Scaling, Logging)
🔲 Final Testing & Bug Fixes
🔲 Official Launch 🚀

🚀 Next Steps

1️⃣ Test Full Application Workflow
2️⃣ Fix Bugs & Optimize Performance
3️⃣ Announce the App Launch 🎉

🔥 Let me know once everything is deployed and running!
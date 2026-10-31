# 🏠 House Rent Management System (MERN Stack)

A full-stack **House Rent Management System** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.
This application allows users to explore rental properties, property owners to post house listings, and administrators to manage the platform efficiently.

The system provides a **modern user interface, secure authentication, and efficient property management** to simplify the process of finding and managing rental houses.

---

# 🚀 Features

### 👤 User Features

* User registration and login
* Browse available rental properties
* Search houses by location and price
* View property details
* Send inquiries to property owners
* Save favorite properties

### 🏡 Property Owner Features

* Post new rental listings
* Upload property images
* Edit or delete property listings
* Manage availability of properties
* View inquiries from tenants

### 🛡 Admin Features

* Manage users
* Approve or remove property listings
* Monitor platform activities
* Maintain platform quality

---

# 🛠 Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Tailwind CSS 

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JSON Web Token (JWT)
* bcrypt for password hashing

---

# 📁 Project Structure

```
house-rent-management
│
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── App.js
│   │   └── index.js
│
├── server/                 # Node.js Backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── config
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

# ⚙️ Installation and Setup

## 1️⃣ Clone the Repository

```
git clone https://github.com/yourusername/house-rent-management.git
cd house-rent-management
```

---

## 2️⃣ Backend Setup

Navigate to the server folder:

```
cd server
npm install
```

Create a `.env` file and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend server:

```
npm start
```

---

## 3️⃣ Frontend Setup

Open a new terminal and run:

```
cd client
npm install
npm start
```

The React app will run on:

```
http://localhost:3000
```

---

# 🗄 Database Schema

## Users

```
name
email
password
phone
role (tenant / owner / admin)
createdAt
```

## Properties

```
title
description
price
location
images
propertyType
ownerId
availabilityStatus
createdAt
```

## Inquiries

```
userId
propertyId
message
status
createdAt
```

---

# 🔐 Authentication

The system uses **JWT-based authentication**.

Features:

* Secure login system
* Password hashing with bcrypt
* Protected routes
* Role-based access control

---

# 📸 Future Improvements

* Google Maps integration for property location
* Real-time chat between tenant and owner
* Property rating and review system
* Wishlist / favorite properties
* Online rent payment system

---



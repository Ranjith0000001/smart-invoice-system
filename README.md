# Smart Invoice System – Frontend

## 📌 Overview

This is the frontend application for the Smart Invoice & Payment System. It allows users to create invoices, manage items, and make payments using Stripe.

---

## 🚀 Tech Stack

* React (Vite)
* Redux Toolkit
* Redux-Saga
* React Hook Form
* Material UI
* Axios

---

## ⚙️ Setup Instructions

### 1. Clone the repository

git clone <your-frontend-repo-url>

### 2. Navigate to project

cd smart-invoice-client

### 3. Install dependencies

npm install

### 4. Run application

npm run dev

---

## 🌐 Application URL

http://localhost:5173

---

## 🔗 Backend API

Update API base URL in:
src/services/api.js

Example:
http://localhost:3000/api

---

## ✨ Features

* Create invoice with customer details
* Add multiple items dynamically
* Auto calculation (subtotal, tax, total)
* View invoice list
* Filter by status (Draft, Paid, Failed)
* Stripe payment integration
* Payment success & cancel pages

---

## 💳 Payment Flow

1. User clicks Pay
2. Backend creates Stripe session
3. User redirected to Stripe
4. Payment completed
5. Redirect back to frontend

---

## 🧠 State Management

* Redux used for global state
* Redux-Saga handles API calls
* Clean separation of UI and logic

---

## ⚠️ Notes

* Stripe uses test mode only
* No sensitive keys stored in frontend
* Proper error handling implemented


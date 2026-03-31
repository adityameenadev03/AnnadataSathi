# 🌾 AnnadataSathi – Smart Farming & Marketplace App

## 🧠 Overview

**AnnadataSathi** is a mobile-first web application designed for Indian farmers to:

* Track crops and farm activities
* Get AI-based farming advice
* Manage expenses (Khata system)
* Sell crops directly in a marketplace

The goal is to build a **decision-support system**, not just a data dashboard.

---

## 🎯 Core Philosophy

> ❌ Not just showing data
> ✅ Helping farmers decide **what to do next**

Examples:

* “Rain expected → Skip irrigation”
* “High humidity → Pest risk”
* “Apply fertilizer this week”

---

## 👨‍🌾 Target User

* Indian farmers
* Low technical familiarity
* Mobile-first usage
* Prefer simple UI and local language

---

## 📱 Main App Modules

### 🏠 1. Home (Dashboard)

* Weather summary
* Priority alerts (important actions)
* Active crop overview
* Quick actions:

  * Add Crop
  * Add Expense
  * AI Check
  * Sell Crop

---

### 🌾 2. Crops Management

* List of all crops
* Add new crop
* Crop detail screen:

  * Growth stage
  * Timeline
  * Logs (irrigation, fertilizer)
  * AI recommendations

---

### 🤖 3. AI Advisory

* Smart recommendations based on:

  * Crop data
  * Weather
  * Farm conditions
* Categorized into:

  * 🚨 Urgent
  * ⚠️ Warning
  * ✅ Normal

---

### 💰 4. Khata (Expense Management)

* Track farming expenses
* Categories:

  * Seeds
  * Fertilizer
  * Labor
  * Machinery
* Features:

  * Transaction list
  * Summary (total spent)
  * Future: profit/loss analysis

---

### 🛒 5. Marketplace

* Farmers can list crops for sale
* Buyers can place orders
* Features:

  * Product listings
  * Orders
  * Pricing

---

### 🔔 6. Notifications (Planned)

* Weather alerts
* Farming reminders
* Order updates

---

## 🧩 Key Features

### 🌦️ Weather Integration

* Forecast-based decisions
* Used for irrigation & alerts

---

### 🤖 AI (Phase 1: Rule-Based)

Examples:

* IF no rain AND dry soil → suggest irrigation
* IF humidity high → pest warning
* IF crop age > X → fertilizer suggestion

---

### 🌍 Multilingual Support

* English + Hindi (expandable)
* UI-level translation

---

### 📍 Location Awareness

* Farm coordinates (latitude, longitude)
* Enables:

  * Weather API
  * Map features
  * Location-based insights

---

### 💧 Water Source Tracking

* Borewell
* Canal
* Rain-fed
* River

Used for smarter irrigation advice.

---

## 🗄️ Database Design (High-Level)

### Core Entities:

* User
* Farm
* Crop
* Crop Logs
* Expense
* Recommendation
* Product (Marketplace)
* Order

---

### Relationships:

User → Farms → Crops → Logs / Expenses / Recommendations
User → Products → Orders → OrderItems

---

## ⚙️ Tech Stack

### Frontend

* Next.js (App Router)
* Tailwind CSS
* Zustand (state management)

---

### Backend (Current)

* Next.js API routes

---

### Database

* PostgreSQL (hosted on Neon)
* Prisma ORM

---

## 🧱 Architecture

Next.js (UI + API)
↓
Prisma ORM
↓
PostgreSQL (Neon)
↓
External APIs (Weather, AI)

---

## 📲 UX Design Principles

* Extremely simple UI
* Large touch-friendly buttons
* Card-based layout
* Minimal typing
* Visual cues (icons + colors)

---

## 🎨 Navigation Structure

Bottom Navigation:

Home | Crops | Advice | Khata | Market

---

## 🚀 Development Phases

### Phase 1 (Current)

* Crop tracking
* Basic dashboard
* DB schema setup

---

### Phase 2

* Khata (expenses)
* Weather integration

---

### Phase 3

* AI recommendations

---

### Phase 4

* Marketplace

---

### Phase 5

* Multilingual + polish

---

## 🧠 Long-Term Vision

Build a **digital assistant for farmers** that:

* Reduces guesswork
* Improves yield
* Increases profit
* Enables direct selling

---

## 🏁 Summary

AnnadataSathi is not just a farming app.

It is a **decision engine** that helps farmers take the right action at the right time.

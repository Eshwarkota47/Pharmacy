# MediFind AI - Emergency Medicine Availability Platform

**Tagline:** Find essential medicines faster, when every minute matters.

## Overview

MediFind AI is a comprehensive, full-stack healthcare platform designed to help users quickly find nearby pharmacies with required medicines, check stock availability in real-time, and get AI-powered substitute suggestions during emergencies.

## Problem Solved

People waste critical time searching multiple pharmacies for essential medicines, especially during:
- Medical emergencies
- Late-night hours  
- Medicine shortages
- Unfamiliar localities

This platform provides a unified cross-pharmacy search experience with emergency-first features.

## Tech Stack

### Backend
- **Framework:** FastAPI
- **Database:** MongoDB
- **AI Integration:** Claude Sonnet 4.5 (via Emergent LLM Universal Key)
- **Python Version:** 3.11

### Frontend
- **Framework:** React 18
- **Styling:** Tailwind CSS
- **Routing:** React Router v6

## Features Implemented

### 🔍 Core Features
1. **Smart Medicine Search** - Search by brand or generic name with real-time stock
2. **🚨 Emergency Mode** - Priority filtering for open pharmacies and immediate availability
3. **🤖 AI Substitute Suggestions** - Powered by Claude Sonnet 4.5
4. **📍 Location-Based Search** - Distance calculation and pharmacy locator
5. **🎫 Reservation System** - Reserve medicines with pickup time slots

### 👥 User Roles
- **User/Patient** - Search, reserve medicines, view history
- **Pharmacy** - Manage inventory, handle reservations, analytics
- **Admin** - Platform management, pharmacy verification, statistics

## Demo Data

Pre-seeded with realistic data:
- **25 Pharmacies** across various localities
- **74+ Medicines** across 13 categories
- **1247 Inventory Items** 
- **20 Sample Reservations**

### Demo Credentials

```
User:     user@demo.com / password123
Pharmacy: pharmacy@demo.com / password123
Admin:    admin@demo.com / password123
```

## Quick Start

Backend is running on: http://localhost:8001
Frontend is running on: http://localhost:3000

Database is already seeded with demo data!

## Key Pages

1. **Landing Page** - Hero, features, benefits, emergency mode promo
2. **User Dashboard** - Search with emergency mode toggle
3. **Search Results** - Pharmacy listings with filters
4. **Pharmacy Details** - Inventory, reservations, AI substitutes
5. **Pharmacy Dashboard** - Inventory & reservation management
6. **Admin Dashboard** - Platform analytics & pharmacy management

---

**Built for better healthcare access**

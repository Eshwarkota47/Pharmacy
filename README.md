# MediGuide AI - Healthcare Workflow Assistant

**Tagline:** Real-time AI guidance for pharmacy and clinical workflows.

## Overview

MediGuide AI is an AI-powered workflow assistant built for healthcare workers—pharmacists, nurses, clinical staff, and dispensary teams. It helps them perform medicine-related physical tasks faster and more accurately during live operations.

## Problem Solved

Healthcare workers face workflow challenges during critical dispensing operations:
- Time lost searching for medicines across locations
- Manual verification of substitutes and alternatives
- Dispensing errors due to lack of real-time guidance
- Delays in urgent prescription fulfillment
- Inefficient inventory lookups across multiple sites

MediGuide AI provides real-time AI assistance for these operational workflows.

## Tech Stack

### Backend
- **Framework:** FastAPI
- **Database:** MongoDB
- **AI Integration:** Claude Sonnet 4.5 (via Emergent LLM Universal Key)

### Frontend
- **Framework:** React 18
- **Styling:** Tailwind CSS
- **Routing:** React Router v6

## Primary Users

- **Pharmacists** - prescription fulfillment, dispensing accuracy
- **Clinical Staff** - medicine availability during patient care
- **Nurses** - ward medicine administration support
- **Dispensary Staff** - inventory lookup, stock verification
- **Hospital Medicine Teams** - multi-location coordination

## Core Workflow Features

### 🔍 **Instant Medicine Lookup**
Search medicine availability across all inventory locations during prescription fulfillment. Real-time stock visibility.

### 🤖 **AI Substitute Guidance**
Get intelligent substitute recommendations powered by Claude Sonnet 4.5 when exact medicine is unavailable. Reduces dispensing errors.

### ✓ **Medicine Verification**
Verify medicine details, dosage, composition during dispensing workflow to ensure accuracy.

### 🚨 **Urgent Dispensing Mode**
Priority mode for critical cases—shows nearest available stock and fastest fulfillment options.

### 📊 **Multi-Location Inventory**
Check stock levels across multiple pharmacy locations, departments, or branches from one interface.

### 📋 **Prescription Queue Management**
Manage prescription fulfillment workflow with queue tracking and priority handling.

## Demo Data

Pre-seeded with realistic data:
- **25 Pharmacy/Dispensary Locations**
- **74+ Medicines** across 13 categories
- **1,247 Inventory Items** with varied stock levels
- **20 Sample Prescriptions** in queue

### Demo Credentials

```
Staff:    user@demo.com / password123
Pharmacy: pharmacy@demo.com / password123
Admin:    admin@demo.com / password123
```

## Quick Start

**Backend:** http://localhost:8001  
**Frontend:** http://localhost:3000

Database is already seeded with demo data!

## Staff Workflow Use Cases

1. **Prescription Fulfillment**
   - Staff receives prescription
   - Lookup medicine availability across locations
   - Get AI substitute guidance if needed
   - Verify details and dispense

2. **Urgent Medicine Access**
   - Enable urgent dispensing mode
   - System prioritizes nearest available stock
   - Fastest fulfillment path highlighted
   - Critical cases handled efficiently

3. **Inventory Coordination**
   - Check stock across multiple sites
   - Real-time availability visibility
   - Reduce phone calls and manual coordination

4. **Substitute Verification**
   - AI-powered substitute recommendations
   - Clinical context and reasoning provided
   - Reduce dispensing errors

## Key Pages

1. **Landing Page** - Workflow challenges, AI features, staff benefits
2. **Staff Dashboard** - Medicine lookup, urgent dispensing mode
3. **Availability Results** - Multi-location inventory with filters
4. **Location Details** - Full inventory, substitute guidance
5. **Dispense Queue** - Prescription fulfillment tracking
6. **Pharmacy Dashboard** - Inventory & queue management
7. **Admin Dashboard** - Platform analytics & location management

## Benefits

### For Pharmacists & Dispensary Staff
✓ Reduce prescription fulfillment time by up to 60%  
✓ AI-powered substitute guidance reduces errors  
✓ Real-time inventory across all locations  
✓ Handle urgent cases faster  
✓ Instant medicine verification

### For Nurses & Clinical Staff
✓ Quick availability checks during ward rounds  
✓ Identify valid substitutes when stock unavailable  
✓ Support accurate medicine administration  
✓ Coordinate with pharmacy on urgent needs  
✓ Reduce manual coordination time

## Technical Features

- AI substitute suggestions with fallback logic
- Distance-based inventory routing
- Urgent priority scoring algorithm
- Multi-location stock visibility
- Queue-based workflow management
- Real-time status updates

---

**Built for healthcare workers who need real-time guidance during physical workflow tasks**

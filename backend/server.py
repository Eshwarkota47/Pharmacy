from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime
import math
import uuid
from typing import Optional, List
from pydantic import BaseModel
from emergentintegrations.llm.chat import LlmChat, UserMessage
import asyncio

# Load environment variables
load_dotenv()

app = FastAPI(title="MediFind AI API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/medifind_ai')
client = MongoClient(MONGO_URL)
db = client.medifind_ai

# Collections
users_collection = db.users
pharmacies_collection = db.pharmacies
medicines_collection = db.medicines
inventory_collection = db.inventory
reservations_collection = db.reservations
substitute_mappings_collection = db.substitute_mappings

# Pydantic models
class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str
    phone: str

class ReservationRequest(BaseModel):
    user_id: str
    pharmacy_id: str
    medicine_id: str
    quantity: int
    pickup_time: str
    notes: Optional[str] = ""

class InventoryRequest(BaseModel):
    pharmacy_id: str
    medicine_id: str
    quantity: int
    price: float
    low_stock_threshold: int = 20

class UpdateInventoryRequest(BaseModel):
    quantity: int
    price: float
    status: str

class PharmacyStatusRequest(BaseModel):
    pharmacy_id: str
    status: str

class SubstituteRequest(BaseModel):
    medicine_name: str
    generic_name: str
    composition: str
    dosage: str

# Helper functions
def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two coordinates using Haversine formula"""
    R = 6371  # Earth's radius in kilometers
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    distance = R * c
    return round(distance, 2)

def is_pharmacy_open(operating_hours, is_24x7):
    """Check if pharmacy is currently open"""
    if is_24x7:
        return True
    
    # Simple time check (can be enhanced)
    current_hour = datetime.now().hour
    if 8 <= current_hour < 22:  # Assume most pharmacies open 8am-10pm
        return True
    return False

async def get_ai_substitutes(medicine_name, generic_name, composition, dosage):
    """Get AI-powered substitute suggestions using Claude"""
    try:
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            return None
        
        chat = LlmChat(
            api_key=api_key,
            session_id=f"substitute-{uuid.uuid4()}",
            system_message="You are a medical AI assistant specialized in suggesting substitute medicines. Provide accurate, safe alternative medicines based on composition and therapeutic use."
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        
        prompt = f"""Given the following medicine details, suggest 3-5 substitute medicines:

Medicine Name: {medicine_name}
Generic Name: {generic_name}
Composition: {composition}
Dosage: {dosage}

Please provide substitute suggestions in the following JSON format only:
{{
  "substitutes": [
    {{
      "name": "Substitute Medicine Name",
      "generic": "Generic Name",
      "type": "same_generic|similar_composition|similar_dosage",
      "reason": "Brief explanation"
    }}
  ]
}}

Focus on medicines with:
1. Same generic name (highest priority)
2. Similar composition
3. Similar therapeutic effect
4. Available in similar dosage

Return only valid JSON, no additional text."""

        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Parse response
        import json
        try:
            result = json.loads(response)
            return result.get("substitutes", [])
        except (json.JSONDecodeError, ValueError):
            # If JSON parsing fails, return None to use fallback
            return None
            
    except Exception as e:
        print(f"AI substitute error: {e}")
        return None

def get_rule_based_substitutes(medicine_id):
    """Fallback: Get rule-based substitutes from database"""
    mapping = substitute_mappings_collection.find_one({"medicine_id": medicine_id})
    if not mapping:
        return []
    
    substitutes = []
    for sub_id in mapping.get("substitute_ids", []):
        sub_med = medicines_collection.find_one({"medicine_id": sub_id})
        if sub_med:
            substitutes.append({
                "name": sub_med["brand"],
                "generic": sub_med["generic"],
                "type": mapping.get("relationship_type", "similar"),
                "reason": f"Alternative with {mapping.get('relationship_type', 'similar')} profile"
            })
    
    return substitutes

# API Routes

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "MediFind AI API"}

# Authentication APIs
@app.post("/api/auth/login")
def login(request: LoginRequest):
    user = users_collection.find_one({"email": request.email})
    
    if not user or user["password"] != request.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Remove password from response
    user.pop("_id", None)
    user.pop("password", None)
    
    return {"success": True, "user": user}

@app.post("/api/auth/signup")
def signup(request: SignupRequest):
    # Check if user exists
    existing_user = users_collection.find_one({"email": request.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_data = {
        "user_id": str(uuid.uuid4()),
        "name": request.name,
        "email": request.email,
        "password": request.password,
        "role": request.role,
        "phone": request.phone,
        "created_at": datetime.now().isoformat()
    }
    
    users_collection.insert_one(user_data)
    
    user_data.pop("_id", None)
    user_data.pop("password", None)
    
    return {"success": True, "user": user_data}

# Medicine Search APIs
@app.get("/api/medicines/autocomplete")
def autocomplete_medicines(query: str = Query(..., min_length=1)):
    """
    Autocomplete endpoint for medicine search
    Returns matching medicines by brand name or generic name
    """
    if not query or len(query.strip()) < 2:
        return {"suggestions": []}
    
    # Search medicines with ranking
    # Exact match gets highest priority, then starts-with, then contains
    pipeline = [
        {
            "$match": {
                "$or": [
                    {"brand": {"$regex": f"^{query}", "$options": "i"}},  # Starts with
                    {"generic": {"$regex": f"^{query}", "$options": "i"}},
                    {"brand": {"$regex": query, "$options": "i"}},  # Contains
                    {"generic": {"$regex": query, "$options": "i"}}
                ]
            }
        },
        {
            "$project": {
                "_id": 0,
                "medicine_id": 1,
                "brand": 1,
                "generic": 1,
                "dosage": 1,
                "composition": 1,
                # Calculate relevance score
                "relevance": {
                    "$add": [
                        {"$cond": [{"$regexMatch": {"input": "$brand", "regex": f"^{query}", "options": "i"}}, 100, 0]},
                        {"$cond": [{"$regexMatch": {"input": "$generic", "regex": f"^{query}", "options": "i"}}, 90, 0]},
                        {"$cond": [{"$regexMatch": {"input": "$brand", "regex": query, "options": "i"}}, 10, 0]},
                        {"$cond": [{"$regexMatch": {"input": "$generic", "regex": query, "options": "i"}}, 5, 0]}
                    ]
                }
            }
        },
        {"$sort": {"relevance": -1}},
        {"$limit": 10}
    ]
    
    try:
        medicines = list(medicines_collection.aggregate(pipeline))
        return {"suggestions": medicines}
    except Exception:
        # Fallback to simpler query if aggregation fails
        medicines = list(medicines_collection.find({
            "$or": [
                {"brand": {"$regex": query, "$options": "i"}},
                {"generic": {"$regex": query, "$options": "i"}}
            ]
        }, {"_id": 0, "medicine_id": 1, "brand": 1, "generic": 1, "dosage": 1, "composition": 1}).limit(10))
        return {"suggestions": medicines}


@app.get("/api/medicines/search")
def search_medicines(
    query: str = Query(..., description="Medicine name to search"),
    lat: Optional[float] = Query(None, description="User latitude"),
    lng: Optional[float] = Query(None, description="User longitude"),
    emergency_mode: bool = Query(False, description="Emergency priority mode"),
    sort_by: Optional[str] = Query("nearest", description="Sort by: nearest, open_now, in_stock")
):
    # Search medicines by brand or generic name
    medicines = list(medicines_collection.find({
        "$or": [
            {"brand": {"$regex": query, "$options": "i"}},
            {"generic": {"$regex": query, "$options": "i"}}
        ]
    }))
    
    if not medicines:
        return {"results": [], "total": 0}
    
    medicine_ids = [m["medicine_id"] for m in medicines]
    
    # Find pharmacies with these medicines
    inventory_items = list(inventory_collection.find({
        "medicine_id": {"$in": medicine_ids},
        "quantity": {"$gt": 0}
    }))
    
    pharmacy_ids = list(set([inv["pharmacy_id"] for inv in inventory_items]))
    pharmacies = list(pharmacies_collection.find({"pharmacy_id": {"$in": pharmacy_ids}}))
    
    # Build results
    results = []
    for pharmacy in pharmacies:
        pharmacy_inventory = [inv for inv in inventory_items if inv["pharmacy_id"] == pharmacy["pharmacy_id"]]
        
        for inv in pharmacy_inventory:
            medicine = next((m for m in medicines if m["medicine_id"] == inv["medicine_id"]), None)
            if not medicine:
                continue
            
            # Calculate distance if coordinates provided
            distance = None
            if lat and lng:
                distance = calculate_distance(lat, lng, pharmacy["coordinates"]["lat"], pharmacy["coordinates"]["lng"])
            
            # Check if open
            is_open = is_pharmacy_open(pharmacy["operating_hours"], pharmacy["is_24x7"])
            
            # Emergency score
            emergency_score = 0
            if emergency_mode:
                if is_open:
                    emergency_score += 50
                if inv["status"] == "in_stock":
                    emergency_score += 30
                if distance and distance < 5:
                    emergency_score += 20
            
            result = {
                "pharmacy_id": pharmacy["pharmacy_id"],
                "pharmacy_name": pharmacy["name"],
                "locality": pharmacy["locality"],
                "address": pharmacy.get("locality", ""),
                "contact": pharmacy["contact"],
                "coordinates": pharmacy["coordinates"],
                "operating_hours": pharmacy["operating_hours"],
                "is_24x7": pharmacy["is_24x7"],
                "is_open": is_open,
                "distance": distance,
                "medicine": {
                    "medicine_id": medicine["medicine_id"],
                    "brand": medicine["brand"],
                    "generic": medicine["generic"],
                    "composition": medicine["composition"],
                    "dosage": medicine["dosage"],
                    "category": medicine["category"]
                },
                "inventory": {
                    "inventory_id": inv["inventory_id"],
                    "quantity": inv["quantity"],
                    "price": inv["price"],
                    "status": inv["status"]
                },
                "emergency_score": emergency_score
            }
            results.append(result)
    
    # Sort results
    if emergency_mode:
        results.sort(key=lambda x: x["emergency_score"], reverse=True)
    elif sort_by == "nearest" and lat and lng:
        results.sort(key=lambda x: x["distance"] if x["distance"] else 999999)
    elif sort_by == "open_now":
        results.sort(key=lambda x: (not x["is_open"], x["distance"] if x["distance"] else 999999))
    elif sort_by == "in_stock":
        results.sort(key=lambda x: (x["inventory"]["status"] != "in_stock", -x["inventory"]["quantity"]))
    
    return {"results": results, "total": len(results)}

@app.get("/api/pharmacies/nearby")
def get_nearby_pharmacies(
    lat: float = Query(..., description="User latitude"),
    lng: float = Query(..., description="User longitude"),
    radius: int = Query(10, description="Search radius in km")
):
    pharmacies = list(pharmacies_collection.find())
    
    results = []
    for pharmacy in pharmacies:
        distance = calculate_distance(lat, lng, pharmacy["coordinates"]["lat"], pharmacy["coordinates"]["lng"])
        
        if distance <= radius:
            is_open = is_pharmacy_open(pharmacy["operating_hours"], pharmacy["is_24x7"])
            
            pharmacy.pop("_id", None)
            pharmacy["distance"] = distance
            pharmacy["is_open"] = is_open
            
            results.append(pharmacy)
    
    # Sort by distance
    results.sort(key=lambda x: x["distance"])
    
    return {"pharmacies": results, "total": len(results)}

@app.get("/api/pharmacies/{pharmacy_id}")
def get_pharmacy_details(pharmacy_id: str):
    pharmacy = pharmacies_collection.find_one({"pharmacy_id": pharmacy_id})
    
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Pharmacy not found")
    
    # Get inventory
    inventory = list(inventory_collection.find({"pharmacy_id": pharmacy_id}))
    
    # Enrich with medicine details
    medicine_ids = [inv["medicine_id"] for inv in inventory]
    medicines = list(medicines_collection.find({"medicine_id": {"$in": medicine_ids}}))
    
    inventory_with_medicines = []
    for inv in inventory:
        medicine = next((m for m in medicines if m["medicine_id"] == inv["medicine_id"]), None)
        if medicine:
            medicine.pop("_id", None)
            inv.pop("_id", None)
            inventory_with_medicines.append({
                **inv,
                "medicine": medicine
            })
    
    pharmacy.pop("_id", None)
    is_open = is_pharmacy_open(pharmacy["operating_hours"], pharmacy["is_24x7"])
    pharmacy["is_open"] = is_open
    pharmacy["inventory"] = inventory_with_medicines
    
    return {"pharmacy": pharmacy}

@app.post("/api/medicines/substitute")
async def get_substitute_medicines(request: SubstituteRequest):
    # Try AI-powered substitutes first
    ai_substitutes = await get_ai_substitutes(
        request.medicine_name,
        request.generic_name,
        request.composition,
        request.dosage
    )
    
    # If AI fails, use rule-based fallback
    if not ai_substitutes or len(ai_substitutes) == 0:
        # Find medicine by name
        medicine = medicines_collection.find_one({
            "$or": [
                {"brand": {"$regex": request.medicine_name, "$options": "i"}},
                {"generic": {"$regex": request.generic_name, "$options": "i"}}
            ]
        })
        
        if medicine:
            ai_substitutes = get_rule_based_substitutes(medicine["medicine_id"])
    
    return {
        "substitutes": ai_substitutes or [],
        "source": "ai" if ai_substitutes and len(ai_substitutes) > 0 else "rule_based"
    }

# Reservation APIs
@app.post("/api/reservations")
def create_reservation(request: ReservationRequest):
    reservation_data = {
        "reservation_id": str(uuid.uuid4()),
        "user_id": request.user_id,
        "pharmacy_id": request.pharmacy_id,
        "medicine_id": request.medicine_id,
        "quantity": request.quantity,
        "pickup_time": request.pickup_time,
        "status": "pending",
        "notes": request.notes,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    
    reservations_collection.insert_one(reservation_data)
    reservation_data.pop("_id", None)
    
    return {"success": True, "reservation": reservation_data}

@app.get("/api/user/reservations")
def get_user_reservations(user_id: str = Query(...)):
    reservations = list(reservations_collection.find({"user_id": user_id}))
    
    # Enrich with pharmacy and medicine details
    for reservation in reservations:
        reservation.pop("_id", None)
        
        pharmacy = pharmacies_collection.find_one({"pharmacy_id": reservation["pharmacy_id"]})
        medicine = medicines_collection.find_one({"medicine_id": reservation["medicine_id"]})
        
        if pharmacy:
            pharmacy.pop("_id", None)
            reservation["pharmacy"] = pharmacy
        
        if medicine:
            medicine.pop("_id", None)
            reservation["medicine"] = medicine
    
    return {"reservations": reservations}

# Pharmacy Dashboard APIs
@app.get("/api/pharmacy/inventory")
def get_pharmacy_inventory(pharmacy_id: str = Query(...)):
    inventory = list(inventory_collection.find({"pharmacy_id": pharmacy_id}))
    
    # Enrich with medicine details
    for inv in inventory:
        inv.pop("_id", None)
        medicine = medicines_collection.find_one({"medicine_id": inv["medicine_id"]})
        if medicine:
            medicine.pop("_id", None)
            inv["medicine"] = medicine
    
    return {"inventory": inventory}

@app.post("/api/pharmacy/inventory")
def add_pharmacy_inventory(request: InventoryRequest):
    # Check if already exists
    existing = inventory_collection.find_one({
        "pharmacy_id": request.pharmacy_id,
        "medicine_id": request.medicine_id
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Medicine already in inventory. Use update endpoint.")
    
    status = "in_stock" if request.quantity > request.low_stock_threshold else ("low_stock" if request.quantity > 0 else "out_of_stock")
    
    inventory_data = {
        "inventory_id": str(uuid.uuid4()),
        "pharmacy_id": request.pharmacy_id,
        "medicine_id": request.medicine_id,
        "quantity": request.quantity,
        "price": request.price,
        "low_stock_threshold": request.low_stock_threshold,
        "status": status,
        "last_updated": datetime.now().isoformat()
    }
    
    inventory_collection.insert_one(inventory_data)
    inventory_data.pop("_id", None)
    
    return {"success": True, "inventory": inventory_data}

@app.put("/api/pharmacy/inventory/{inventory_id}")
def update_pharmacy_inventory(inventory_id: str, request: UpdateInventoryRequest):
    result = inventory_collection.update_one(
        {"inventory_id": inventory_id},
        {"$set": {
            "quantity": request.quantity,
            "price": request.price,
            "status": request.status,
            "last_updated": datetime.now().isoformat()
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    return {"success": True, "message": "Inventory updated"}

@app.delete("/api/pharmacy/inventory/{inventory_id}")
def delete_pharmacy_inventory(inventory_id: str):
    result = inventory_collection.delete_one({"inventory_id": inventory_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    return {"success": True, "message": "Inventory item deleted"}

@app.get("/api/pharmacy/reservations")
def get_pharmacy_reservations(pharmacy_id: str = Query(...)):
    reservations = list(reservations_collection.find({"pharmacy_id": pharmacy_id}))
    
    for reservation in reservations:
        reservation.pop("_id", None)
        user = users_collection.find_one({"user_id": reservation["user_id"]})
        medicine = medicines_collection.find_one({"medicine_id": reservation["medicine_id"]})
        
        if user:
            user.pop("_id", None)
            user.pop("password", None)
            reservation["user"] = user
        
        if medicine:
            medicine.pop("_id", None)
            reservation["medicine"] = medicine
    
    return {"reservations": reservations}

@app.put("/api/pharmacy/reservations/{reservation_id}/status")
def update_reservation_status(reservation_id: str, status: str = Query(...)):
    result = reservations_collection.update_one(
        {"reservation_id": reservation_id},
        {"$set": {
            "status": status,
            "updated_at": datetime.now().isoformat()
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    return {"success": True, "message": "Reservation status updated"}

@app.put("/api/pharmacy/status")
def update_pharmacy_status(request: PharmacyStatusRequest):
    result = pharmacies_collection.update_one(
        {"pharmacy_id": request.pharmacy_id},
        {"$set": {"status": request.status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Pharmacy not found")
    
    return {"success": True, "message": "Pharmacy status updated"}

@app.get("/api/pharmacy/analytics")
def get_pharmacy_analytics(pharmacy_id: str = Query(...)):
    # Total medicines
    total_medicines = inventory_collection.count_documents({"pharmacy_id": pharmacy_id})
    
    # Low stock items
    low_stock = inventory_collection.count_documents({
        "pharmacy_id": pharmacy_id,
        "status": "low_stock"
    })
    
    # Out of stock
    out_of_stock = inventory_collection.count_documents({
        "pharmacy_id": pharmacy_id,
        "status": "out_of_stock"
    })
    
    # Today's reservations
    today = datetime.now().date().isoformat()
    today_reservations = reservations_collection.count_documents({
        "pharmacy_id": pharmacy_id,
        "created_at": {"$regex": f"^{today}"}
    })
    
    # Pending reservations
    pending_reservations = reservations_collection.count_documents({
        "pharmacy_id": pharmacy_id,
        "status": "pending"
    })
    
    return {
        "total_medicines": total_medicines,
        "low_stock_items": low_stock,
        "out_of_stock_items": out_of_stock,
        "today_reservations": today_reservations,
        "pending_reservations": pending_reservations
    }

# Admin APIs
@app.get("/api/admin/dashboard")
def get_admin_dashboard():
    total_users = users_collection.count_documents({"role": "user"})
    total_pharmacies = pharmacies_collection.count_documents({})
    total_medicines = medicines_collection.count_documents({})
    total_reservations = reservations_collection.count_documents({})
    
    # Pending reservations
    pending_reservations = reservations_collection.count_documents({"status": "pending"})
    
    # Recent reservations
    recent_reservations = list(reservations_collection.find().sort("created_at", -1).limit(10))
    for res in recent_reservations:
        res.pop("_id", None)
    
    return {
        "total_users": total_users,
        "total_pharmacies": total_pharmacies,
        "total_medicines": total_medicines,
        "total_reservations": total_reservations,
        "pending_reservations": pending_reservations,
        "recent_reservations": recent_reservations
    }

@app.get("/api/admin/pharmacies")
def get_all_pharmacies():
    pharmacies = list(pharmacies_collection.find())
    for pharmacy in pharmacies:
        pharmacy.pop("_id", None)
    return {"pharmacies": pharmacies}

@app.put("/api/admin/pharmacies/{pharmacy_id}/verify")
def verify_pharmacy(pharmacy_id: str, verified: bool = Query(...)):
    result = pharmacies_collection.update_one(
        {"pharmacy_id": pharmacy_id},
        {"$set": {"verified": verified}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Pharmacy not found")
    
    return {"success": True, "message": "Pharmacy verification updated"}

@app.get("/api/medicines")
def get_all_medicines():
    medicines = list(medicines_collection.find())
    for medicine in medicines:
        medicine.pop("_id", None)
    return {"medicines": medicines, "total": len(medicines)}

# Database initialization
@app.post("/api/admin/seed-database")
def seed_database():
    """Seed database with demo data"""
    from seed_data import prepare_seed_data
    
    # Clear existing data
    users_collection.delete_many({})
    pharmacies_collection.delete_many({})
    medicines_collection.delete_many({})
    inventory_collection.delete_many({})
    reservations_collection.delete_many({})
    substitute_mappings_collection.delete_many({})
    
    # Insert seed data
    seed_data = prepare_seed_data()
    
    users_collection.insert_many(seed_data["users"])
    pharmacies_collection.insert_many(seed_data["pharmacies"])
    medicines_collection.insert_many(seed_data["medicines"])
    inventory_collection.insert_many(seed_data["inventory"])
    substitute_mappings_collection.insert_many(seed_data["substitute_mappings"])
    reservations_collection.insert_many(seed_data["reservations"])
    
    return {
        "success": True,
        "message": "Database seeded successfully",
        "counts": {
            "users": len(seed_data["users"]),
            "pharmacies": len(seed_data["pharmacies"]),
            "medicines": len(seed_data["medicines"]),
            "inventory": len(seed_data["inventory"]),
            "reservations": len(seed_data["reservations"]),
            "substitute_mappings": len(seed_data["substitute_mappings"])
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

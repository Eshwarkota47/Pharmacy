import random
from datetime import datetime, timedelta
import uuid

# Medicine categories and data
MEDICINE_CATEGORIES = {
    "Antibiotics": [
        {"brand": "Amoxil", "generic": "Amoxicillin", "composition": "Amoxicillin 500mg", "dosage": "500mg", "description": "Antibiotic for bacterial infections"},
        {"brand": "Augmentin", "generic": "Amoxicillin-Clavulanate", "composition": "Amoxicillin 875mg + Clavulanate 125mg", "dosage": "875mg/125mg", "description": "Broad-spectrum antibiotic"},
        {"brand": "Azithral", "generic": "Azithromycin", "composition": "Azithromycin 500mg", "dosage": "500mg", "description": "Antibiotic for respiratory infections"},
        {"brand": "Ciprofloxacin", "generic": "Ciprofloxacin", "composition": "Ciprofloxacin 500mg", "dosage": "500mg", "description": "Fluoroquinolone antibiotic"},
        {"brand": "Zithromax", "generic": "Azithromycin", "composition": "Azithromycin 250mg", "dosage": "250mg", "description": "Antibiotic for various infections"},
        {"brand": "Keflex", "generic": "Cephalexin", "composition": "Cephalexin 500mg", "dosage": "500mg", "description": "Cephalosporin antibiotic"},
        {"brand": "Doxycycline", "generic": "Doxycycline", "composition": "Doxycycline 100mg", "dosage": "100mg", "description": "Tetracycline antibiotic"},
        {"brand": "Metronidazole", "generic": "Metronidazole", "composition": "Metronidazole 400mg", "dosage": "400mg", "description": "Antibiotic for anaerobic infections"},
    ],
    "Painkillers": [
        {"brand": "Tylenol", "generic": "Paracetamol", "composition": "Paracetamol 500mg", "dosage": "500mg", "description": "Pain and fever relief"},
        {"brand": "Crocin", "generic": "Paracetamol", "composition": "Paracetamol 650mg", "dosage": "650mg", "description": "Fast pain relief"},
        {"brand": "Advil", "generic": "Ibuprofen", "composition": "Ibuprofen 400mg", "dosage": "400mg", "description": "NSAID for pain and inflammation"},
        {"brand": "Brufen", "generic": "Ibuprofen", "composition": "Ibuprofen 600mg", "dosage": "600mg", "description": "Anti-inflammatory painkiller"},
        {"brand": "Combiflam", "generic": "Ibuprofen-Paracetamol", "composition": "Ibuprofen 400mg + Paracetamol 325mg", "dosage": "400mg/325mg", "description": "Combination pain relief"},
        {"brand": "Aspirin", "generic": "Acetylsalicylic Acid", "composition": "Aspirin 75mg", "dosage": "75mg", "description": "Pain relief and blood thinner"},
        {"brand": "Diclofenac", "generic": "Diclofenac", "composition": "Diclofenac 50mg", "dosage": "50mg", "description": "NSAID for pain relief"},
        {"brand": "Naproxen", "generic": "Naproxen", "composition": "Naproxen 500mg", "dosage": "500mg", "description": "Long-acting NSAID"},
        {"brand": "Tramadol", "generic": "Tramadol", "composition": "Tramadol 50mg", "dosage": "50mg", "description": "Moderate to severe pain relief"},
    ],
    "Diabetes": [
        {"brand": "Glucophage", "generic": "Metformin", "composition": "Metformin 500mg", "dosage": "500mg", "description": "Type 2 diabetes medication"},
        {"brand": "Glycomet", "generic": "Metformin", "composition": "Metformin 850mg", "dosage": "850mg", "description": "Blood sugar control"},
        {"brand": "Januvia", "generic": "Sitagliptin", "composition": "Sitagliptin 100mg", "dosage": "100mg", "description": "DPP-4 inhibitor for diabetes"},
        {"brand": "Glimepiride", "generic": "Glimepiride", "composition": "Glimepiride 1mg", "dosage": "1mg", "description": "Sulfonylurea for diabetes"},
        {"brand": "Amaryl", "generic": "Glimepiride", "composition": "Glimepiride 2mg", "dosage": "2mg", "description": "Blood glucose control"},
        {"brand": "Invokana", "generic": "Canagliflozin", "composition": "Canagliflozin 100mg", "dosage": "100mg", "description": "SGLT2 inhibitor"},
        {"brand": "Jardiance", "generic": "Empagliflozin", "composition": "Empagliflozin 10mg", "dosage": "10mg", "description": "Diabetes and heart health"},
        {"brand": "Ozempic", "generic": "Semaglutide", "composition": "Semaglutide 0.5mg", "dosage": "0.5mg injection", "description": "GLP-1 receptor agonist"},
    ],
    "Blood Pressure": [
        {"brand": "Amlodipine", "generic": "Amlodipine", "composition": "Amlodipine 5mg", "dosage": "5mg", "description": "Calcium channel blocker"},
        {"brand": "Norvasc", "generic": "Amlodipine", "composition": "Amlodipine 10mg", "dosage": "10mg", "description": "Blood pressure control"},
        {"brand": "Lisinopril", "generic": "Lisinopril", "composition": "Lisinopril 10mg", "dosage": "10mg", "description": "ACE inhibitor"},
        {"brand": "Losartan", "generic": "Losartan", "composition": "Losartan 50mg", "dosage": "50mg", "description": "ARB for hypertension"},
        {"brand": "Atenolol", "generic": "Atenolol", "composition": "Atenolol 50mg", "dosage": "50mg", "description": "Beta blocker"},
        {"brand": "Metoprolol", "generic": "Metoprolol", "composition": "Metoprolol 50mg", "dosage": "50mg", "description": "Beta blocker for BP and heart"},
        {"brand": "Ramipril", "generic": "Ramipril", "composition": "Ramipril 5mg", "dosage": "5mg", "description": "ACE inhibitor"},
        {"brand": "Telmisartan", "generic": "Telmisartan", "composition": "Telmisartan 40mg", "dosage": "40mg", "description": "ARB for blood pressure"},
    ],
    "Vitamins": [
        {"brand": "Vitamin D3", "generic": "Cholecalciferol", "composition": "Vitamin D3 60000 IU", "dosage": "60000 IU", "description": "Bone health supplement"},
        {"brand": "Becosules", "generic": "B-Complex", "composition": "Vitamin B Complex", "dosage": "1 capsule", "description": "B vitamin supplement"},
        {"brand": "Vitamin C", "generic": "Ascorbic Acid", "composition": "Vitamin C 500mg", "dosage": "500mg", "description": "Immunity booster"},
        {"brand": "Multivitamin", "generic": "Multivitamin", "composition": "Multiple vitamins and minerals", "dosage": "1 tablet", "description": "Complete nutrition"},
        {"brand": "Omega-3", "generic": "Fish Oil", "composition": "Omega-3 1000mg", "dosage": "1000mg", "description": "Heart and brain health"},
        {"brand": "Calcium", "generic": "Calcium Carbonate", "composition": "Calcium 500mg", "dosage": "500mg", "description": "Bone strength"},
        {"brand": "Iron", "generic": "Ferrous Sulfate", "composition": "Iron 65mg", "dosage": "65mg", "description": "Anemia treatment"},
        {"brand": "Zinc", "generic": "Zinc Sulfate", "composition": "Zinc 50mg", "dosage": "50mg", "description": "Immunity support"},
    ],
    "Antacids": [
        {"brand": "Omeprazole", "generic": "Omeprazole", "composition": "Omeprazole 20mg", "dosage": "20mg", "description": "Proton pump inhibitor"},
        {"brand": "Pantoprazole", "generic": "Pantoprazole", "composition": "Pantoprazole 40mg", "dosage": "40mg", "description": "Acid reflux treatment"},
        {"brand": "Ranitidine", "generic": "Ranitidine", "composition": "Ranitidine 150mg", "dosage": "150mg", "description": "H2 blocker for acidity"},
        {"brand": "ENO", "generic": "Sodium Bicarbonate", "composition": "Fruit Salt", "dosage": "5g sachet", "description": "Fast relief from acidity"},
        {"brand": "Gelusil", "generic": "Antacid", "composition": "Aluminum Hydroxide + Magnesium", "dosage": "1 tablet", "description": "Antacid for heartburn"},
        {"brand": "Digene", "generic": "Antacid", "composition": "Magnesium Aluminum Silicate", "dosage": "1 tablet", "description": "Acidity relief"},
    ],
    "Antihistamines": [
        {"brand": "Cetirizine", "generic": "Cetirizine", "composition": "Cetirizine 10mg", "dosage": "10mg", "description": "Allergy relief"},
        {"brand": "Allegra", "generic": "Fexofenadine", "composition": "Fexofenadine 120mg", "dosage": "120mg", "description": "Non-drowsy antihistamine"},
        {"brand": "Zyrtec", "generic": "Cetirizine", "composition": "Cetirizine 5mg", "dosage": "5mg", "description": "24-hour allergy relief"},
        {"brand": "Benadryl", "generic": "Diphenhydramine", "composition": "Diphenhydramine 25mg", "dosage": "25mg", "description": "Allergy and cold relief"},
        {"brand": "Loratadine", "generic": "Loratadine", "composition": "Loratadine 10mg", "dosage": "10mg", "description": "Antihistamine for allergies"},
    ],
    "Cough & Cold": [
        {"brand": "Benadryl Cough", "generic": "Dextromethorphan", "composition": "Dextromethorphan 15mg", "dosage": "15mg/5ml", "description": "Cough suppressant"},
        {"brand": "Vicks Action 500", "generic": "Paracetamol-Phenylephrine", "composition": "Paracetamol 500mg + Phenylephrine 10mg", "dosage": "500mg/10mg", "description": "Cold and flu relief"},
        {"brand": "Sinarest", "generic": "Paracetamol-Chlorpheniramine", "composition": "Paracetamol 500mg + CPM 2mg", "dosage": "500mg/2mg", "description": "Cold symptom relief"},
        {"brand": "Dolo Cold", "generic": "Paracetamol-Phenylephrine", "composition": "Paracetamol 650mg + Phenylephrine 5mg", "dosage": "650mg/5mg", "description": "Cold and headache relief"},
        {"brand": "Mucinex", "generic": "Guaifenesin", "composition": "Guaifenesin 600mg", "dosage": "600mg", "description": "Expectorant for chest congestion"},
    ],
    "Antiseptics": [
        {"brand": "Dettol Liquid", "generic": "Chloroxylenol", "composition": "Chloroxylenol 4.8%", "dosage": "Topical", "description": "Antiseptic disinfectant"},
        {"brand": "Betadine", "generic": "Povidone-Iodine", "composition": "Povidone-Iodine 10%", "dosage": "Topical", "description": "Wound disinfectant"},
        {"brand": "Savlon", "generic": "Cetrimide-Chlorhexidine", "composition": "Cetrimide 3% + Chlorhexidine 0.3%", "dosage": "Topical", "description": "Antiseptic liquid"},
        {"brand": "Hydrogen Peroxide", "generic": "Hydrogen Peroxide", "composition": "H2O2 3%", "dosage": "Topical", "description": "Wound cleaner"},
    ],
    "Antidepressants": [
        {"brand": "Prozac", "generic": "Fluoxetine", "composition": "Fluoxetine 20mg", "dosage": "20mg", "description": "SSRI antidepressant"},
        {"brand": "Zoloft", "generic": "Sertraline", "composition": "Sertraline 50mg", "dosage": "50mg", "description": "SSRI for depression and anxiety"},
        {"brand": "Escitalopram", "generic": "Escitalopram", "composition": "Escitalopram 10mg", "dosage": "10mg", "description": "SSRI antidepressant"},
    ],
    "Anti-anxiety": [
        {"brand": "Alprazolam", "generic": "Alprazolam", "composition": "Alprazolam 0.5mg", "dosage": "0.5mg", "description": "Benzodiazepine for anxiety"},
        {"brand": "Lorazepam", "generic": "Lorazepam", "composition": "Lorazepam 1mg", "dosage": "1mg", "description": "Anti-anxiety medication"},
        {"brand": "Buspirone", "generic": "Buspirone", "composition": "Buspirone 10mg", "dosage": "10mg", "description": "Non-benzodiazepine anxiolytic"},
    ],
    "Cholesterol": [
        {"brand": "Atorvastatin", "generic": "Atorvastatin", "composition": "Atorvastatin 10mg", "dosage": "10mg", "description": "Statin for cholesterol"},
        {"brand": "Lipitor", "generic": "Atorvastatin", "composition": "Atorvastatin 20mg", "dosage": "20mg", "description": "Cholesterol management"},
        {"brand": "Rosuvastatin", "generic": "Rosuvastatin", "composition": "Rosuvastatin 10mg", "dosage": "10mg", "description": "Statin medication"},
        {"brand": "Simvastatin", "generic": "Simvastatin", "composition": "Simvastatin 20mg", "dosage": "20mg", "description": "Cholesterol control"},
    ],
    "Thyroid": [
        {"brand": "Levothyroxine", "generic": "Levothyroxine", "composition": "Levothyroxine 50mcg", "dosage": "50mcg", "description": "Thyroid hormone replacement"},
        {"brand": "Synthroid", "generic": "Levothyroxine", "composition": "Levothyroxine 100mcg", "dosage": "100mcg", "description": "Hypothyroidism treatment"},
        {"brand": "Eltroxin", "generic": "Levothyroxine", "composition": "Levothyroxine 75mcg", "dosage": "75mcg", "description": "Thyroid medication"},
    ],
}

# Substitute mappings (medicine_id relationships)
SUBSTITUTE_RELATIONSHIPS = [
    # Paracetamol substitutes
    {"brand": "Tylenol", "substitutes": ["Crocin"], "type": "same_generic"},
    {"brand": "Crocin", "substitutes": ["Tylenol"], "type": "same_generic"},
    
    # Ibuprofen substitutes
    {"brand": "Advil", "substitutes": ["Brufen", "Combiflam"], "type": "same_generic"},
    {"brand": "Brufen", "substitutes": ["Advil", "Combiflam"], "type": "same_generic"},
    
    # Metformin substitutes
    {"brand": "Glucophage", "substitutes": ["Glycomet"], "type": "same_generic"},
    {"brand": "Glycomet", "substitutes": ["Glucophage"], "type": "same_generic"},
    
    # Amlodipine substitutes
    {"brand": "Amlodipine", "substitutes": ["Norvasc"], "type": "same_generic"},
    {"brand": "Norvasc", "substitutes": ["Amlodipine"], "type": "same_generic"},
    
    # Azithromycin substitutes
    {"brand": "Azithral", "substitutes": ["Zithromax"], "type": "same_generic"},
    {"brand": "Zithromax", "substitutes": ["Azithral"], "type": "same_generic"},
    
    # Omeprazole/Pantoprazole (similar)
    {"brand": "Omeprazole", "substitutes": ["Pantoprazole"], "type": "similar_composition"},
    {"brand": "Pantoprazole", "substitutes": ["Omeprazole"], "type": "similar_composition"},
    
    # Cetirizine substitutes
    {"brand": "Cetirizine", "substitutes": ["Zyrtec", "Allegra"], "type": "same_generic"},
    {"brand": "Zyrtec", "substitutes": ["Cetirizine", "Allegra"], "type": "same_generic"},
    
    # Atorvastatin substitutes
    {"brand": "Atorvastatin", "substitutes": ["Lipitor"], "type": "same_generic"},
    {"brand": "Lipitor", "substitutes": ["Atorvastatin"], "type": "same_generic"},
    
    # Levothyroxine substitutes
    {"brand": "Levothyroxine", "substitutes": ["Synthroid", "Eltroxin"], "type": "same_generic"},
    {"brand": "Synthroid", "substitutes": ["Levothyroxine", "Eltroxin"], "type": "same_generic"},
]

# Pharmacy data
PHARMACIES = [
    {"name": "Apollo Pharmacy - Downtown", "locality": "Downtown Central", "coordinates": {"lat": 28.6139, "lng": 77.2090}, "contact": "+91-9876543210", "operating_hours": "24/7", "is_24x7": True},
    {"name": "MedPlus - Green Park", "locality": "Green Park", "coordinates": {"lat": 28.5590, "lng": 77.2063}, "contact": "+91-9876543211", "operating_hours": "8:00 AM - 10:00 PM", "is_24x7": False},
    {"name": "Wellness Forever - Lajpat Nagar", "locality": "Lajpat Nagar", "coordinates": {"lat": 28.5677, "lng": 77.2433}, "contact": "+91-9876543212", "operating_hours": "9:00 AM - 9:00 PM", "is_24x7": False},
    {"name": "LifeCare Pharmacy - Saket", "locality": "Saket", "coordinates": {"lat": 28.5244, "lng": 77.2066}, "contact": "+91-9876543213", "operating_hours": "24/7", "is_24x7": True},
    {"name": "HealthFirst - Nehru Place", "locality": "Nehru Place", "coordinates": {"lat": 28.5494, "lng": 77.2501}, "contact": "+91-9876543214", "operating_hours": "8:00 AM - 11:00 PM", "is_24x7": False},
    {"name": "MediCare Plus - Vasant Kunj", "locality": "Vasant Kunj", "coordinates": {"lat": 28.5216, "lng": 77.1571}, "contact": "+91-9876543215", "operating_hours": "7:00 AM - 10:00 PM", "is_24x7": False},
    {"name": "QuickMeds - Connaught Place", "locality": "Connaught Place", "coordinates": {"lat": 28.6304, "lng": 77.2177}, "contact": "+91-9876543216", "operating_hours": "24/7", "is_24x7": True},
    {"name": "CityMed Pharmacy - Hauz Khas", "locality": "Hauz Khas", "coordinates": {"lat": 28.5494, "lng": 77.2001}, "contact": "+91-9876543217", "operating_hours": "9:00 AM - 8:00 PM", "is_24x7": False},
    {"name": "Apollo 24|7 - Dwarka", "locality": "Dwarka Sector 12", "coordinates": {"lat": 28.5921, "lng": 77.0460}, "contact": "+91-9876543218", "operating_hours": "24/7", "is_24x7": True},
    {"name": "Guardian Pharmacy - Rohini", "locality": "Rohini Sector 7", "coordinates": {"lat": 28.7041, "lng": 77.1025}, "contact": "+91-9876543219", "operating_hours": "8:00 AM - 10:00 PM", "is_24x7": False},
    {"name": "MedPoint - Rajouri Garden", "locality": "Rajouri Garden", "coordinates": {"lat": 28.6414, "lng": 77.1212}, "contact": "+91-9876543220", "operating_hours": "9:00 AM - 9:30 PM", "is_24x7": False},
    {"name": "HealthHub - Janakpuri", "locality": "Janakpuri West", "coordinates": {"lat": 28.6219, "lng": 77.0857}, "contact": "+91-9876543221", "operating_hours": "8:00 AM - 10:00 PM", "is_24x7": False},
    {"name": "24/7 MediStore - Mayur Vihar", "locality": "Mayur Vihar Phase 1", "coordinates": {"lat": 28.6096, "lng": 77.2968}, "contact": "+91-9876543222", "operating_hours": "24/7", "is_24x7": True},
    {"name": "PharmEasy Store - Pitampura", "locality": "Pitampura", "coordinates": {"lat": 28.6942, "lng": 77.1314}, "contact": "+91-9876543223", "operating_hours": "9:00 AM - 9:00 PM", "is_24x7": False},
    {"name": "NetMeds Express - Laxmi Nagar", "locality": "Laxmi Nagar", "coordinates": {"lat": 28.6344, "lng": 77.2772}, "contact": "+91-9876543224", "operating_hours": "8:30 AM - 10:00 PM", "is_24x7": False},
    {"name": "Sunrise Pharmacy - Karol Bagh", "locality": "Karol Bagh", "coordinates": {"lat": 28.6519, "lng": 77.1909}, "contact": "+91-9876543225", "operating_hours": "7:00 AM - 11:00 PM", "is_24x7": False},
    {"name": "Emergency Meds - Malviya Nagar", "locality": "Malviya Nagar", "coordinates": {"lat": 28.5355, "lng": 77.2054}, "contact": "+91-9876543226", "operating_hours": "24/7", "is_24x7": True},
    {"name": "PrimeCare Pharmacy - Tilak Nagar", "locality": "Tilak Nagar", "coordinates": {"lat": 28.6413, "lng": 77.0933}, "contact": "+91-9876543227", "operating_hours": "8:00 AM - 9:00 PM", "is_24x7": False},
    {"name": "MediQuick - Kalkaji", "locality": "Kalkaji", "coordinates": {"lat": 28.5494, "lng": 77.2588}, "contact": "+91-9876543228", "operating_hours": "9:00 AM - 10:00 PM", "is_24x7": False},
    {"name": "TrustMed - Preet Vihar", "locality": "Preet Vihar", "coordinates": {"lat": 28.6420, "lng": 77.2954}, "contact": "+91-9876543229", "operating_hours": "8:00 AM - 10:30 PM", "is_24x7": False},
    {"name": "Apollo Pharmacy - Paschim Vihar", "locality": "Paschim Vihar", "coordinates": {"lat": 28.6692, "lng": 77.1005}, "contact": "+91-9876543230", "operating_hours": "24/7", "is_24x7": True},
    {"name": "MedStore - Greater Kailash", "locality": "Greater Kailash 1", "coordinates": {"lat": 28.5494, "lng": 77.2418}, "contact": "+91-9876543231", "operating_hours": "9:00 AM - 9:00 PM", "is_24x7": False},
    {"name": "HealthPlus - Vikaspuri", "locality": "Vikaspuri", "coordinates": {"lat": 28.6414, "lng": 77.0636}, "contact": "+91-9876543232", "operating_hours": "8:00 AM - 10:00 PM", "is_24x7": False},
    {"name": "Remedy Pharmacy - Uttam Nagar", "locality": "Uttam Nagar", "coordinates": {"lat": 28.6219, "lng": 77.0636}, "contact": "+91-9876543233", "operating_hours": "7:00 AM - 10:00 PM", "is_24x7": False},
    {"name": "LifeLine Drugs - Model Town", "locality": "Model Town", "coordinates": {"lat": 28.7041, "lng": 77.1900}, "contact": "+91-9876543234", "operating_hours": "24/7", "is_24x7": True},
]

def get_all_medicines():
    """Get all medicines from categories"""
    all_medicines = []
    for category, medicines in MEDICINE_CATEGORIES.items():
        for med in medicines:
            all_medicines.append({**med, "category": category})
    return all_medicines

def generate_inventory(pharmacies, medicines):
    """Generate random inventory for pharmacies"""
    inventory = []
    for pharmacy in pharmacies:
        # Each pharmacy stocks 60-80% of all medicines
        num_medicines = random.randint(int(len(medicines) * 0.6), int(len(medicines) * 0.8))
        selected_medicines = random.sample(medicines, num_medicines)
        
        for medicine in selected_medicines:
            quantity = random.choices(
                [0, random.randint(5, 15), random.randint(15, 50), random.randint(50, 200)],
                weights=[0.1, 0.2, 0.4, 0.3]
            )[0]
            
            inventory.append({
                "inventory_id": str(uuid.uuid4()),
                "pharmacy_id": pharmacy["pharmacy_id"],
                "medicine_id": medicine["medicine_id"],
                "quantity": quantity,
                "price": round(random.uniform(10, 500), 2),
                "low_stock_threshold": 20,
                "status": "in_stock" if quantity > 20 else ("low_stock" if quantity > 0 else "out_of_stock"),
                "last_updated": datetime.now().isoformat()
            })
    
    return inventory

def generate_users():
    """Generate demo users"""
    return [
        {
            "user_id": str(uuid.uuid4()),
            "name": "Demo User",
            "email": "user@demo.com",
            "password": "password123",
            "role": "user",
            "phone": "+91-9999999990",
            "created_at": datetime.now().isoformat()
        },
        {
            "user_id": str(uuid.uuid4()),
            "name": "Demo Pharmacy",
            "email": "pharmacy@demo.com",
            "password": "password123",
            "role": "pharmacy",
            "phone": "+91-9999999991",
            "created_at": datetime.now().isoformat()
        },
        {
            "user_id": str(uuid.uuid4()),
            "name": "Admin User",
            "email": "admin@demo.com",
            "password": "password123",
            "role": "admin",
            "phone": "+91-9999999992",
            "created_at": datetime.now().isoformat()
        },
        {
            "user_id": str(uuid.uuid4()),
            "name": "John Doe",
            "email": "john@example.com",
            "password": "password123",
            "role": "user",
            "phone": "+91-9999999993",
            "created_at": datetime.now().isoformat()
        },
        {
            "user_id": str(uuid.uuid4()),
            "name": "Sarah Smith",
            "email": "sarah@example.com",
            "password": "password123",
            "role": "user",
            "phone": "+91-9999999994",
            "created_at": datetime.now().isoformat()
        },
    ]

def generate_reservations(users, pharmacies, medicines, inventory):
    """Generate sample reservations"""
    reservations = []
    user_list = [u for u in users if u["role"] == "user"]
    
    for _ in range(20):
        user = random.choice(user_list)
        pharmacy = random.choice(pharmacies)
        
        # Get available inventory for this pharmacy
        pharmacy_inventory = [inv for inv in inventory if inv["pharmacy_id"] == pharmacy["pharmacy_id"] and inv["quantity"] > 0]
        if not pharmacy_inventory:
            continue
            
        inv_item = random.choice(pharmacy_inventory)
        medicine = next((m for m in medicines if m["medicine_id"] == inv_item["medicine_id"]), None)
        
        if not medicine:
            continue
        
        status = random.choice(["pending", "confirmed", "completed", "cancelled"])
        days_ago = random.randint(0, 30)
        created_date = datetime.now() - timedelta(days=days_ago)
        
        reservations.append({
            "reservation_id": str(uuid.uuid4()),
            "user_id": user["user_id"],
            "pharmacy_id": pharmacy["pharmacy_id"],
            "medicine_id": medicine["medicine_id"],
            "quantity": random.randint(1, 3),
            "pickup_time": (created_date + timedelta(hours=random.randint(2, 48))).isoformat(),
            "status": status,
            "notes": "Urgent" if random.random() < 0.3 else "",
            "created_at": created_date.isoformat(),
            "updated_at": created_date.isoformat()
        })
    
    return reservations

def prepare_seed_data():
    """Prepare all seed data"""
    # Generate medicines with IDs
    all_medicines = get_all_medicines()
    medicines = []
    for med in all_medicines:
        medicines.append({
            "medicine_id": str(uuid.uuid4()),
            **med
        })
    
    # Generate pharmacies with IDs
    pharmacies = []
    for pharm in PHARMACIES:
        pharmacies.append({
            "pharmacy_id": str(uuid.uuid4()),
            **pharm,
            "status": "open",
            "verified": True,
            "created_at": datetime.now().isoformat()
        })
    
    # Link pharmacy user to first pharmacy
    users = generate_users()
    pharmacy_user = next(u for u in users if u["role"] == "pharmacy")
    pharmacy_user["pharmacy_id"] = pharmacies[0]["pharmacy_id"]
    
    # Generate inventory
    inventory = generate_inventory(pharmacies, medicines)
    
    # Generate substitute mappings
    substitute_mappings = []
    for rel in SUBSTITUTE_RELATIONSHIPS:
        source_med = next((m for m in medicines if m["brand"] == rel["brand"]), None)
        if not source_med:
            continue
        
        substitute_ids = []
        for sub_brand in rel["substitutes"]:
            sub_med = next((m for m in medicines if m["brand"] == sub_brand), None)
            if sub_med:
                substitute_ids.append(sub_med["medicine_id"])
        
        if substitute_ids:
            substitute_mappings.append({
                "mapping_id": str(uuid.uuid4()),
                "medicine_id": source_med["medicine_id"],
                "substitute_ids": substitute_ids,
                "relationship_type": rel["type"]
            })
    
    # Generate reservations
    reservations = generate_reservations(users, pharmacies, medicines, inventory)
    
    return {
        "users": users,
        "pharmacies": pharmacies,
        "medicines": medicines,
        "inventory": inventory,
        "substitute_mappings": substitute_mappings,
        "reservations": reservations
    }
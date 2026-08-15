from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- DEMO DATA ----------------

donors = [
    {
        "id": 1,
        "name": "Arun",
        "age": 24,
        "blood_group": "O+",
        "phone": "9876543210",
        "city": "Chennai"
    },
    {
        "id": 2,
        "name": "Priya",
        "age": 22,
        "blood_group": "A+",
        "phone": "9876543211",
        "city": "Chennai"
    },
    {
        "id": 3,
        "name": "Karthik",
        "age": 26,
        "blood_group": "B+",
        "phone": "9876543212",
        "city": "Coimbatore"
    }
]

blood_requests = []


# ---------------- HOME ----------------

@app.get("/")
def home():
    return {
        "message": "Smart Blood Donor Backend is running!"
    }


# ---------------- TEST API ----------------

@app.get("/api/test")
def test_api():
    return {
        "message": "Donor API is ready!"
    }


# ---------------- DONOR MODEL ----------------

class Donor(BaseModel):
    name: str
    age: int
    blood_group: str
    phone: str
    city: str


# ---------------- ADD DONOR ----------------

@app.post("/api/donors")
def add_donor(donor: Donor):

    new_donor = {
        "id": len(donors) + 1,
        "name": donor.name,
        "age": donor.age,
        "blood_group": donor.blood_group,
        "phone": donor.phone,
        "city": donor.city
    }

    donors.append(new_donor)

    return {
        "message": "Donor added successfully!",
        "donor": new_donor
    }


# ---------------- GET ALL DONORS ----------------

@app.get("/api/donors")
def get_donors():

    return {
        "donors": donors
    }


# ---------------- SEARCH DONORS ----------------

@app.get("/api/donors/search")
def search_donors(blood_group: str, city: str):

    matches = [
        donor for donor in donors
        if donor["blood_group"].lower() == blood_group.lower()
        and donor["city"].lower() == city.lower()
    ]

    return {
        "blood_group": blood_group,
        "city": city,
        "donors": matches
    }


# ---------------- BLOOD REQUEST MODEL ----------------

class BloodRequest(BaseModel):
    patient_name: str
    blood_group: str
    city: str
    units_needed: int
    status: str = "Pending"


# ---------------- CREATE BLOOD REQUEST ----------------

@app.post("/api/requests")
def create_blood_request(request: BloodRequest):

    new_request = {
        "id": len(blood_requests) + 1,
        "patient_name": request.patient_name,
        "blood_group": request.blood_group,
        "city": request.city,
        "units_needed": request.units_needed,
        "status": request.status
    }

    blood_requests.append(new_request)

    return {
        "message": "Blood request created successfully!",
        "request": new_request
    }


# ---------------- SMART DONOR MATCHING ----------------

@app.get("/api/match")
def match_donors(blood_group: str, city: str):

    matches = [
    donor for donor in donors
    if donor["blood_group"].lower() == blood_group.lower()
]

    return {
        "blood_group": blood_group,
        "city": city,
        "matching_donors": matches,
        "total_matches": len(matches)
    }

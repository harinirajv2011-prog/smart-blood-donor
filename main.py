from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import db

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


# ---------------- DATABASE TEST ----------------

@app.get("/api/db-test")
def database_test():
    cursor = db.cursor()

    cursor.execute("SELECT 1")
    result = cursor.fetchone()

    cursor.close()

    return {
        "message": "Database connected successfully!",
        "result": result[0]
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

    cursor = db.cursor()

    query = """
        INSERT INTO donors
        (name, age, blood_group, phone, city)
        VALUES (%s, %s, %s, %s, %s)
    """

    values = (
        donor.name,
        donor.age,
        donor.blood_group,
        donor.phone,
        donor.city
    )

    cursor.execute(query, values)
    db.commit()

    donor_id = cursor.lastrowid

    cursor.close()

    return {
        "message": "Donor added successfully!",
        "donor_id": donor_id
    }


# ---------------- GET ALL DONORS ----------------

@app.get("/api/donors")
def get_donors():

    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM donors")

    donors = cursor.fetchall()

    cursor.close()

    return {
        "donors": donors
    }


# ---------------- SEARCH DONORS ----------------

@app.get("/api/donors/search")
def search_donors(blood_group: str, city: str):

    cursor = db.cursor(dictionary=True)

    query = """
        SELECT * FROM donors
        WHERE LOWER(blood_group) = LOWER(%s)
        AND LOWER(city) = LOWER(%s)
    """

    cursor.execute(query, (blood_group, city))

    donors = cursor.fetchall()

    cursor.close()

    return {
        "blood_group": blood_group,
        "city": city,
        "donors": donors
    }


# ---------------- BLOOD REQUEST MODEL ----------------

class BloodRequest(BaseModel):
    patient_name: str
    blood_group: str
    city: str
    units_needed: int


# ---------------- CREATE BLOOD REQUEST ----------------

@app.post("/api/requests")
def create_blood_request(request: BloodRequest):

    cursor = db.cursor()

    query = """
        INSERT INTO blood_requests
        (patient_name, blood_group, city, units_needed)
        VALUES (%s, %s, %s, %s)
    """

    values = (
        request.patient_name,
        request.blood_group,
        request.city,
        request.units_needed
    )

    cursor.execute(query, values)
    db.commit()

    request_id = cursor.lastrowid

    cursor.close()

    return {
        "message": "Blood request created successfully!",
        "request_id": request_id
    }


# ---------------- SMART DONOR MATCHING ----------------

@app.get("/api/match")
def match_donors(blood_group: str, city: str):

    cursor = db.cursor(dictionary=True)

    query = """
        SELECT * FROM donors
        WHERE LOWER(blood_group) = LOWER(%s)
        AND LOWER(city) = LOWER(%s)
    """

    cursor.execute(query, (blood_group, city))

    donors = cursor.fetchall()

    cursor.close()

    return {
        "blood_group": blood_group,
        "city": city,
        "matching_donors": donors,
        "total_matches": len(donors)
    }
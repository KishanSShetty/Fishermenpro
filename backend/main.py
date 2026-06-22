from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import datetime

app = FastAPI(title="Fisherman Safety API")

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "boats.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS boats (
            boat_no INTEGER PRIMARY KEY,
            status INTEGER,
            latitude REAL,
            longitude REAL,
            updated_at TEXT
        )
    ''')
    conn.commit()
    conn.close()

# Initialize Database on startup
init_db()

class BoatData(BaseModel):
    boat_no: int
    status: int
    latitude: float
    longitude: float

@app.post("/update")
def update_boat(data: BoatData):
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        
        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        c.execute('''
            INSERT INTO boats (boat_no, status, latitude, longitude, updated_at)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(boat_no) DO UPDATE SET
                status=excluded.status,
                latitude=excluded.latitude,
                longitude=excluded.longitude,
                updated_at=excluded.updated_at
        ''', (data.boat_no, data.status, data.latitude, data.longitude, timestamp))
        
        conn.commit()
        conn.close()
        
        return {"message": "updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/boats")
def get_boats():
    try:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute('SELECT * FROM boats')
        rows = c.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

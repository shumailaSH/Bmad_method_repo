from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.recommendations import router as recommendations_router
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


app = FastAPI(
    title="bmad-poc API",
    description="Backend scaffold for the bmad-poc outfit recommendation MVP.",
    version="0.1.0",
)

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include the recommendations router
app.include_router(recommendations_router, prefix="/api/v1")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}

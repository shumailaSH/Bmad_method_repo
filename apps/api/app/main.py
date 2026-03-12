from fastapi import FastAPI
from app.api.recommendations import router as recommendations_router


app = FastAPI(
    title="bmad-poc API",
    description="Backend scaffold for the bmad-poc outfit recommendation MVP.",
    version="0.1.0",
)

# Include the recommendations router
app.include_router(recommendations_router, prefix="/api/v1")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}

# Load environment variables first
from dotenv import load_dotenv

load_dotenv()


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import ALLOWED_CORS_ORIGINS, IS_DEBUG_ENABLED, IS_PROD
from routes import (
    accounts,
    screenshot,
    generate_code,
    home,
    evals,
    export,
    design_systems,
    prompt_reports,
)
from uploaded_assets import configure_uploaded_asset_routes

app = FastAPI(openapi_url=None, docs_url=None, redoc_url=None)
configure_uploaded_asset_routes(app)


@app.on_event("startup")
async def log_debug_mode() -> None:
    debug_status = "ENABLED" if IS_DEBUG_ENABLED else "DISABLED"
    print(f"Backend startup complete. Debug mode is {debug_status}.")

cors_allow_origins = ["*"]
cors_allow_credentials = True

if IS_PROD and ALLOWED_CORS_ORIGINS:
    cors_allow_origins = ALLOWED_CORS_ORIGINS

# Configure CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_allow_origins,
    allow_credentials=cors_allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add routes
app.include_router(generate_code.router)
app.include_router(screenshot.router)
app.include_router(home.router)
app.include_router(accounts.router)
app.include_router(evals.router)
app.include_router(export.router)
app.include_router(design_systems.router)
app.include_router(prompt_reports.router)

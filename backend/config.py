import os


def env_flag(name: str, default: bool = False) -> bool:
    value = os.environ.get(name)
    if value is None:
        return default

    return value.strip().lower() in {"1", "true", "yes", "on"}


def env_list(name: str) -> list[str]:
    value = os.environ.get(name, "")
    return [item.strip() for item in value.split(",") if item.strip()]

NUM_VARIANTS = 4
NUM_VARIANTS_VIDEO = 2

# LLM-related
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", None)
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", None)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", None)
OPENAI_BASE_URL = os.environ.get("OPENAI_BASE_URL", None)

# Image generation (optional)
REPLICATE_API_KEY = os.environ.get("REPLICATE_API_KEY", None)
QUICKROUTER_IMAGE_API_KEY = os.environ.get("QUICKROUTER_IMAGE_API_KEY", None)
QUICKROUTER_IMAGE_BASE_URL = os.environ.get(
    "QUICKROUTER_IMAGE_BASE_URL", "https://api.quickrouter.ai/v1"
)
QUICKROUTER_IMAGE_MODEL = os.environ.get(
    "QUICKROUTER_IMAGE_MODEL", "gpt-image-2-all"
)
RUNNINGHUB_API_KEY = os.environ.get("RUNNINGHUB_API_KEY", None)
RUNNINGHUB_BASE_URL = os.environ.get("RUNNINGHUB_BASE_URL", "https://www.runninghub.cn")
RUNNINGHUB_IMAGE_MODEL = os.environ.get(
    "RUNNINGHUB_IMAGE_MODEL", "rhart-image-g-2-official/text-to-image"
)

# Debugging-related
IS_DEBUG_ENABLED = env_flag("IS_DEBUG_ENABLED", default=False)
DEBUG_DIR = os.environ.get("DEBUG_DIR", "")

# When enabled, every LLM request is written to run_logs/prompt_reports as a
# JSON report viewable at /evals/prompt-reports.
PROMPT_REPORTS_ENABLED = os.environ.get(
    "PROMPT_REPORTS_ENABLED", ""
).strip().lower() in {"1", "true", "yes", "on"}
LOCAL_ASSET_DIR = os.environ.get(
    "LOCAL_ASSET_DIR", os.path.join(os.path.dirname(__file__), "local_assets")
)

# Set to True when running in production (on the hosted version)
# Used as a feature flag to enable or disable certain features
IS_PROD = env_flag("IS_PROD", default=False)

# Comma-separated list of allowed browser origins in production, for example:
# https://yourdomain.com,https://www.yourdomain.com
ALLOWED_CORS_ORIGINS = env_list("ALLOWED_CORS_ORIGINS")

# Hosted account features
ENABLE_AUTH = env_flag("ENABLE_AUTH", default=IS_PROD)
FREE_GENERATIONS_PER_USER = int(os.environ.get("FREE_GENERATIONS_PER_USER", "10"))

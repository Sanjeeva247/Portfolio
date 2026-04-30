import logging
import sys
from pathlib import Path
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)

# Always resolve .env relative to this file, regardless of working directory
_ENV_FILE = Path(__file__).parent / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Required
    mongo_uri: str
    db_name: str
    # Store as raw string; parsed into list by validator below
    allowed_origins: str

    # Optional SMTP fields
    smtp_host: str | None = None
    smtp_port: int | None = None
    smtp_user: str | None = None
    smtp_password: str | None = None
    notify_email: str | None = None

    @property
    def origins_list(self) -> list[str]:
        """Return allowed_origins as a list, splitting on commas."""
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def email_enabled(self) -> bool:
        return all(
            [
                self.smtp_host,
                self.smtp_port,
                self.smtp_user,
                self.smtp_password,
                self.notify_email,
            ]
        )


try:
    settings = Settings()  # type: ignore[call-arg]
except Exception as exc:
    logger.critical("Missing or invalid environment variable: %s", exc)
    sys.exit(1)

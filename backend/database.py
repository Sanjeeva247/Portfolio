import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from .config import settings

logger = logging.getLogger(__name__)

_client: AsyncIOMotorClient | None = None


async def connect_db() -> None:
    """Create the Motor client and verify connectivity by pinging the server."""
    global _client
    _client = AsyncIOMotorClient(settings.mongo_uri)
    # Ping to verify the connection is reachable
    await _client.admin.command("ping")
    logger.info("Connected to MongoDB at %s", settings.mongo_uri)


async def close_db() -> None:
    """Close the Motor client."""
    global _client
    if _client is not None:
        _client.close()
        _client = None
        logger.info("MongoDB connection closed.")


def get_db() -> AsyncIOMotorDatabase:
    """Return the named database from the active client."""
    if _client is None:
        raise RuntimeError("Database client is not initialised. Call connect_db() first.")
    return _client[settings.db_name]

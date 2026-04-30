import logging
from datetime import datetime, timezone

from bson import ObjectId

from .database import get_db

logger = logging.getLogger(__name__)


async def insert_contact(name: str, email: str, message: str) -> str:
    """Insert a contact document and return the string representation of its _id."""
    doc = {
        "name": name,
        "email": email,
        "message": message,
        "created_at": datetime.now(timezone.utc),
    }
    result = await get_db()["contacts"].insert_one(doc)
    return str(result.inserted_id)


async def find_all_contacts() -> list[dict]:
    """Return all contact documents sorted by created_at descending."""
    cursor = get_db()["contacts"].find().sort("created_at", -1)
    docs = await cursor.to_list(length=None)
    for doc in docs:
        doc["id"] = str(doc.pop("_id"))
    return docs

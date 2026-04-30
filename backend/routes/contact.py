import logging

from fastapi import APIRouter, Depends, HTTPException, Request

from ..email_notifier import send_notification
from ..models import find_all_contacts, insert_contact
from ..rate_limiter import check_rate_limit
from ..schemas import ContactDocument, ContactRequest, ContactResponse

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/contact",
    response_model=ContactResponse,
    status_code=201,
    summary="Submit a contact message",
)
async def submit_contact(
    payload: ContactRequest,
    request: Request,
    _: None = Depends(check_rate_limit),
) -> ContactResponse:
    """
    Accept a contact form submission, persist it to MongoDB, and
    optionally send an email notification to the portfolio owner.
    """
    try:
        inserted_id = await insert_contact(payload.name, payload.email, payload.message)
    except Exception as exc:
        logger.exception("Failed to insert contact document: %s", exc)
        raise HTTPException(
            status_code=500,
            detail={"success": False, "message": "Internal server error"},
        )

    # Email failure is non-fatal — send_notification swallows its own exceptions
    await send_notification(payload.name, payload.email, payload.message)

    return ContactResponse(
        success=True,
        message="Message sent successfully",
        id=inserted_id,
    )


@router.get(
    "/contact",
    response_model=list[ContactDocument],
    status_code=200,
    summary="Retrieve all contact messages (admin)",
)
async def get_contacts() -> list[dict]:
    """
    Return all contact messages from MongoDB, sorted by created_at descending.
    """
    return await find_all_contacts()

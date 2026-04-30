import logging
from email.message import EmailMessage

import aiosmtplib

from .config import settings

logger = logging.getLogger(__name__)


async def send_notification(name: str, email: str, message: str) -> None:
    """
    Send an email notification to the portfolio owner when a new contact
    message is received.

    This function is a no-op when email notifications are disabled
    (i.e., when any of the required SMTP environment variables are absent).

    Failures are logged at ERROR level and do NOT propagate — the caller
    always receives a successful return, ensuring that an SMTP failure
    cannot cause the contact submission to fail.
    """
    if not settings.email_enabled:
        return

    msg = EmailMessage()
    msg["From"] = settings.smtp_user
    msg["To"] = settings.notify_email
    msg["Subject"] = f"New contact message from {name}"
    msg.set_content(
    f"Dear Sanjeeva Kumar,\n\n"
    f"You have received a new inquiry through your portfolio website.\n\n"
    f"📌 Visitor Details:\n"
    f"----------------------------------------\n"
    f"Name   : {name}\n"
    f"Email  : {email}\n\n"
    f"📝 Message:\n"
    f"----------------------------------------\n"
    f"{message}\n\n"
    f"🌐 Source: Portfolio Contact Form\n"
    f"📅 Received On: (auto timestamp from backend)\n\n"
    f"Please respond to this inquiry at your earliest convenience.\n\n"
    f"Best regards,\n"
    f"Portfolio Notification System\n"
)

    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_user,
            password=settings.smtp_password,
            start_tls=True,
        )
        logger.info("Notification email sent to %s", settings.notify_email)
    except Exception as exc:
        logger.error("Failed to send notification email: %s", exc)

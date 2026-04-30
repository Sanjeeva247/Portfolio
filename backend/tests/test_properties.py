"""
Property-based tests for the portfolio-contact-system backend.

All 9 correctness properties from the design document are implemented here
using Hypothesis. DB-dependent tests use mongomock-motor for an in-memory
MongoDB to avoid requiring a live Atlas connection.

Run with:
    python -m pytest backend/tests/test_properties.py -v
"""

import sys
import types
from datetime import datetime, timezone
from email.message import EmailMessage
from unittest.mock import MagicMock, patch

import pytest
from hypothesis import HealthCheck, given
from hypothesis import settings as h_settings
from hypothesis import strategies as st
from pydantic import ValidationError

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _make_mock_db():
    """Return an in-memory Motor-compatible database via mongomock-motor."""
    from mongomock_motor import AsyncMongoMockClient

    client = AsyncMongoMockClient()
    return client["test_portfolio"]


def _make_mock_settings():
    """Return a minimal mock settings object that satisfies config imports."""
    mock = MagicMock()
    mock.email_enabled = False
    mock.mongo_uri = "mongodb://localhost:27017"
    mock.db_name = "test_db"
    mock.allowed_origins = ["http://localhost:3000"]
    return mock


# ---------------------------------------------------------------------------
# Property 2: Blank name or message fields are rejected by the validator
# Feature: portfolio-contact-system, Property 2
# ---------------------------------------------------------------------------

WHITESPACE_CHARS = " \t\n\r\x0b\x0c\u00a0\u2003"

whitespace_strategy = st.one_of(
    st.just(""),
    st.text(alphabet=WHITESPACE_CHARS, min_size=1, max_size=50),
)

valid_name = (
    st.text(min_size=1, max_size=100)
    .filter(lambda s: s.strip() != "")
    .filter(lambda s: len(s.splitlines()) <= 1)
)
valid_email = st.emails()
valid_message = st.text(min_size=1, max_size=5000).filter(lambda s: s.strip() != "")


@given(blank=whitespace_strategy, email=valid_email, message=valid_message)
@h_settings(max_examples=20)
def test_property2_blank_name_rejected(blank, email, message):
    """Property 2: Blank name fields are rejected by the validator."""
    from backend.schemas import ContactRequest

    with pytest.raises(ValidationError):
        ContactRequest(name=blank, email=email, message=message)


@given(name=valid_name, email=valid_email, blank=whitespace_strategy)
@h_settings(max_examples=20)
def test_property2_blank_message_rejected(name, email, blank):
    """Property 2: Blank message fields are rejected by the validator."""
    from backend.schemas import ContactRequest

    with pytest.raises(ValidationError):
        ContactRequest(name=name, email=email, message=blank)


# ---------------------------------------------------------------------------
# Property 3: Fields exceeding maximum length are rejected by the validator
# Feature: portfolio-contact-system, Property 3
# ---------------------------------------------------------------------------


@given(
    long_name=st.text(min_size=101, max_size=200).filter(lambda s: s.strip() != ""),
    email=valid_email,
    message=valid_message,
)
@h_settings(max_examples=20)
def test_property3_long_name_rejected(long_name, email, message):
    """Property 3: Names exceeding 100 characters are rejected."""
    from backend.schemas import ContactRequest

    with pytest.raises(ValidationError):
        ContactRequest(name=long_name, email=email, message=message)


@given(
    name=valid_name,
    email=valid_email,
    long_message=st.text(min_size=5001, max_size=5100, alphabet=st.characters(blacklist_categories=("Cs",))).filter(lambda s: s.strip() != ""),
)
@h_settings(
    max_examples=10,
    suppress_health_check=[HealthCheck.large_base_example, HealthCheck.too_slow, HealthCheck.data_too_large],
)
def test_property3_long_message_rejected(name, email, long_message):
    """Property 3: Messages exceeding 5000 characters are rejected."""
    from backend.schemas import ContactRequest

    with pytest.raises(ValidationError):
        ContactRequest(name=name, email=email, message=long_message)


@given(name=valid_name, email=valid_email, message=valid_message)
@h_settings(max_examples=20)
def test_property3_valid_lengths_accepted(name, email, message):
    """Property 3: Valid-length fields are accepted by the validator."""
    from backend.schemas import ContactRequest

    req = ContactRequest(name=name, email=email, message=message)
    assert req.name == name
    assert req.message == message


# ---------------------------------------------------------------------------
# Property 4: Invalid email addresses are rejected by the validator
# Feature: portfolio-contact-system, Property 4
# ---------------------------------------------------------------------------

invalid_email_strategy = st.one_of(
    st.text(min_size=1, max_size=50).filter(lambda s: "@" not in s and s.strip()),
    st.just("notanemail"),
    st.just("missing@"),
    st.just("@nodomain"),
    st.just("no-at-sign"),
    st.just("double@@domain.com"),
)


@given(invalid_email=invalid_email_strategy, name=valid_name, message=valid_message)
@h_settings(max_examples=20)
def test_property4_invalid_email_rejected(invalid_email, name, message):
    """Property 4: Invalid email addresses are rejected by the validator."""
    from backend.schemas import ContactRequest

    with pytest.raises(ValidationError):
        ContactRequest(name=name, email=invalid_email, message=message)


# ---------------------------------------------------------------------------
# Property 5: Requests missing required fields are rejected by the validator
# Feature: portfolio-contact-system, Property 5
# ---------------------------------------------------------------------------


def test_property5_missing_name_rejected():
    """Property 5: Missing name field raises ValidationError."""
    from backend.schemas import ContactRequest

    with pytest.raises(ValidationError) as exc_info:
        ContactRequest(email="test@example.com", message="Hello")
    errors = exc_info.value.errors()
    field_names = [e["loc"][0] for e in errors]
    assert "name" in field_names


def test_property5_missing_email_rejected():
    """Property 5: Missing email field raises ValidationError."""
    from backend.schemas import ContactRequest

    with pytest.raises(ValidationError) as exc_info:
        ContactRequest(name="Alice", message="Hello")
    errors = exc_info.value.errors()
    field_names = [e["loc"][0] for e in errors]
    assert "email" in field_names


def test_property5_missing_message_rejected():
    """Property 5: Missing message field raises ValidationError."""
    from backend.schemas import ContactRequest

    with pytest.raises(ValidationError) as exc_info:
        ContactRequest(name="Alice", email="alice@example.com")
    errors = exc_info.value.errors()
    field_names = [e["loc"][0] for e in errors]
    assert "message" in field_names


# ---------------------------------------------------------------------------
# Property 1: Contact insertion round-trip preserves all fields
# Feature: portfolio-contact-system, Property 1
# ---------------------------------------------------------------------------


@given(name=valid_name, email=valid_email, message=valid_message)
@h_settings(max_examples=20, deadline=None)
async def test_property1_insert_round_trip(name, email, message):
    """Property 1: insert_contact round-trip preserves all fields."""
    from bson import ObjectId

    mock_settings = _make_mock_settings()
    db = _make_mock_db()

    with patch.dict(sys.modules, {"backend.config": types.SimpleNamespace(settings=mock_settings)}):
        # Re-import models with patched config
        import importlib
        import backend.models as models_module

        # Patch get_db directly on the models module
        with patch.object(models_module, "get_db", return_value=db):
            inserted_id = await models_module.insert_contact(name, email, message)
            doc = await db["contacts"].find_one({"_id": ObjectId(inserted_id)})

    assert doc is not None
    assert doc["name"] == name
    assert doc["email"] == email
    assert doc["message"] == message
    assert isinstance(doc["created_at"], datetime)


# ---------------------------------------------------------------------------
# Property 8: GET /api/contact returns documents sorted descending by created_at
# Feature: portfolio-contact-system, Property 8
# ---------------------------------------------------------------------------


@given(
    entries=st.lists(
        st.tuples(valid_name, valid_email, valid_message),
        min_size=2,
        max_size=10,
    )
)
@h_settings(max_examples=20)
async def test_property8_sort_order(entries):
    """Property 8: find_all_contacts returns documents sorted by created_at descending."""
    mock_settings = _make_mock_settings()
    db = _make_mock_db()

    with patch.dict(sys.modules, {"backend.config": types.SimpleNamespace(settings=mock_settings)}):
        import backend.models as models_module

        with patch.object(models_module, "get_db", return_value=db):
            for name, email, message in entries:
                await models_module.insert_contact(name, email, message)
            docs = await models_module.find_all_contacts()

    assert len(docs) == len(entries)
    for i in range(len(docs) - 1):
        assert docs[i]["created_at"] >= docs[i + 1]["created_at"]


# ---------------------------------------------------------------------------
# Property 6: Rate limiter enforces the per-IP request threshold
# Feature: portfolio-contact-system, Property 6
# ---------------------------------------------------------------------------


@given(ip=st.ip_addresses(v=4).map(str))
@h_settings(max_examples=20, deadline=None)
def test_property6_rate_limit_threshold(ip):
    """Property 6: 6th request from same IP within window raises HTTP 429."""
    import backend.rate_limiter as rl
    from fastapi import HTTPException

    # Clear state for this IP
    rl._request_log.pop(ip, None)

    mock_request = MagicMock()
    mock_request.client.host = ip

    # First 5 requests must succeed
    for _ in range(5):
        rl.check_rate_limit(mock_request)

    # 6th request must be rejected
    with pytest.raises(HTTPException) as exc_info:
        rl.check_rate_limit(mock_request)
    assert exc_info.value.status_code == 429

    # Cleanup
    rl._request_log.pop(ip, None)


# ---------------------------------------------------------------------------
# Property 7: Rate limiter resets after the sliding window expires
# Feature: portfolio-contact-system, Property 7
# ---------------------------------------------------------------------------


@given(ip=st.ip_addresses(v=4).map(str))
@h_settings(max_examples=20, deadline=None)
def test_property7_rate_limit_window_reset(ip):
    """Property 7: After window expiry, rate-limited IP can submit again."""
    import backend.rate_limiter as rl
    from fastapi import HTTPException

    # Clear all state before each run to avoid cross-run contamination
    rl._request_log.clear()

    mock_request = MagicMock()
    mock_request.client.host = ip

    # Use a list to avoid closure issues with nonlocal in Hypothesis
    call_count = [0]

    def fake_monotonic():
        call_count[0] += 1
        # Calls 1-6: return time 0 (within window) — 6th call triggers 429
        # Calls 7+: return time 61 (outside window) — 7th call succeeds after eviction
        if call_count[0] <= 6:
            return 0.0
        return 61.0

    with patch("backend.rate_limiter.time") as mock_time:
        mock_time.monotonic = fake_monotonic

        # Exhaust the rate limit (calls 1-5, all at time 0.0)
        for _ in range(5):
            rl.check_rate_limit(mock_request)

        # 6th call: time=0.0, deque has 5 entries at 0.0, none evicted → raises 429
        with pytest.raises(HTTPException):
            rl.check_rate_limit(mock_request)

        # 7th call: time=61.0, all entries at 0.0 are evicted (61-0=61>60) → succeeds
        rl.check_rate_limit(mock_request)

    # Cleanup
    rl._request_log.clear()


# ---------------------------------------------------------------------------
# Property 9: Email notification body contains all submitter fields
# Feature: portfolio-contact-system, Property 9
# ---------------------------------------------------------------------------


@given(name=valid_name, email=valid_email, message=valid_message)
@h_settings(max_examples=20)
async def test_property9_email_body_contains_fields(name, email, message):
    """Property 9: Email notification body contains name, email, and message."""
    captured: list[EmailMessage] = []

    async def mock_send(msg, **kwargs):
        captured.append(msg)

    mock_settings = _make_mock_settings()
    mock_settings.email_enabled = True
    mock_settings.smtp_user = "sender@example.com"
    mock_settings.notify_email = "owner@example.com"
    mock_settings.smtp_host = "smtp.example.com"
    mock_settings.smtp_port = 587
    mock_settings.smtp_password = "secret"

    # Patch the config module before importing email_notifier
    with patch.dict(sys.modules, {"backend.config": types.SimpleNamespace(settings=mock_settings)}):
        import backend.email_notifier as email_notifier_module

        with patch.object(email_notifier_module, "settings", mock_settings):
            with patch("backend.email_notifier.aiosmtplib.send", new=mock_send):
                await email_notifier_module.send_notification(name, email, message)

    assert len(captured) == 1
    body = captured[0].get_body()
    assert body is not None
    # Decode quoted-printable and normalise line endings so MIME folding
    # (soft line-breaks inserted for long values) doesn't cause false failures.
    import quopri
    raw_payload = body.get_payload(decode=True)
    if raw_payload is not None:
        body_text = raw_payload.decode("utf-8", errors="replace").replace("\r\n", "\n").replace("\r", "\n")
    else:
        body_text = body.get_payload()
    assert name.replace("\r\n", "\n").replace("\r", "\n") in body_text
    assert email.replace("\r\n", "\n").replace("\r", "\n") in body_text
    assert message.replace("\r\n", "\n").replace("\r", "\n") in body_text

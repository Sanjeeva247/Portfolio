# Implementation Plan: Portfolio Contact System

## Overview

Implement a production-ready full-stack contact system: a standalone FastAPI (Python) backend with MongoDB persistence, per-IP rate limiting, CORS middleware, and optional SMTP email notifications; plus an updated Next.js `ContactSection` component that calls the real API and surfaces loading, success, and error states. The backend lives in a `backend/` directory at the project root and is deployed independently (Render / Railway).

## Tasks

- [x] 1. Scaffold backend project structure and dependency files
  - Create the `backend/` directory tree: `routes/`, `tests/`
  - Write `backend/requirements.txt` with all pinned dependencies (`fastapi==0.115.5`, `uvicorn[standard]==0.32.1`, `motor==3.6.0`, `pydantic[email]==2.10.3`, `pydantic-settings==2.6.1`, `aiosmtplib==3.0.1`, `python-dotenv==1.0.1`, `hypothesis==6.131.15`, `pytest==8.3.5`, `pytest-asyncio==0.25.3`)
  - Write `backend/.env.example` with all supported environment variables and inline comments for `MONGO_URI`, `DB_NAME`, `ALLOWED_ORIGINS`, and the optional SMTP variables
  - Create empty `backend/__init__.py`, `backend/routes/__init__.py`, and `backend/tests/__init__.py` placeholder files
  - _Requirements: 10.2, 10.3_

- [x] 2. Implement environment configuration module
  - [x] 2.1 Create `backend/config.py` using `pydantic-settings`
    - Define `Settings` class with required fields (`mongo_uri`, `db_name`, `allowed_origins`) and optional SMTP fields
    - Implement `parse_origins` field validator to split comma-separated `ALLOWED_ORIGINS` string into a list
    - Implement `email_enabled` property that returns `True` only when all five SMTP fields are present
    - Wrap `Settings()` instantiation in try/except; log the missing variable name and call `sys.exit(1)` on failure
    - Export a module-level `settings` singleton
    - _Requirements: 8.1, 8.2, 8.3_

- [x] 3. Implement database connection module
  - [x] 3.1 Create `backend/database.py` with Motor async client
    - Implement `connect_db()` async function that creates an `AsyncIOMotorClient` and pings the server to verify connectivity
    - Implement `close_db()` async function that closes the client
    - Implement `get_db()` helper that returns the named database from the active client
    - _Requirements: 3.2, 3.3_

- [x] 4. Implement Pydantic schemas
  - [x] 4.1 Create `backend/schemas.py` with all request and response models
    - Define `ContactRequest` with `name: str`, `email: EmailStr`, `message: str`
    - Add `name_not_blank` field validator: strip whitespace, reject blank strings, enforce ≤ 100 character limit
    - Add `message_not_blank` field validator: strip whitespace, reject blank strings, enforce ≤ 5000 character limit
    - Define `ContactResponse` with `success: bool`, `message: str`, `id: str | None = None`
    - Define `ContactDocument` with `id: str`, `name: str`, `email: str`, `message: str`, `created_at: datetime`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 9.1, 9.2_

  - [ ]* 4.2 Write property test for blank name/message rejection (Property 2)
    - **Property 2: Blank name or message fields are rejected by the validator**
    - Generate strings composed entirely of whitespace (spaces, tabs, newlines, empty string) using `st.text(alphabet=st.characters(whitelist_categories=("Zs",))).filter(...)` and `st.just("")`
    - Assert that constructing `ContactRequest` with a whitespace-only `name` or `message` raises `ValidationError`
    - **Validates: Requirements 2.3, 2.4**

  - [ ]* 4.3 Write property test for field length enforcement (Property 3)
    - **Property 3: Fields exceeding maximum length are rejected by the validator**
    - Generate names longer than 100 chars and messages longer than 5000 chars; assert `ValidationError` is raised
    - Generate valid non-blank strings within limits; assert they are accepted
    - **Validates: Requirements 2.5, 2.6**

  - [ ]* 4.4 Write property test for invalid email rejection (Property 4)
    - **Property 4: Invalid email addresses are rejected by the validator**
    - Generate strings missing `@`, missing domain, or bare local parts; assert `ValidationError` is raised
    - **Validates: Requirements 2.2**

  - [ ]* 4.5 Write property test for missing required fields (Property 5)
    - **Property 5: Requests missing required fields are rejected by the validator**
    - Construct `ContactRequest` with each of `name`, `email`, `message` omitted in turn; assert `ValidationError` identifies the missing field
    - **Validates: Requirements 2.1**

- [x] 5. Implement database helper functions
  - [x] 5.1 Create `backend/models.py` with insert and retrieval helpers
    - Implement `insert_contact(name, email, message) -> str` that builds a document with a UTC `created_at` timestamp, calls `insert_one`, and returns the string `_id`
    - Implement `find_all_contacts() -> list[dict]` that queries the `contacts` collection sorted by `created_at` descending, converts `_id` ObjectId to string `id`, and returns the list
    - _Requirements: 3.1, 4.1, 4.3_

  - [ ]* 5.2 Write property test for insert round-trip field preservation (Property 1)
    - **Property 1: Contact insertion round-trip preserves all fields**
    - Use `@given(name=st.text(...).filter(lambda s: s.strip()), email=st.emails(), message=st.text(...).filter(lambda s: s.strip()))` with `@settings(max_examples=100)`
    - Call `insert_contact`, retrieve the document by returned id, assert `name`, `email`, `message` match and `created_at` is a UTC-aware datetime
    - **Validates: Requirements 1.1, 1.2, 3.1**

  - [ ]* 5.3 Write property test for GET sort order (Property 8)
    - **Property 8: GET /api/contact returns documents sorted descending by created_at**
    - Insert multiple documents with distinct `created_at` values; call `find_all_contacts`; assert each document's `created_at` ≥ the next document's `created_at`
    - **Validates: Requirements 4.1**

- [x] 6. Implement rate limiter
  - [x] 6.1 Create `backend/rate_limiter.py` with sliding-window per-IP limiter
    - Use `defaultdict(deque)` keyed by IP string to track request timestamps via `time.monotonic()`
    - Evict timestamps older than 60 seconds at the start of each check
    - Raise `HTTPException(429)` with the standard error body when the deque length reaches 5 or more
    - Append the current timestamp after the check passes
    - _Requirements: 6.1, 6.2_

  - [ ]* 6.2 Write property test for rate limit threshold enforcement (Property 6)
    - **Property 6: Rate limiter enforces the per-IP request threshold**
    - For any IP string, call `check_rate_limit` 5 times (all must succeed); assert the 6th call raises `HTTPException` with status 429
    - Reset `_request_log` between test runs to avoid state leakage
    - **Validates: Requirements 6.1**

  - [ ]* 6.3 Write property test for rate limit window reset (Property 7)
    - **Property 7: Rate limiter resets after the sliding window expires**
    - Exhaust the rate limit for an IP; monkeypatch `time.monotonic` to advance by > 60 seconds; assert the next call succeeds without raising
    - **Validates: Requirements 6.2**

- [x] 7. Implement email notifier
  - [x] 7.1 Create `backend/email_notifier.py` with optional async SMTP notification
    - Return immediately (no-op) when `settings.email_enabled` is `False`
    - Build an `EmailMessage` with `From`, `To`, `Subject`, and body containing the submitter's name, email, and message
    - Send via `aiosmtplib.send` with `start_tls=True`
    - Catch all exceptions, log at `ERROR` level, and return normally so the caller is unaffected
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 7.2 Write property test for email body content (Property 9)
    - **Property 9: Email notification body contains all submitter fields**
    - For any valid (name, email, message) triple, call `send_notification` with a mocked `aiosmtplib.send` that captures the `EmailMessage`; assert name, email, and message all appear as substrings of the message body
    - **Validates: Requirements 7.1, 7.2**

- [x] 8. Implement route handlers
  - [x] 8.1 Create `backend/routes/contact.py` with POST and GET handlers
    - Define `POST /contact` handler: apply `check_rate_limit` as a `Depends`, call `insert_contact`, call `send_notification`, return `ContactResponse` with status 201
    - Wrap the DB insert in try/except; on failure log the exception and raise `HTTPException(500)` with the standard error body
    - Define `GET /contact` handler: call `find_all_contacts` and return the list with status 200
    - _Requirements: 1.1, 3.4, 4.1, 4.2, 9.3_

- [x] 9. Implement application entry point with middleware and lifespan
  - [x] 9.1 Create `backend/main.py` as the FastAPI app factory
    - Define `lifespan` async context manager that calls `connect_db()` on startup and `close_db()` on shutdown
    - Register `CORSMiddleware` with `allow_origins=settings.allowed_origins`, methods `["GET", "POST", "OPTIONS"]`, and headers `["Content-Type", "Authorization"]`
    - Register the custom `RequestValidationError` exception handler that extracts the first error message and returns `{"success": false, "message": "..."}` with status 422
    - Include `contact_router` under the `/api` prefix
    - Add `GET /health` endpoint returning `{"status": "ok"}` for platform health checks
    - _Requirements: 3.2, 3.3, 5.1, 5.2, 5.3, 5.4, 9.2, 9.3_

- [ ] 10. Write property-based test file
  - [ ] 10.1 Create `backend/tests/test_properties.py` consolidating all 9 property tests
    - Import and configure `pytest-asyncio` with `asyncio_mode = "auto"` in `pytest.ini` or `pyproject.toml`
    - Implement all property tests from tasks 4.2–4.5, 5.2–5.3, 6.2–6.3, and 7.2 in a single file with `# Feature: portfolio-contact-system, Property N: ...` comment headers
    - Use `@settings(max_examples=100)` on each `@given` decorated test
    - Use `mongomock-motor` or an in-memory fixture for DB-dependent properties (Properties 1 and 8) to avoid requiring a live Atlas connection during CI
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 4.1, 6.1, 6.2, 7.1, 7.2_

- [ ] 11. Checkpoint — verify backend tests pass
  - Ensure all tests pass, ask the user if questions arise.
  - Run `pytest backend/tests/test_properties.py -v` to confirm all 9 property tests pass before proceeding to frontend work.

- [ ] 12. Update frontend ContactSection component
  - [ ] 12.1 Add `error` state and replace mock `setTimeout` with real `fetch` call in `src/components/contact-section.tsx`
    - Add `const [error, setError] = useState<string | null>(null)` alongside existing state
    - Replace the `setTimeout` mock in `handleSubmit` with a `fetch` call to `${process.env.NEXT_PUBLIC_API_URL}/api/contact` using `method: "POST"` and `Content-Type: application/json`
    - On non-ok responses (422, 429, 500), extract `data.message` and call `setError`; preserve form fields
    - On network errors (catch block), set error to `"Network error. Please check your connection and try again."`
    - Clear `error` state at the start of each submission attempt
    - _Requirements: 1.3, 1.4, 1.5, 6.3, 9.1, 9.2_

  - [ ] 12.2 Add animated error banner to the contact form JSX
    - Render a `<motion.div>` error banner below the submit button when `error` is non-null, using `initial={{ opacity: 0, y: -10 }}` and `animate={{ opacity: 1, y: 0 }}`
    - Style with `bg-red-500/10 border border-red-500/20 text-red-400` to match the existing design language
    - _Requirements: 1.5, 6.3_

  - [ ] 12.3 Add `NEXT_PUBLIC_API_URL` environment variable documentation
    - Add `NEXT_PUBLIC_API_URL=http://localhost:8000` to `.env.local` (create if absent) for local development
    - Document the variable in the project `README.md` under a new "Environment Variables" section
    - _Requirements: 5.1_

- [ ] 13. Add deployment configuration
  - [ ] 13.1 Create `backend/render.yaml` for Render deployment
    - Define a `web` service with `runtime: python`, `buildCommand: pip install -r requirements.txt`, and `startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT`
    - Declare `MONGO_URI` and `ALLOWED_ORIGINS` as `sync: false` (set in dashboard) and `DB_NAME` with value `portfolio`
    - _Requirements: 10.1_

  - [ ] 13.2 Create `backend/Procfile` for Railway deployment
    - Add `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
    - _Requirements: 10.1_

- [ ] 14. Final checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
  - Verify `pytest backend/tests/ -v` passes and the Next.js build (`next build`) completes without type errors.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use [Hypothesis](https://hypothesis.readthedocs.io/) and are tagged with their design property number
- The backend is a standalone Python service in `backend/`; it is deployed separately from the Next.js frontend
- Use `mongomock-motor` for in-memory MongoDB in property tests to avoid requiring a live Atlas connection in CI
- The `NEXT_PUBLIC_API_URL` env var must be set in both local `.env.local` and the deployment platform dashboard

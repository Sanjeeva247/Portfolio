# Requirements Document

## Introduction

This feature adds a production-ready, full-stack contact system to an existing personal portfolio website. The frontend is already built in Next.js / React with Tailwind CSS and contains a contact form (`ContactSection` component) that currently uses a mock `setTimeout` instead of a real backend. This feature replaces that mock with a live FastAPI (Python) backend, a MongoDB database, and a fully integrated frontend submission flow — including loading states, success/error feedback, rate limiting, and optional email notifications.

---

## Glossary

- **Contact_API**: The FastAPI backend service that receives, validates, and stores contact form submissions.
- **Contact_Form**: The existing React `ContactSection` component that collects name, email, and message from the visitor.
- **Contact_Store**: The MongoDB collection named `contacts` that persists all submitted contact messages.
- **Validator**: The Pydantic model layer inside the Contact_API responsible for input validation.
- **Rate_Limiter**: The middleware component inside the Contact_API that restricts the number of requests per IP address within a time window.
- **Email_Notifier**: The optional SMTP/email-service component that sends a notification email to the portfolio owner when a new contact message is received.
- **Admin_Endpoint**: The authenticated GET endpoint that returns all stored contact messages for administrative review.
- **CORS_Middleware**: The FastAPI middleware that controls which origins are permitted to call the Contact_API.
- **Environment_Config**: The `.env` file and its loader that supplies runtime secrets (`MONGO_URI`, `DB_NAME`, `SMTP_*`) to the Contact_API without hardcoding them.

---

## Requirements

### Requirement 1: Contact Form Submission

**User Story:** As a portfolio visitor, I want to submit my name, email, and message through the contact form, so that the portfolio owner receives my inquiry and can respond.

#### Acceptance Criteria

1. WHEN a visitor submits the contact form with a valid name, email, and message, THE Contact_API SHALL store the submission in the Contact_Store and return HTTP 201 with a JSON body `{ "success": true, "message": "Message sent successfully", "id": "<inserted_id>" }`.
2. WHEN a visitor submits the contact form, THE Contact_API SHALL automatically attach a `created_at` UTC timestamp to the stored document.
3. WHEN a visitor submits the contact form, THE Contact_Form SHALL display a loading spinner and disable the submit button for the duration of the request.
4. WHEN the Contact_API returns a success response, THE Contact_Form SHALL display a success confirmation message and reset all form fields to empty.
5. WHEN the Contact_API returns an error response, THE Contact_Form SHALL display a descriptive error message without clearing the form fields.

---

### Requirement 2: Input Validation

**User Story:** As a portfolio owner, I want all submitted contact data to be validated before storage, so that the Contact_Store contains only well-formed, meaningful records.

#### Acceptance Criteria

1. WHEN a request body is missing the `name`, `email`, or `message` field, THE Validator SHALL reject the request and THE Contact_API SHALL return HTTP 422 with a JSON error body describing the missing fields.
2. WHEN the `email` field does not conform to RFC 5322 email format, THE Validator SHALL reject the request and THE Contact_API SHALL return HTTP 422 with a JSON error body indicating an invalid email address.
3. WHEN the `name` field is an empty string or contains only whitespace, THE Validator SHALL reject the request and THE Contact_API SHALL return HTTP 422.
4. WHEN the `message` field is an empty string or contains only whitespace, THE Validator SHALL reject the request and THE Contact_API SHALL return HTTP 422.
5. WHEN the `name` field exceeds 100 characters, THE Validator SHALL reject the request and THE Contact_API SHALL return HTTP 422.
6. WHEN the `message` field exceeds 5000 characters, THE Validator SHALL reject the request and THE Contact_API SHALL return HTTP 422.

---

### Requirement 3: Data Persistence

**User Story:** As a portfolio owner, I want all valid contact submissions to be durably stored in MongoDB, so that I can review them at any time.

#### Acceptance Criteria

1. THE Contact_Store SHALL persist each accepted submission as a document with the fields: `_id` (ObjectId), `name` (string), `email` (string), `message` (string), and `created_at` (UTC datetime).
2. WHEN the Contact_API starts up, THE Contact_API SHALL establish a connection to MongoDB using the `MONGO_URI` value from the Environment_Config.
3. IF the MongoDB connection cannot be established at startup, THEN THE Contact_API SHALL log the error and exit with a non-zero status code.
4. IF a write operation to the Contact_Store fails after the connection is established, THEN THE Contact_API SHALL return HTTP 500 with a JSON body `{ "success": false, "message": "Internal server error" }` and log the exception.

---

### Requirement 4: Admin Message Retrieval

**User Story:** As a portfolio owner, I want to retrieve all contact messages via an admin endpoint, so that I can review submissions without accessing the database directly.

#### Acceptance Criteria

1. WHEN a GET request is made to `/api/contact`, THE Admin_Endpoint SHALL return HTTP 200 with a JSON array of all documents in the Contact_Store, sorted by `created_at` descending (latest first).
2. WHEN the Contact_Store contains no documents, THE Admin_Endpoint SHALL return HTTP 200 with an empty JSON array `[]`.
3. WHEN a GET request is made to `/api/contact`, THE Admin_Endpoint SHALL serialize each document's `_id` ObjectId as a string field named `id` in the response JSON.

---

### Requirement 5: CORS Configuration

**User Story:** As a frontend developer, I want the Contact_API to accept requests from the portfolio's frontend origin, so that the browser does not block cross-origin requests.

#### Acceptance Criteria

1. THE CORS_Middleware SHALL allow requests from the origins specified in the `ALLOWED_ORIGINS` environment variable.
2. THE CORS_Middleware SHALL allow the HTTP methods `GET`, `POST`, and `OPTIONS`.
3. THE CORS_Middleware SHALL allow the `Content-Type` and `Authorization` request headers.
4. WHEN a preflight OPTIONS request is received, THE CORS_Middleware SHALL respond with HTTP 200 and the appropriate CORS headers.

---

### Requirement 6: Rate Limiting

**User Story:** As a portfolio owner, I want the contact endpoint to enforce rate limits per IP address, so that automated spam submissions are prevented.

#### Acceptance Criteria

1. WHILE a single IP address has submitted more than 5 POST requests to `/api/contact` within a 60-second sliding window, THE Rate_Limiter SHALL reject subsequent requests from that IP and THE Contact_API SHALL return HTTP 429 with a JSON body `{ "success": false, "message": "Too many requests. Please try again later." }`.
2. WHEN a rate-limited IP address waits for the 60-second window to expire, THE Rate_Limiter SHALL permit new requests from that IP.
3. THE Contact_Form SHALL display a user-friendly message when it receives HTTP 429 from the Contact_API.

---

### Requirement 7: Email Notification (Optional Feature)

**User Story:** As a portfolio owner, I want to receive an email notification whenever a new contact message is submitted, so that I can respond promptly without polling the admin endpoint.

#### Acceptance Criteria

1. WHERE email notification is enabled (i.e., `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `NOTIFY_EMAIL` are all present in the Environment_Config), THE Email_Notifier SHALL send a notification email to `NOTIFY_EMAIL` after each successful contact submission.
2. WHERE email notification is enabled, THE Email_Notifier SHALL include the submitter's name, email, and message in the notification email body.
3. IF the Email_Notifier fails to send the notification email, THEN THE Contact_API SHALL log the error and still return HTTP 201 to the client — the email failure SHALL NOT cause the submission to fail.

---

### Requirement 8: Environment Configuration

**User Story:** As a developer deploying the Contact_API, I want all secrets and environment-specific values to be loaded from a `.env` file, so that no credentials are hardcoded in source code.

#### Acceptance Criteria

1. THE Environment_Config SHALL load `MONGO_URI`, `DB_NAME`, and `ALLOWED_ORIGINS` as required variables at application startup.
2. IF any required environment variable is absent, THEN THE Contact_API SHALL log a descriptive error message identifying the missing variable and exit with a non-zero status code.
3. THE Environment_Config SHALL treat `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `NOTIFY_EMAIL` as optional variables; their absence SHALL disable email notification without causing a startup failure.

---

### Requirement 9: API Response Structure

**User Story:** As a frontend developer, I want all Contact_API responses to follow a consistent JSON structure, so that the Contact_Form can handle responses predictably.

#### Acceptance Criteria

1. THE Contact_API SHALL return all success responses with a JSON body containing at minimum the fields `success: true` and `message` (a human-readable string).
2. THE Contact_API SHALL return all error responses with a JSON body containing at minimum the fields `success: false` and `message` (a human-readable string describing the error).
3. THE Contact_API SHALL return HTTP status codes that accurately reflect the outcome: 201 for created, 200 for retrieved, 422 for validation errors, 429 for rate limit exceeded, and 500 for internal server errors.

---

### Requirement 10: Modular Project Structure

**User Story:** As a developer maintaining the Contact_API, I want the backend code to be organized into clearly separated modules, so that each concern is easy to locate, test, and modify independently.

#### Acceptance Criteria

1. THE Contact_API SHALL be organized with the following module files: `main.py` (application entry point and middleware registration), `database.py` (MongoDB connection management), `schemas.py` (Pydantic request/response models), `models.py` (database helper functions), and `routes/contact.py` (route handlers for `/api/contact`).
2. THE Contact_API SHALL expose a `requirements.txt` file listing all Python dependencies with pinned versions.
3. THE Contact_API SHALL include a `.env.example` file listing all supported environment variables with placeholder values and inline comments describing each variable's purpose.

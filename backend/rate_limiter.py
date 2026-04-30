import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request

RATE_LIMIT = 5       # max requests allowed per window
WINDOW_SECS = 60     # sliding window duration in seconds

# Module-level store: IP address -> deque of monotonic timestamps
_request_log: dict[str, deque] = defaultdict(deque)


def check_rate_limit(request: Request) -> None:
    """
    FastAPI dependency that enforces a per-IP sliding-window rate limit.

    Raises HTTPException(429) when the IP has exceeded RATE_LIMIT requests
    within the last WINDOW_SECS seconds.
    """
    ip: str = request.client.host  # type: ignore[union-attr]
    now = time.monotonic()
    window = _request_log[ip]

    # Evict timestamps that have fallen outside the sliding window
    while window and now - window[0] > WINDOW_SECS:
        window.popleft()

    if len(window) >= RATE_LIMIT:
        raise HTTPException(
            status_code=429,
            detail={"success": False, "message": "Too many requests. Please try again later."},
        )

    window.append(now)

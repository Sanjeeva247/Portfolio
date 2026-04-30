from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("name must not be blank or whitespace")
        if len(v) > 100:
            raise ValueError("name must not exceed 100 characters")
        return v

    @field_validator("message")
    @classmethod
    def message_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("message must not be blank or whitespace")
        if len(v) > 5000:
            raise ValueError("message must not exceed 5000 characters")
        return v


class ContactResponse(BaseModel):
    success: bool
    message: str
    id: str | None = None


class ContactDocument(BaseModel):
    id: str
    name: str
    email: str
    message: str
    created_at: datetime

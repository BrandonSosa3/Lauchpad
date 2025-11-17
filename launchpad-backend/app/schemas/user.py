from pydantic import BaseModel, EmailStr, Field, field_serializer
from typing import Optional
from datetime import datetime
from uuid import UUID


# Request schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: Optional[str] = None
    age: Optional[int] = Field(None, ge=13, le=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = Field(None, ge=13, le=100)
    location: Optional[str] = None


class OnboardingComplete(BaseModel):
    biggest_challenge: str = Field(..., pattern="^(money|housing|taxes|all)$")
    life_stage: str = Field(..., pattern="^(college|graduated|first_job|working)$")


# Response schemas
class UserResponse(BaseModel):
    id: int
    uuid: UUID
    email: str
    name: Optional[str]
    age: Optional[int]
    location: Optional[str]
    onboarding_completed: bool
    biggest_challenge: Optional[str]
    life_stage: Optional[str]
    created_at: datetime

    # Serialize UUID as string
    @field_serializer('uuid')
    def serialize_uuid(self, uuid: UUID, _info):
        return str(uuid)

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class AccessTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

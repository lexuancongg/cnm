from pydantic import BaseModel
from typing import Optional

class AuthenticatedUserVm(BaseModel):
    username: str

class AuthenticationInfoVm(BaseModel):
    isAuthenticated: bool
    authenticatedUser: Optional[AuthenticatedUserVm] = None

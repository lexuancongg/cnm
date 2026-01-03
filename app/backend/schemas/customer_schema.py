from pydantic import BaseModel,EmailStr
from typing import Optional, Dict, Any

class CustomerVm(BaseModel):
    id: str
    username: str
    email: Optional[str] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None

    @staticmethod
    def from_keycloak_user(userinfo: Dict[str, Any]) -> "CustomerVm":
        return CustomerVm(
            id=userinfo.get("sub"),
            username=userinfo.get("username"),
            email=userinfo.get("email"),
            firstName=userinfo.get("firstname"),
            lastName=userinfo.get("lastname"),
        )



class CustomerProfilePutVm(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[EmailStr] = None
    username:Optional[str]= None

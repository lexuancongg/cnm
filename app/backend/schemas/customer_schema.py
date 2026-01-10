from pydantic import BaseModel,EmailStr,Field
from typing import Optional, Dict, Any
from datetime import datetime,timezone

class CustomerVm(BaseModel):
    id: str
    username: str
    email: Optional[str] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    createdTimestamp:Optional[datetime]= None

    @staticmethod
    def from_keycloak_user(userinfo: Dict[str, Any]) -> "CustomerVm":
       
        return CustomerVm(
            id=userinfo.get("sub"),
            username=userinfo.get("username"),
            email=userinfo.get("email"),
            firstName=userinfo.get("firstname"),
            lastName=userinfo.get("lastname"),
        )

    def from_admin_user(user: Dict[str, Any]) -> "CustomerVm":
        created_ts = user.get("createdTimestamp")
        created_at = (
            datetime.fromtimestamp(created_ts / 1000, tz=timezone.utc)
            if created_ts else None
        )

        return CustomerVm(
            id=user["id"],
            username=user["username"],
            email=user.get("email"),
            firstName=user.get("firstName"),
            lastName=user.get("lastName"),
            createdTimestamp=created_at
        )



class CustomerProfilePutVm(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[EmailStr] = None
    username:Optional[str]= None



class CustomerPagingVm(BaseModel):
    customers:list[CustomerVm]
    totalPage:int
    totalUser:int




class CustomerCreateVm(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    firstName: str
    lastName: str
    password: str = Field(..., min_length=6)
    role: str
from pydantic import BaseModel,Field
from models.address import Address
from models.userAddress import UserAddress
from schemas.address_schema import *
class UserAddressVm(BaseModel):
    id: int
    userId: str
    addressVm: AddressVm
    isActive: bool

    @classmethod
    def from_model(
        cls,
        user_address: UserAddress,
        address_vm: AddressVm
    ) -> "UserAddressVm":
        return cls(
            id=user_address.id,
            userId=user_address.user_id,
            addressVm=address_vm,
            isActive=user_address.is_active
        )
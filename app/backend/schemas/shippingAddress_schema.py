from pydantic import BaseModel, Field
from models.shippingAddress import ShippingAddress  # SQLAlchemy model

class ShippingAddressPostVm(BaseModel):
    contactName: str = Field(..., min_length=1)
    phoneNumber: str = Field(..., min_length=1)
    specificAddress: str = Field(..., min_length=1)
    districtId: int
    provinceId: int
    countryId: int

    def to_model(self) -> ShippingAddress:
        return ShippingAddress(
            customer_name=self.contactName,
            phone_number=self.phoneNumber,
            specific_address=self.specificAddress,
            district_id=self.districtId,
            province_id=self.provinceId,
            country_id=self.countryId
        )

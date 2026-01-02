from pydantic import BaseModel,Field
from models.address import Address
from models.userAddress import UserAddress

class AddressDetailVm(BaseModel):
    id: int
    contactName: str | None
    phoneNumber: str | None
    specificAddress: str | None

    districtId: int
    districtName: str | None

    provinceId: int
    provinceName: str | None

    countryId: int
    countryName: str | None

    isActive: bool = True

    @staticmethod
    def from_model(address:Address):
        return AddressDetailVm(
            id=address.id,
            contactName=address.contact_name,
            phoneNumber=address.phone_number,
            specificAddress=address.specific_address,

            districtId=address.district.id,
            districtName=address.district.name,

            provinceId=address.province.id,
            provinceName=address.province.name,

            countryId=address.country.id,
            countryName=address.country.name,

            isActive=True
        )



class AddressPostVm(BaseModel):
    contactName: str | None = Field(None, max_length=450)
    phoneNumber: str | None = Field(None, max_length=25)
    specificAddress: str | None = Field(None, max_length=450)

    districtId: int
    provinceId: int
    countryId: int

    def to_model(self) -> Address:
        return Address(
            contact_name=self.contactName,
            phone_number=self.phoneNumber,
            specific_address=self.specificAddress,
            # district_id=self.districtId,
            # province_id=self.provinceId,
            # country_id=self.countryId,
        )
    

class AddressVm(BaseModel):
    id: int
    contactName: str | None
    phoneNumber: str | None
    specificAddress: str | None
    districtId: int
    provinceId: int
    countryId: int

    @classmethod
    def from_model(cls, address: Address) -> "AddressVm":
        return cls(
            id=address.id,
            contactName=address.contact_name,
            phoneNumber=address.phone_number,
            specificAddress=address.specific_address,
            districtId=address.district.id,
            provinceId=address.province.id,
            countryId=address.country.id,
        )
    

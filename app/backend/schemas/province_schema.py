from pydantic import BaseModel
from models.province import Province

class ProvinceGetVm(BaseModel):
    id: int
    name: str
    countryId: int

    @classmethod
    def from_model(cls, province:Province):
        return cls(
            id=province.id,
            name=province.name,
            countryId=province.country.id
        )

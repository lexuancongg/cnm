from pydantic import BaseModel
from models.district import District


class DistrictGetVm(BaseModel):
    id: int
    name: str

    @classmethod
    def from_model(cls, district: District):
        return cls(
            id=district.id,
            name=district.name
        )

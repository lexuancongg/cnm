from pydantic import BaseModel

class CountryGetVm(BaseModel):
    id: int
    name: str

    @classmethod
    def from_model(cls, country):
        return cls(
            id=country.id,
            name=country.name
        )

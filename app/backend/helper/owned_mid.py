from typing import Type, TypeVar
from db.session import get_db
from helper.extractCustomerId import extractCustomerId
from fastapi import Depends,HTTPException
from sqlalchemy.orm import Session

T = TypeVar("T")

def get_owned_entity(
    model: Type[T],
    entity_id: int,
    customer_id: str=Depends(extractCustomerId),
        
    db: Session = Depends(get_db),
) -> T:
    entity = (
        db.query(model)
        .filter(
            model.id == entity_id,
            model.customer_id == customer_id
        )
        .first()
    )

    if not entity:
        raise HTTPException(
            status_code=404,
            detail="Resource not owned"
        )

    return entity

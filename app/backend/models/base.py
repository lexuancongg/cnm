import datetime
from sqlalchemy import Column, Integer, DateTime, String
from sqlalchemy.orm import DeclarativeBase, declared_attr

class Base(DeclarativeBase):
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

class BaseModel(Base):
    __abstract__ = True

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_by = Column(String(100))

    last_updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow
    )
    last_updated_by = Column(String(100))

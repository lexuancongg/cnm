from sqlalchemy.orm import *
from db.session import get_db
from fastapi import *
from schemas.order_schema import *
from models.order import *
from models.orderItem import *
from schemas.orderItem_schema import *


class OrderService:
    def __init__(self, db: Session ):
        self.db = db

    def createOrder( self,customerId:str ,orderPostVm:OrderPostVm)->None:
        order :Order = orderPostVm.to_model()
        order.customer_id = customerId
        orderItems:list[OrderItem] = [
            orderItemPostVm.to_model(order) for orderItemPostVm in orderPostVm.orderItemPostVms
        ]
        order.order_items = orderItems
        self.db.add(order)
        self.db.commit()
        self.db.refresh(order)
        



def orderService(db:Session = Depends(get_db))->OrderService:
    return OrderService(db)

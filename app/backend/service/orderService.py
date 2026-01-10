from sqlalchemy.orm import *
from db.session import get_db
from fastapi import *
from schemas.order_schema import *
from models.order import *
from models.orderItem import *
from schemas.orderItem_schema import *
from models.product import Product
from sqlalchemy import desc
from service.imageService import *
from sqlalchemy import exists, and_


class OrderService:
    def __init__(self, db: Session,image_service:ImageService ):
        self.db = db
        self.imageService = image_service

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
        
    
    def getMyOrders(self,orderStatus:OrderStatus,customerId:str):
        query = self.db.query(Order)
        query = query.filter(Order.customer_id == customerId)
        if orderStatus is not None:
            query = query.filter(Order.order_status == orderStatus)

        query = query.order_by(desc(Order.created_at))
        orders:List[Order] = query.all()
        result: List[OrderVm] = []
        for order in orders:
            order_id = order.id
            shippingAddressVm = self.buildShippingAddress(order.shipping_address)
            orderItems:list[OrderItem] = order.order_items

            product_avatar_map : Dict[int, str]= {
                item.product_id : self.imageService.get_image_by_id(item.product_id).url
                for item in orderItems
            }
            result.append(
                OrderVm.from_model(order=order,order_items=order.order_items,shipping_address_vm=shippingAddressVm,product_avatar_map=product_avatar_map)
            )
        return result;

    def  buildShippingAddress( self,shippingAddress:ShippingAddress)->ShippingAddressVm:
        coutryId:int = shippingAddress.country_id
        provinceId:int = shippingAddress.province_id
        dictrictId:int = shippingAddress.district_id

        return ShippingAddressVm(
            contactName=shippingAddress.customer_name,
            countryName=shippingAddress.country.name,
            districtName=shippingAddress.district.name,
            id=shippingAddress.id,
            phoneNumber=shippingAddress.phone_number,
            provinceName=shippingAddress.province.name,
            specificAddress= shippingAddress.specific_address
        )
    

    def checkUserHasBoughtProductCompleted(
        self,
        productId: int,
        customerId: str
    ) -> CheckUserHasBoughtProductCompletedVm:

        has_purchased = (
            self.db.query(
                exists().where(
                    and_(
                        Order.customer_id == customerId,
                        Order.order_status == OrderStatus.COMPLETED,
                        OrderItem.order_id == Order.id,
                        OrderItem.product_id == productId
                    )
                )
            )
            .scalar()
        )

        return CheckUserHasBoughtProductCompletedVm(hasPurchased=has_purchased)


    def getLatestOrders(self,count:int)->List[OrderBriefVm]:
        if count <= 0:
            return []

        orders = (
            self.db.query(Order)
            .order_by(Order.created_at.desc())
            .limit(count)
            .all()
        )

        if not orders:
            return []

        return [OrderBriefVm.from_model(o) for o in orders]
    


    def getOrders(self, productName: str) -> List[OrderBriefVm]:
        query = (
            self.db.query(Order)
            .join(OrderItem, OrderItem.order_id == Order.id)
            .join(Product, Product.id == OrderItem.product_id)
        )

        if productName:
            query = query.filter(Product.name.ilike(f"%{productName}%"))

        orders = (
            query
            .order_by(desc(Order.created_at))
            .distinct()
            .all()
        )

        return [OrderBriefVm.from_model(o) for o in orders]



def orderService(db:Session = Depends(get_db))->OrderService:
    image_service:ImageService = imageService(db)
    return OrderService(db,image_service)

from models.image import Image
from sqlalchemy.orm import Session
from typing import Optional, IO,List,Dict
from pathlib import Path
from models.product import Product
from schemas.product_schema import ProductPreviewPagingVm, ProductPreviewVm
from service.imageService import ImageService
from schemas.cart_schema import CartItemDetailVm
from models.cartItem import CartItem
from sqlalchemy import desc
from service.productService import ProductService,productService


class CartService:
    def __init__(self, db: Session,product_service:ProductService):
        self.db = db
        self.product_service = product_service
    
    def getCartItems(self,customer_id:int)->List[CartItemDetailVm]:
        cart_items : List[CartItem] = self.db.query(CartItem).filter(CartItem.customer_id == customer_id).order_by(desc(CartItem.created_at)).all()
       
        product_ids = [item.product_id for item in cart_items]
        
        products : List[ProductPreviewVm] = self.product_service.getProductsByIds(product_ids)

        map_cart_item_by_product_id: Dict[int, CartItem] = {
            item.product_id: item for item in cart_items
        }
        map_product_preview_by_product_id: Dict[int, ProductPreviewVm] = {
            p.id: p for p in products
        }


        result: List[CartItemDetailVm] = []
        for product_id,cart_item in map_cart_item_by_product_id.items():
            product = map_product_preview_by_product_id.get(product_id)
            if not product:
                continue

            result.append(
                CartItemDetailVm(
                    product_id=product_id,
                    quantity=cart_item.quantity,
                    product_name=product.name,
                    slug=product.slug,
                    avatarUrl=product.avatarUrl,
                    price=product.price,
                
                )
            )
        
        
        return result


        
        






    
def cartService(db: Session):
    product_service = productService(db)
    return CartService(db,product_service)

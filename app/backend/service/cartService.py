from models.image import Image
from sqlalchemy.orm import Session
from typing import Optional, IO,List,Dict
from pathlib import Path
from models.product import Product
from schemas.product_schema import ProductPreviewPagingVm, ProductPreviewVm
from service.imageService import ImageService
from schemas.cart_schema import CartItemDetailVm,CartItemGetVm
from models.cartItem import CartItem
from sqlalchemy import desc
from service.productService import ProductService,productService
from schemas.cart_schema import CartItemPostVm


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

    def addCartItem(self,cart_item_post_vm:CartItemPostVm, customer_id: str)->CartItemGetVm:
        existing_item: Optional[CartItem] = (
            self.db.query(CartItem)
            .filter(CartItem.customer_id == customer_id)
            .filter(CartItem.product_id == cart_item_post_vm.productId)
            .first()
        )
        if existing_item:   
            existing_item.quantity += cart_item_post_vm.quantity
            self.db.add(existing_item)
            self.db.commit()
            self.db.refresh(existing_item)
            return CartItemGetVm(customer_id= customer_id,product_id=cart_item_post_vm.productId,quantity=existing_item.quantity)
        else:
       
            new_item = CartItem(
                customer_id=customer_id,
                product_id=cart_item_post_vm.productId,
                quantity=cart_item_post_vm.quantity
            )
            self.db.add(new_item)
            self.db.commit()
            self.db.refresh(new_item)
            return CartItemGetVm(customer_id= customer_id,product_id=cart_item_post_vm.productId,quantity=new_item.quantity)



        
        






    
def cartService(db: Session):
    product_service = productService(db)
    return CartService(db,product_service)

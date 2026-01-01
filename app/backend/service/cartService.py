from models.image import Image
from sqlalchemy.orm import Session
from fastapi import FastAPI, HTTPException, Depends, Path
from typing import Optional, IO,List,Dict
from pathlib import Path
from models.product import Product
from schemas.product_schema import ProductPreviewPagingVm, ProductPreviewVm
from service.imageService import ImageService
from schemas.cart_schema import CartItemDetailVm,CartItemGetVm,CartItemPostVm,CartItemPutVm
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
                    productId=product_id,
                    quantity=cart_item.quantity,
                    productName=product.name,
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
            return CartItemGetVm(customerId= customer_id,productId=cart_item_post_vm.productId,quantity=existing_item.quantity)
        else:
       
            new_item = CartItem(
                customer_id=customer_id,
                product_id=cart_item_post_vm.productId,
                quantity=cart_item_post_vm.quantity
            )
            self.db.add(new_item)
            self.db.commit()
            self.db.refresh(new_item)
            return CartItemGetVm(customerId= customer_id,productId=cart_item_post_vm.productId,quantity=new_item.quantity)



    def updateCartItem(self,cartItemPutVm: CartItemPutVm , customerId:int,productId:int):
        cart_item_in_db : Optional[CartItem] = (
            self.db.query(CartItem)
            .filter(CartItem.customer_id == customerId ,CartItem.product_id ==productId)
            .first()
        )
        if not cart_item_in_db:
            raise HTTPException(status_code=404, detail="CartItem not found")
        
        cart_item_in_db.quantity = cartItemPutVm.quantity
        self.db.add(cart_item_in_db)
        self.db.commit()
        self.db.refresh(cart_item_in_db)

        return CartItemGetVm(
            customerId=customerId,
            productId=productId,
            quantity=cart_item_in_db.quantity
        )
    def deleteCartItem(self,productId :int , customerId : int)->None:
        cart_item_in_db : Optional[CartItem] = (
            self.db.query(CartItem)
            .filter(CartItem.customer_id == customerId ,CartItem.product_id ==productId)
            .first()
        )
        if not cart_item_in_db:
            raise HTTPException(status_code=404, detail="CartItem not found")
        self.db.delete(cart_item_in_db)
        self.db.commit()








    
def cartService(db: Session):
    product_service = productService(db)
    return CartService(db,product_service)

from models.image import Image
from sqlalchemy.orm import Session
from fastapi import FastAPI, HTTPException, Depends, Path,status
from typing import Optional, IO,List,Dict
from pathlib import Path
from models.product import Product
from schemas.product_schema import ProductPreviewPagingVm, ProductPreviewVm
from service.imageService import ImageService
from schemas.cart_schema import CartItemDetailVm,CartItemGetVm,CartItemPostVm,CartItemPutVm
from sqlalchemy import desc
from service.productService import ProductService,productService
from schemas.checkout_schema import CheckoutPostVm,CheckoutItemPostVm
from models.checkout import Checkout
from models.checkoutItem import CheckoutItem
from schemas.product_schema import  ProductPreviewVm
from schemas.checkout_schema import CheckoutVm


class CheckoutService:
    def __init__(self, db: Session,product_service:ProductService):
        self.db = db
        self.product_service = product_service
    
    def createCheckout( self,customerId :int,checkoutPostVm:CheckoutPostVm)->CheckoutVm:
        checkout:Checkout = checkoutPostVm.to_model()
        checkout.customer_id = customerId
        checkoutItems : List[CheckoutItem] = self.build_checkout_items(
            checkoutPostVm,
            checkout

        )
        checkout.checkout_items = checkoutItems
        totalPrice =  sum(item.price for item in checkoutItems)
        checkout.total_price = totalPrice
        self.db.add(checkout)
        self.db.commit()
        self.db.refresh(checkout)
        return CheckoutVm.from_model(checkout=checkout)

    def build_checkout_items(
            self,
        checkout_post_vm: CheckoutPostVm, 
        checkout: Checkout, 
    ) -> List[CheckoutItem]:
        checkout_item_post_vms :List[CheckoutItemPostVm] = checkout_post_vm.checkoutItemPostVms
        product_ids_checkout_items :List[int] = [item.productId for item in checkout_item_post_vms]
        product_checkout_preview_vms : List[ProductPreviewVm] = self.product_service.getProductsByIds(product_ids_checkout_items)
        if not product_checkout_preview_vms:
            return
        product_checkout_preview_vm_map = {
            product.id: product for product in product_checkout_preview_vms
        }

        checkout_items : List[CheckoutItem] = []
        for checkout_item_post_vm in checkout_item_post_vms:
            product_info: ProductPreviewVm = product_checkout_preview_vm_map.get(checkout_item_post_vm.productId)
            if product_info is None:
                return
            
            checkout_item = checkout_item_post_vm.to_model(checkout=checkout,product_preview_vm= product_info)
            checkout_items.append(checkout_item)
            
        return checkout_items
    

    def getCheckoutById(self,customerId:int,id:int)->CheckoutVm:
        checkout :Checkout= self.db.query(Checkout).filter(Checkout.id == id).first()
        if not checkout:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CHECKOUT_NOT_FOUND"
            )
        if checkout.customer_id != customerId:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="ACCESS_DENIED"
            )
        return CheckoutVm.from_model(checkout)




    
def checkoutService(db: Session):
    product_service = productService(db)
    return CheckoutService(db,product_service)

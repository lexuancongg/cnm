from fastapi import APIRouter
from routers.auth_router import *
from routers.address_router import router as address_router
from routers.auth_router import router as auth_router
from routers.cart_router import router as cart_router
from routers.category_router import router as category_router
from routers.checkout_router import router as checkout_router
from routers.country_router import router as country_router 
from routers.customer_router import router as customer_router
from routers.district_router import router as dictrict_router
from routers.image_router import router as image_router
from routers.order_router import router as order_router
from routers.payment_router import router as payment_router
from routers.product_router import router as product_router
from routers.province_router import router as province_router
from routers.user_address_router import router as user_address_router
from routers.feedback_router import router as feedback_router
from routers.author_router import router as author_router


def configRouter(app):
    app.include_router(address_router)
    app.include_router(auth_router)
    app.include_router(cart_router)
    app.include_router(category_router)
    app.include_router(checkout_router)
    app.include_router(country_router)
    app.include_router(customer_router)
    app.include_router(dictrict_router)
    app.include_router(image_router)
    app.include_router(order_router)
    app.include_router(payment_router)
    app.include_router(product_router)
    app.include_router(province_router)
    app.include_router(user_address_router)
    app.include_router(feedback_router)
    app.include_router(author_router)














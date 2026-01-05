from schemas.customer_schema import *
import requests
from fastapi import Request,HTTPException

KEYCLOAK_BASE = "http://localhost:8080"
REALM = "ecommerce"

class CustomerService:
    def __init__(self):
        pass



    def updateCustomer(self, user_id: str, access_token: str, customerPutVm: CustomerProfilePutVm):
        url = f"http://localhost:8080/realms/ecommerce/account"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        payload = customerPutVm.model_dump(exclude_none=True)
        res = requests.post(url, json=payload, headers=headers)

        if res.status_code in (200, 204):
            return {"message": "Cập nhật hồ sơ thành công"} 
        else:
            raise Exception(f"Không thể cập nhật hồ sơ: {res.status_code} - {res.text}")


    def get_customer_profile(self,request:Request)->CustomerVm:
        user = request.session.get("user")

        if not user:
            raise HTTPException(status_code=401, detail="Unauthenticated")

        return CustomerVm.from_keycloak_user(user)


def customerService()->CustomerService:
    return CustomerService()
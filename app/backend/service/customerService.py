from schemas.customer_schema import *
from config.security import CLIENT_ID
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



    def getCustomers(self,pageNo:int):
        url = "http://localhost:8080/realms/master/protocol/openid-connect/token"
        data = {
            "client_id":"admin-cli",
            "grant_type": "password",
            "username": "lexuancong",
            "password": "lexuancong"
        }

        res = requests.post(url, data=data)
        res.raise_for_status()
        access_token = res.json()["access_token"]
        USER_PER_PAGE = 20
        url = "http://localhost:8080/admin/realms/ecommerce/users"
        params = {
                "first": pageNo * USER_PER_PAGE,
                "max": USER_PER_PAGE
            }
        headers = {
            "Authorization": f"Bearer {access_token}"
        }

        res = requests.get(url, headers=headers, params=params)
        res.raise_for_status()

        users = res.json()

        result = [
            CustomerVm.from_admin_user(u)
            for u in users
            if u.get("enabled")
        ]

        total_user = len(result)
        total_page = (total_user + USER_PER_PAGE - 1) // USER_PER_PAGE

        return CustomerPagingVm(
            customers=result,
            totalPage=total_page,
            totalUser=total_user
        )



def customerService()->CustomerService:
    return CustomerService()
from schemas.customer_schema import *
from config.security import CLIENT_ID
import requests
from helper.getAdmintoken import getAdminToken
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
        userId = user['sub']




        if not user:
            raise HTTPException(status_code=401, detail="Unauthenticated")

        return CustomerVm.from_keycloak_user(user)



    def getCustomers(self,pageNo:int):

        access_token = getAdminToken()
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
    

    def  createCustomer(self, customerPostVm: CustomerCreateVm):
        token = getAdminToken()

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        create_user_url = f"{KEYCLOAK_BASE}/admin/realms/{REALM}/users"
        payload = {
            "username": customerPostVm.username,
            "email": customerPostVm.email,
            "firstName": customerPostVm.firstName,
            "lastName": customerPostVm.lastName,
            "enabled": True
        }

        res = requests.post(create_user_url, json=payload, headers=headers)
        if res.status_code != 201:
            raise HTTPException(400, res.text)

        res = requests.get(
            create_user_url,
            headers=headers,
            params={"username": customerPostVm.username}
        )
        users = res.json()
        if not users:
            raise HTTPException(404, "Không tìm thấy user vừa tạo")

        user_id = users[0]["id"]

        pwd_url = f"{create_user_url}/{user_id}/reset-password"
        pwd_payload = {
            "type": "password",
            "value": customerPostVm.password,
            "temporary": False
        }
        requests.put(pwd_url, json=pwd_payload, headers=headers)

        role_url = f"{KEYCLOAK_BASE}/admin/realms/{REALM}/roles/{customerPostVm.role}"
        role_res = requests.get(role_url, headers=headers)

        if role_res.status_code != 200:
            raise HTTPException(400, "Role không tồn tại")

        assign_role_url = f"{create_user_url}/{user_id}/role-mappings/realm"
        requests.post(assign_role_url, json=[role_res.json()], headers=headers)





    def getCustomerById(self, user_id: str) -> CustomerVm:
        admin_token = getAdminToken()

        url = f"{KEYCLOAK_BASE}/admin/realms/{REALM}/users/{user_id}"
        headers = {
            "Authorization": f"Bearer {admin_token}",
            "Accept": "application/json"
        }

        res = requests.get(url, headers=headers)
        if res.status_code == 404:
            raise HTTPException(404, "User không tồn tại")
        if res.status_code != 200:
            raise HTTPException(res.status_code, res.text)

        user = res.json()

        if not user.get("enabled"):
            raise HTTPException(404, "User đã bị disable")

        return CustomerVm.from_admin_user(user)


    def updateCustomerById(self, id: str, customerPutVm: CustomerUpdateVm):
        admin_token = getAdminToken()

        url = f"{KEYCLOAK_BASE}/admin/realms/{REALM}/users/{id}"
        headers = {
            "Authorization": f"Bearer {admin_token}",
            "Content-Type": "application/json"
        }

        payload = {
            "email": customerPutVm.email,
            "firstName": customerPutVm.firstName,
            "lastName": customerPutVm.lastName
        }

        res = requests.put(url, json=payload, headers=headers)

        if res.status_code == 404:
            raise HTTPException(404, "User không tồn tại")

        if res.status_code not in (200, 204):
            raise HTTPException(res.status_code, res.text)

    def deleteCustomerById(self, id: str):
        admin_token = getAdminToken()

        url = f"{KEYCLOAK_BASE}/admin/realms/{REALM}/users/{id}"
        headers = {
            "Authorization": f"Bearer {admin_token}"
        }

        res = requests.delete(url, headers=headers)

        if res.status_code == 404:
            raise HTTPException(404, "User không tồn tại")

        if res.status_code != 204:
            raise HTTPException(res.status_code, res.text)



def customerService()->CustomerService:
    return CustomerService()
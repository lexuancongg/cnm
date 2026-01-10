import requests
def getAdminToken():
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
    return access_token
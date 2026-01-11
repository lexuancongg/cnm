from jose import jwt,JWTError
from config.security import oauth
from jose.exceptions import ExpiredSignatureError, JWTClaimsError
from authlib.integrations.base_client.errors import OAuthError
from fastapi import HTTPException ,Request
import httpx

KEYCLOAK_TOKEN_URL = "http://localhost:8080/realms/ecommerce/protocol/openid-connect/token"
CLIENT_ID = "xuancong-ecommerce"
CLIENT_SECRET = "y3BkvJfZ8BpR4jdWsHuBu5XIjOLpRAB7"




KEYCLOAK_PUBLIC_KEY = """
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAn7Tt3upruskvZIBDAcpKg+aV
5ZyQAd5dpM33fFWjcrgZCfv/4Kt5lJQ6+0ZmOOzb49OwKFvf7Y53seLKq3V/GRqwSjFGi
FJ0vxPIca9hKbfn/lyBvHV9ToVX+XC6TOFZ6Tbg+XvUL81wZ/58vVoKPGstSDtAInIN0J
NNjdYerqRyZTEPUF1PenScfva7VZvqMHTLmqJoX6Z3C+rj1/AWy/rFKw0PuV6jsDadAL
Bz0G8VYZqqg8+L0CbgBAyMdvj1wrClz54aSqjxwqc5MHI2dMOye1ZF8a6Pj1y9aCRzDV
G2N6ny9YpqFCj+3N75gyI5zhivrEUU+zfYnY9UorET4QIDAQAB
-----END PUBLIC KEY-----
"""

ISSUER = "http://localhost:8080/realms/ecommerce"
AUDIENCE = "xuancong-ecommerce"


async def auth_mid(request: Request):
    token = request.session.get("access_token")

    if not token:
        raise HTTPException(401, "Unauthenticated")

    try:
        return verify_token(token)
    except HTTPException:
        refresh_token = request.session.get("refresh_token")

        if not refresh_token:
            request.session.pop("access_token", None)
            request.session.pop("refresh_token", None)

            raise HTTPException(401, "Session expired")

        try:
            new_token = await refresh_access_token(refresh_token)
            request.session["access_token"] = new_token["access_token"]
            request.session["refresh_token"] = new_token["refresh_token"]

            return verify_token(new_token["access_token"])
        except HTTPException:
            request.session.pop("access_token", None)
            request.session.pop("refresh_token", None)
            raise HTTPException(401, "Re-login required")
        



def verify_token(token: str) -> dict:
    try:
        return jwt.decode(
            token,
            KEYCLOAK_PUBLIC_KEY,
            algorithms=["RS256"],
            issuer=ISSUER,
            options={"verify_aud": False}
        )
    except ExpiredSignatureError as e:
        print("token hết hạn:", e)
        raise HTTPException(401, "Token expired")

    except JWTClaimsError as e:
        print("claim sai", e)
        raise HTTPException(401, "Invalid token claims")

    except JWTError as e:
        print("JWT fail:", repr(e))
        raise HTTPException(401, "Invalid token")



async def refresh_access_token(refresh_token: str) -> dict:
    async with httpx.AsyncClient() as client:
        res = await client.post(
            KEYCLOAK_TOKEN_URL,
            data={
                "grant_type": "refresh_token",
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "refresh_token": refresh_token,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

    if res.status_code != 200:
        raise HTTPException(401, "Refresh token expired")

    return res.json()

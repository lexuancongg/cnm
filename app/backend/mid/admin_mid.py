from fastapi import Request, HTTPException, status
from jose import jwt, JWTError

def checkRoleAdmin(request: Request):
    token = request.session.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing access token"
        )

    try:
        payload = jwt.decode(
            token,
            key="",  
            options={
                "verify_signature": False,
                "verify_aud": False
            }
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    roles = payload.get("realm_access", {}).get("roles", [])

    if "Admin" not in roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin only"
        )

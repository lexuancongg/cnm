from fastapi import *
def extractCustomerId(request:Request)->str:
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    customer_id = user["sub"]  
    return customer_id;
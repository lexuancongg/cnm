from fastapi import *
from fastapi.responses import RedirectResponse


from schemas.authentication_schema import *
from config.security import oauth,REDIRECT_URI,FRONTEND_URL


router = APIRouter()



@router.get("/login")
async def login(request: Request):
    return await oauth.keycloak.authorize_redirect(request, REDIRECT_URI)

@router.get("/auth")
async def auth(request: Request):
    token = await oauth.keycloak.authorize_access_token(request)
    access_token = token["access_token"]
    refresh_token = token["refresh_token"]
    user = token["userinfo"]
    id_token = token["id_token"]

    request.session["user"] = {
        "sub": user["sub"],
        "username": user["preferred_username"],
        "email": user["email"],
        "name": user["name"],
        "firstname": user["given_name"],
        "lastname":user["family_name"]
    }
    request.session["access_token"] = token["access_token"]
    request.session["refresh_token"] = token["refresh_token"]


    
   
    return RedirectResponse(FRONTEND_URL)


@router.get("/authentication", response_model=AuthenticationInfoVm)
async def authentication(request: Request):
    user = request.session.get("user")
    
    if not user:
        return AuthenticationInfoVm(isAuthenticated=False, authenticatedUser=None)
    
    authenticated_user = AuthenticatedUserVm(username=user["username"])
    return AuthenticationInfoVm(isAuthenticated=True, authenticatedUser=authenticated_user)


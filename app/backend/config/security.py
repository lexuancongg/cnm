
from authlib.integrations.starlette_client import OAuth

KEYCLOAK_SERVER = "http://localhost:8080/realms/ecommerce"
CLIENT_ID = "xuancong-ecommerce"
CLIENT_SECRET = "y3BkvJfZ8BpR4jdWsHuBu5XIjOLpRAB7"
REDIRECT_URI = "http://localhost:8000/auth"
FRONTEND_URL = "http://localhost:3000"



oauth = OAuth()
oauth.register(
    name="keycloak",
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    server_metadata_url=f"{KEYCLOAK_SERVER}/.well-known/openid-configuration",
    client_kwargs={"scope": "openid roles"},
)
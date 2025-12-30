from fastapi_auth_keycloak import AuthJWTKeycloak

auth = AuthJWTKeycloak(
    server_url="http://localhost:8080/auth/", 
    client_id="xuancong-ecommerce",
    client_secret="B9JECyEI7BKAKGeG7fOLssGKYXXPLxXr",
    realm="ecommerce",
)
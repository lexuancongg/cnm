from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware

def configCors(app):
    app.add_middleware(
        SessionMiddleware,
        secret_key="!secret",
        same_site="lax",  
        https_only=False  
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://localhost:3001"
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

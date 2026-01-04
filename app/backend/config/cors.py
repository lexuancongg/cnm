from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware


def configCors(app):
    app.add_middleware(SessionMiddleware, secret_key="!secret")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

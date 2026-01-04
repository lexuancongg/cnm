from fastapi import *

from config.cors import configCors
from routers.index import configRouter

app = FastAPI()
configCors(app)
configRouter(app)
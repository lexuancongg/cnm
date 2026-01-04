from fastapi import *
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from db.session import get_db

from service.imageService import *
router = APIRouter()
@router.get("/images/{id}/file/{file_name}")
def get_file(id: int, file_name: str, db: Session = Depends(get_db)):
    service = imageService(db)
    result = service.get_file(id, file_name)
    if not result:
        raise HTTPException(status_code=404, detail="File not found")
    
    stream, media_type = result
    return StreamingResponse(
        stream,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{file_name}"'}
    )
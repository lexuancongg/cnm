
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from db.session import get_db
from schemas.image_schema import *
from service.imageService import *
from fastapi import *

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



#admin



@router.post("/api/image/images",response_model=NoFileMediaVm)
def createImage(
    caption: str | None = Form(None),
    multipartFile: UploadFile = File(...),
    fileNameOverride: str | None = Form(None),
    db:Session = Depends(get_db)
):
    service = imageService(db)
    image:Image=  service.save_media(caption=caption,file=multipartFile,file_name_override=fileNameOverride)
    return NoFileMediaVm(
        caption=image.description,
        fileName=image.file_name,
        id=image.id,
        mediaType=image.image_type
    )
    
    
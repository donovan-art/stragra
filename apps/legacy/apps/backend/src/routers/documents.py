from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query, Depends
from fastapi.responses import StreamingResponse, JSONResponse
from typing import Optional, List
import uuid
import os
from datetime import datetime, timedelta
import mimetypes

router = APIRouter()

# In-memory storage for demo (replace with database in production)
documents_db = {}

# Mock tenant context
def get_current_tenant(tenant_id: str = Query(...)):
    return tenant_id

@router.get("")
async def list_documents(
    parentId: Optional[str] = None,
    tenantId: str = Depends(get_current_tenant)
):
    """List documents in a folder"""
    docs = [
        doc for doc in documents_db.values()
        if doc["tenantId"] == tenantId 
        and doc.get("parentId") == parentId
        and doc.get("deletedAt") is None
    ]
    return docs

@router.post("/folder")
async def create_folder(
    name: str = Form(...),
    parentId: Optional[str] = Form(None),
    tenantId: str = Form(...)
):
    """Create a new folder"""
    doc_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    
    # Check for duplicates
    for doc in documents_db.values():
        if (doc["tenantId"] == tenantId and 
            doc.get("parentId") == parentId and 
            doc["name"] == name and
            doc.get("deletedAt") is None):
            raise HTTPException(status_code=400, detail="Folder already exists")
    
    document = {
        "id": doc_id,
        "tenantId": tenantId,
        "parentId": parentId,
        "name": name,
        "type": "folder",
        "mimeType": None,
        "sizeBytes": None,
        "storagePath": None,
        "isShared": False,
        "sharedLinkToken": None,
        "sharedLinkExpiresAt": None,
        "createdBy": None,
        "createdAt": now,
        "updatedAt": now,
        "deletedAt": None
    }
    documents_db[doc_id] = document
    return document

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    parentId: Optional[str] = Form(None),
    tenantId: str = Form(...)
):
    """Upload a file"""
    doc_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    
    # Get file size
    content = await file.read()
    size_bytes = len(content)
    await file.seek(0)
    
    # Detect mime type
    mime_type = file.content_type or mimetypes.guess_type(file.filename)[0] or "application/octet-stream"
    
    # Check for duplicates
    for doc in documents_db.values():
        if (doc["tenantId"] == tenantId and 
            doc.get("parentId") == parentId and 
            doc["name"] == file.filename and
            doc.get("deletedAt") is None):
            raise HTTPException(status_code=400, detail="File already exists")
    
    document = {
        "id": doc_id,
        "tenantId": tenantId,
        "parentId": parentId,
        "name": file.filename,
        "type": "file",
        "mimeType": mime_type,
        "sizeBytes": size_bytes,
        "storagePath": f"{tenantId}/{doc_id}",
        "isShared": False,
        "sharedLinkToken": None,
        "sharedLinkExpiresAt": None,
        "createdBy": None,
        "createdAt": now,
        "updatedAt": now,
        "deletedAt": None,
        "content": content  # Store content in memory for demo
    }
    documents_db[doc_id] = document
    
    # Return without content
    response_doc = {k: v for k, v in document.items() if k != "content"}
    return response_doc

@router.get("/{document_id}/download")
async def download_file(
    document_id: str,
    tenantId: str = Query(...)
):
    """Download a file"""
    doc = documents_db.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc["tenantId"] != tenantId:
        raise HTTPException(status_code=403, detail="Access denied")
    if doc["type"] != "file":
        raise HTTPException(status_code=400, detail="Not a file")
    
    content = doc.get("content", b"")
    
    return StreamingResponse(
        iter([content]),
        media_type=doc["mimeType"] or "application/octet-stream",
        headers={"Content-Disposition": f'attachment; filename="{doc["name"]}"'}
    )

@router.get("/{document_id}/preview")
async def preview_file(
    document_id: str,
    tenantId: str = Query(...)
):
    """Get file preview URL"""
    doc = documents_db.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc["tenantId"] != tenantId:
        raise HTTPException(status_code=403, detail="Access denied")
    if doc["type"] != "file":
        raise HTTPException(status_code=400, detail="Not a file")
    
    # Return inline content for preview
    content = doc.get("content", b"")
    
    return StreamingResponse(
        iter([content]),
        media_type=doc["mimeType"] or "application/octet-stream",
        headers={"Content-Disposition": f'inline; filename="{doc["name"]}"'}
    )

@router.patch("/{document_id}")
async def rename_document(
    document_id: str,
    name: str = Form(...),
    tenantId: str = Form(...)
):
    """Rename a document"""
    doc = documents_db.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc["tenantId"] != tenantId:
        raise HTTPException(status_code=403, detail="Access denied")
    
    doc["name"] = name
    doc["updatedAt"] = datetime.utcnow().isoformat()
    return {k: v for k, v in doc.items() if k != "content"}

@router.patch("/{document_id}/move")
async def move_document(
    document_id: str,
    parentId: Optional[str] = Form(None),
    tenantId: str = Form(...)
):
    """Move a document to a different folder"""
    doc = documents_db.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc["tenantId"] != tenantId:
        raise HTTPException(status_code=403, detail="Access denied")
    
    doc["parentId"] = parentId
    doc["updatedAt"] = datetime.utcnow().isoformat()
    return {k: v for k, v in doc.items() if k != "content"}

@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    tenantId: str = Query(...),
    permanent: bool = Query(False)
):
    """Soft delete or permanently delete a document"""
    doc = documents_db.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc["tenantId"] != tenantId:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if permanent:
        del documents_db[document_id]
    else:
        doc["deletedAt"] = datetime.utcnow().isoformat()
        doc["updatedAt"] = datetime.utcnow().isoformat()
    
    return {"success": True}

@router.post("/{document_id}/restore")
async def restore_document(
    document_id: str,
    tenantId: str = Form(...)
):
    """Restore a soft-deleted document"""
    doc = documents_db.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc["tenantId"] != tenantId:
        raise HTTPException(status_code=403, detail="Access denied")
    
    doc["deletedAt"] = None
    doc["updatedAt"] = datetime.utcnow().isoformat()
    return {k: v for k, v in doc.items() if k != "content"}

@router.post("/{document_id}/share")
async def share_document(
    document_id: str,
    tenantId: str = Form(...),
    expiresInHours: Optional[int] = Form(None)
):
    """Create a shareable link for a document"""
    doc = documents_db.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc["tenantId"] != tenantId:
        raise HTTPException(status_code=403, detail="Access denied")
    
    token = str(uuid.uuid4())
    doc["sharedLinkToken"] = token
    
    if expiresInHours:
        doc["sharedLinkExpiresAt"] = (datetime.utcnow() + timedelta(hours=expiresInHours)).isoformat()
    else:
        doc["sharedLinkExpiresAt"] = None
    
    doc["isShared"] = True
    doc["updatedAt"] = datetime.utcnow().isoformat()
    
    return {
        "token": token,
        "url": f"/api/share/{token}"
    }

@router.get("/{document_id}/breadcrumbs")
async def get_breadcrumbs(
    document_id: str,
    tenantId: str = Query(...)
):
    """Get breadcrumb path for a folder"""
    doc = documents_db.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc["tenantId"] != tenantId:
        raise HTTPException(status_code=403, detail="Access denied")
    
    breadcrumbs = [{"id": doc["id"], "name": doc["name"]}]
    
    current_id = doc.get("parentId")
    while current_id:
        parent = documents_db.get(current_id)
        if not parent:
            break
        breadcrumbs.insert(0, {"id": parent["id"], "name": parent["name"]})
        current_id = parent.get("parentId")
    
    breadcrumbs.insert(0, {"id": None, "name": "Home"})
    return breadcrumbs

@router.get("/share/{token}")
async def access_shared_document(token: str):
    """Access a shared document by token"""
    for doc in documents_db.values():
        if doc.get("sharedLinkToken") == token:
            # Check if expired
            expires_at = doc.get("sharedLinkExpiresAt")
            if expires_at:
                if datetime.utcnow() > datetime.fromisoformat(expires_at):
                    raise HTTPException(status_code=410, detail="Share link has expired")
            
            if doc["type"] == "file":
                content = doc.get("content", b"")
                return StreamingResponse(
                    iter([content]),
                    media_type=doc["mimeType"] or "application/octet-stream",
                    headers={"Content-Disposition": f'inline; filename="{doc["name"]}"'}
                )
            else:
                return {"id": doc["id"], "name": doc["name"], "type": "folder"}
    
    raise HTTPException(status_code=404, detail="Share link not found")

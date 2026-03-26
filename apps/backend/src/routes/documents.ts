import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const router: express.Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// In-memory storage for demo (replace with database in production)
const documentsDb: Map<string, any> = new Map();

// Helper to get tenant from query
const getTenantId = (req: express.Request): string => {
  return (req.query.tenantId as string) || 'default-tenant';
};

// List documents
router.get('/', (req: express.Request, res: express.Response) => {
  const tenantId = getTenantId(req);
  const parentId = req.query.parentId as string | null;
  
  const docs = Array.from(documentsDb.values()).filter(
    (doc) => doc.tenantId === tenantId && doc.parentId === parentId && !doc.deletedAt
  );
  
  res.json(docs);
});

// Create folder
router.post('/folder', (req: express.Request, res: express.Response) => {
  const { name, parentId, tenantId } = req.body;
  const now = new Date().toISOString();
  
  const docId = uuidv4();
  const document = {
    id: docId,
    tenantId,
    parentId: parentId || null,
    name,
    type: 'folder',
    mimeType: null,
    sizeBytes: null,
    storagePath: null,
    isShared: false,
    sharedLinkToken: null,
    sharedLinkExpiresAt: null,
    createdBy: null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };
  
  documentsDb.set(docId, document);
  res.json(document);
});

// Upload file
router.post('/upload', upload.single('file'), (req: express.Request, res: express.Response) => {
  const { parentId, tenantId } = req.body;
  const file = req.file;
  
  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }
  
  const now = new Date().toISOString();
  const docId = uuidv4();
  
  const document = {
    id: docId,
    tenantId,
    parentId: parentId || null,
    name: file.originalname,
    type: 'file',
    mimeType: file.mimetype,
    sizeBytes: file.size,
    storagePath: `${tenantId}/${docId}`,
    isShared: false,
    sharedLinkToken: null,
    sharedLinkExpiresAt: null,
    createdBy: null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    content: file.buffer,
  };
  
  documentsDb.set(docId, document);
  
  const { content, ...responseDoc } = document;
  res.json(responseDoc);
});

// Download file
router.get('/:documentId/download', (req: express.Request, res: express.Response) => {
  const { documentId } = req.params;
  const tenantId = getTenantId(req);
  
  const doc = documentsDb.get(documentId);
  if (!doc || doc.tenantId !== tenantId) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  if (doc.type !== 'file') {
    return res.status(400).json({ error: 'Not a file' });
  }
  
  res.setHeader('Content-Disposition', `attachment; filename="${doc.name}"`);
  res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
  res.send(doc.content);
});

// Preview file
router.get('/:documentId/preview', (req: express.Request, res: express.Response) => {
  const { documentId } = req.params;
  const tenantId = getTenantId(req);
  
  const doc = documentsDb.get(documentId);
  if (!doc || doc.tenantId !== tenantId) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  if (doc.type !== 'file') {
    return res.status(400).json({ error: 'Not a file' });
  }
  
  res.setHeader('Content-Disposition', `inline; filename="${doc.name}"`);
  res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
  res.send(doc.content);
});

// Rename document
router.patch('/:documentId', (req: express.Request, res: express.Response) => {
  const { documentId } = req.params;
  const { name, tenantId } = req.body;
  
  const doc = documentsDb.get(documentId);
  if (!doc || doc.tenantId !== tenantId) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  doc.name = name;
  doc.updatedAt = new Date().toISOString();
  
  const { content, ...responseDoc } = doc;
  res.json(responseDoc);
});

// Move document
router.patch('/:documentId/move', (req: express.Request, res: express.Response) => {
  const { documentId } = req.params;
  const { parentId, tenantId } = req.body;
  
  const doc = documentsDb.get(documentId);
  if (!doc || doc.tenantId !== tenantId) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  doc.parentId = parentId || null;
  doc.updatedAt = new Date().toISOString();
  
  const { content, ...responseDoc } = doc;
  res.json(responseDoc);
});

// Delete document
router.delete('/:documentId', (req: express.Request, res: express.Response) => {
  const { documentId } = req.params;
  const tenantId = getTenantId(req);
  const permanent = req.query.permanent === 'true';
  
  const doc = documentsDb.get(documentId);
  if (!doc || doc.tenantId !== tenantId) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  if (permanent) {
    documentsDb.delete(documentId);
  } else {
    doc.deletedAt = new Date().toISOString();
    doc.updatedAt = new Date().toISOString();
  }
  
  res.json({ success: true });
});

// Restore document
router.post('/:documentId/restore', (req: express.Request, res: express.Response) => {
  const { documentId } = req.params;
  const { tenantId } = req.body;
  
  const doc = documentsDb.get(documentId);
  if (!doc || doc.tenantId !== tenantId) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  doc.deletedAt = null;
  doc.updatedAt = new Date().toISOString();
  
  const { content, ...responseDoc } = doc;
  res.json(responseDoc);
});

// Share document
router.post('/:documentId/share', (req: express.Request, res: express.Response) => {
  const { documentId } = req.params;
  const { tenantId, expiresInHours } = req.body;
  
  const doc = documentsDb.get(documentId);
  if (!doc || doc.tenantId !== tenantId) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  const token = uuidv4();
  doc.sharedLinkToken = token;
  
  if (expiresInHours) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + parseInt(expiresInHours));
    doc.sharedLinkExpiresAt = expiresAt.toISOString();
  } else {
    doc.sharedLinkExpiresAt = null;
  }
  
  doc.isShared = true;
  doc.updatedAt = new Date().toISOString();
  
  res.json({
    token,
    url: `/api/share/${token}`,
  });
});

// Get breadcrumbs
router.get('/:documentId/breadcrumbs', (req: express.Request, res: express.Response) => {
  const { documentId } = req.params;
  const tenantId = getTenantId(req);
  
  const doc = documentsDb.get(documentId);
  if (!doc || doc.tenantId !== tenantId) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  const breadcrumbs: Array<{ id: string | null; name: string }> = [{ id: doc.id, name: doc.name }];
  
  let currentId = doc.parentId;
  while (currentId) {
    const parent = documentsDb.get(currentId);
    if (!parent) break;
    breadcrumbs.unshift({ id: parent.id, name: parent.name });
    currentId = parent.parentId;
  }
  
  breadcrumbs.unshift({ id: null, name: 'Home' });
  res.json(breadcrumbs);
});

// Access shared document
router.get('/share/:token', (req: express.Request, res: express.Response) => {
  const { token } = req.params;
  
  for (const doc of documentsDb.values()) {
    if (doc.sharedLinkToken === token) {
      if (doc.sharedLinkExpiresAt) {
        const expiresAt = new Date(doc.sharedLinkExpiresAt);
        if (new Date() > expiresAt) {
          return res.status(410).json({ error: 'Share link has expired' });
        }
      }
      
      if (doc.type === 'file') {
        res.setHeader('Content-Disposition', `inline; filename="${doc.name}"`);
        res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
        return res.send(doc.content);
      } else {
        return res.json({ id: doc.id, name: doc.name, type: 'folder' });
      }
    }
  }
  
  res.status(404).json({ error: 'Share link not found' });
});

export default router;

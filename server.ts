import crypto from 'crypto';
import dotenv from 'dotenv';
import express, { type NextFunction, type Request, type Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { HeritageDatabase, UPLOAD_DIR } from './server/database.ts';
import { HeritageRagAssistant } from './server/ragService.ts';
import type { SupportedLocale } from './src/types/heritage.ts';

dotenv.config();

const PORT = 3000;
const app = express();
const db = new HeritageDatabase();
const ragAssistant = new HeritageRagAssistant(db);

app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'public/uploads')));
app.use('/images', express.static(path.resolve(process.cwd(), 'public/images')));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-');
    cb(null, `${safeBase}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ hỗ trợ định dạng ảnh JPG, JPEG, PNG, WEBP.'));
    }
  },
});

function requireAdminKey(req: Request, res: Response, next: NextFunction) {
  const configuredKey = process.env.ADMIN_ACCESS_KEY?.trim();
  if (!configuredKey) {
    res.status(503).json({
      error:
        'ADMIN_ACCESS_KEY chưa được cấu hình trên máy chủ. Vui lòng thiết lập biến môi trường ADMIN_ACCESS_KEY để sử dụng chức năng quản trị.',
      adminConfigured: false,
    });
    return;
  }
  const providedKey = req.header('x-admin-key')?.trim();
  if (!providedKey || providedKey !== configuredKey) {
    res.status(401).json({
      error: 'Mã truy cập quản trị (ADMIN_ACCESS_KEY) không hợp lệ hoặc bị thiếu.',
      adminConfigured: true,
    });
    return;
  }
  next();
}

// --- PUBLIC DATA ENDPOINTS ---
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', project: 'D05', timestamp: new Date().toISOString() });
});

app.get('/api/bootstrap', (_req, res) => {
  const tables = db.getTables();
  const stats = db.getStats();
  const imageAudit = db.scanImageInventory();
  const keepers = db.getAllKeepers();

  res.json({
    stats,
    imageAudit,
    treasures: tables.treasures,
    keepers,
    locations: tables.locations,
    periods: tables.historical_periods,
    cultures: tables.cultures,
    materials: tables.materials,
    decisions: tables.recognition_decisions,
    sources: tables.sources,
    articles: tables.articles,
    images: tables.treasure_images,
    permissions: tables.publication_permissions,
    translations: tables.translations,
    assistantStatus: ragAssistant.getStatus(),
    adminConfigured: Boolean(process.env.ADMIN_ACCESS_KEY?.trim()),
  });
});

app.get('/api/stats', (_req, res) => {
  res.json(db.getStats());
});

app.get('/api/images/audit', (_req, res) => {
  res.json(db.scanImageInventory());
});

app.get('/api/treasures', (_req, res) => {
  res.json(db.getTables().treasures);
});

app.get('/api/treasures/:id', (req, res) => {
  const found = db.getTables().treasures.find((t) => t.id === req.params.id || t.code === req.params.id);
  if (!found) {
    res.status(404).json({ error: 'Không tìm thấy hồ sơ bảo vật.' });
    return;
  }
  res.json(found);
});

app.get('/api/keepers', (_req, res) => {
  res.json(db.getAllKeepers());
});

// --- OPENAI RAG ASSISTANT ENDPOINTS ---
app.get('/api/assistant/status', (_req, res) => {
  res.json(ragAssistant.getStatus());
});

app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { question, locale, sessionId, history } = req.body as {
      question?: string;
      locale?: SupportedLocale;
      sessionId?: string;
      history?: Array<{ role: 'user' | 'assistant'; content: string }>;
    };

    if (!question || !question.trim()) {
      res.status(400).json({ error: 'Vui lòng nhập câu hỏi.' });
      return;
    }

    const result = await ragAssistant.answerQuestion({
      question: question.trim(),
      locale: locale || 'vi',
      sessionId: sessionId || `sess-${Date.now()}`,
      history: Array.isArray(history) ? history : [],
    });

    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi kết nối OpenAI API.';
    res.status(500).json({ available: true, error: message });
  }
});

// --- ADMIN ENDPOINTS (PROTECTED BY ADMIN_ACCESS_KEY) ---
app.post('/api/admin/verify', requireAdminKey, (_req, res) => {
  res.json({ verified: true, stats: db.getStats(), imageAudit: db.scanImageInventory() });
});

app.post('/api/admin/treasures', requireAdminKey, (req, res) => {
  const saved = db.upsertTreasure(req.body);
  res.json({ record: saved, stats: db.getStats() });
});

app.put('/api/admin/treasures/:id', requireAdminKey, (req, res) => {
  const saved = db.upsertTreasure({ ...req.body, id: req.params.id });
  res.json({ record: saved, stats: db.getStats() });
});

app.delete('/api/admin/treasures/:id', requireAdminKey, (req, res) => {
  const removed = db.deleteTreasure(req.params.id);
  if (!removed) {
    res.status(404).json({ error: 'Không tìm thấy bản ghi để xóa.' });
    return;
  }
  res.json({ deleted: true, stats: db.getStats() });
});

app.post('/api/admin/keepers', requireAdminKey, (req, res) => {
  const saved = db.upsertKeeper(req.body);
  res.json({ record: saved, keepers: db.getAllKeepers() });
});

app.post('/api/admin/sources', requireAdminKey, (req, res) => {
  const saved = db.upsertSource(req.body);
  res.json({ record: saved, sources: db.getTables().sources });
});

app.post('/api/admin/permissions', requireAdminKey, (req, res) => {
  const saved = db.upsertPermission(req.body);
  res.json({ record: saved, permissions: db.getTables().publication_permissions, stats: db.getStats() });
});

app.post('/api/admin/translations', requireAdminKey, (req, res) => {
  const saved = db.upsertTranslation(req.body);
  res.json({ record: saved, translations: db.getTables().translations });
});

app.put('/api/admin/images/:id/permission', requireAdminKey, (req, res) => {
  const updated = db.updateImagePermission(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Không tìm thấy bản ghi ảnh.' });
    return;
  }
  res.json({ record: updated, images: db.getTables().treasure_images, stats: db.getStats() });
});

app.post('/api/admin/images/upload', requireAdminKey, upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'Không có tệp ảnh được gửi lên.' });
    return;
  }
  const { treasureId, angle, caption, source, rightsOwner, permissionStatus, copyType } = req.body;
  if (!treasureId) {
    res.status(400).json({ error: 'Thiếu mã hồ sơ bảo vật (treasureId).' });
    return;
  }
  const buf = fs.readFileSync(req.file.path);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  const record = db.registerUploadedImage({
    treasureId,
    angle: angle || 'representative',
    publicUrl: `/uploads/treasures/${req.file.filename}`,
    filename: req.file.filename,
    mimeType: (req.file.mimetype as 'image/jpeg' | 'image/png' | 'image/webp') || 'image/jpeg',
    caption: caption || '',
    source: source || 'Tư liệu tải lên bởi quản trị viên',
    rightsOwner: rightsOwner || 'Chưa xác minh chủ sở hữu',
    permissionStatus: permissionStatus || 'unconfirmed',
    copyType: copyType || 'digital_of_original',
    hash,
  });

  res.json({
    record,
    imageAudit: db.scanImageInventory(),
    images: db.getTables().treasure_images,
    stats: db.getStats(),
  });
});

app.post('/api/admin/images/rescan', requireAdminKey, (_req, res) => {
  res.json({
    imageAudit: db.scanImageInventory(),
    images: db.getTables().treasure_images,
    stats: db.getStats(),
  });
});

app.post('/api/admin/backup', requireAdminKey, (_req, res) => {
  const backupFile = db.createBackup();
  res.json({ backupFile });
});

app.get('/api/admin/export', requireAdminKey, (req, res) => {
  const format = req.query.format === 'csv' ? 'csv' : 'json';
  if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="vietnam-national-treasures-d05.csv"');
    res.send(db.exportCsv());
  } else {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="vietnam-national-treasures-d05.json"');
    res.send(JSON.stringify(db.getTables(), null, 2));
  }
});

app.post('/api/admin/import', requireAdminKey, (req, res) => {
  const items = Array.isArray(req.body?.treasures) ? req.body.treasures : [];
  const count = db.importTreasures(items);
  res.json({ importedCount: count, stats: db.getStats(), treasures: db.getTables().treasures });
});

// --- VITE / STATIC SPA FALLBACK ---
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('/{*path}', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vietnam National Treasures (D05) server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

import type {
  ArticleRecord,
  CultureRecord,
  DatabaseStats,
  HistoricalPeriod,
  KeeperInstitution,
  LocationRecord,
  MaterialRecord,
  PublicationPermissionRecord,
  RecognitionDecision,
  SourceRecord,
  SupportedLocale,
  TranslationRecord,
  TreasureImageRecord,
  TreasureRecord,
} from '../types/heritage';

export interface ImageAuditReport {
  scannedTotal: number;
  verifiedMappedCount: number;
  missingImages: TreasureImageRecord[];
  unusedFiles: Array<{ publicUrl: string; filename: string; hash: string }>;
  duplicates: Array<{ hash: string; urls: string[] }>;
}

export interface BootstrapPayload {
  stats: DatabaseStats;
  imageAudit: ImageAuditReport;
  treasures: TreasureRecord[];
  keepers: KeeperInstitution[];
  locations: LocationRecord[];
  periods: HistoricalPeriod[];
  cultures: CultureRecord[];
  materials: MaterialRecord[];
  decisions: RecognitionDecision[];
  sources: SourceRecord[];
  articles: ArticleRecord[];
  images: TreasureImageRecord[];
  permissions: PublicationPermissionRecord[];
  translations: TranslationRecord[];
  assistantStatus: {
    available: boolean;
    provider: string;
    modelConfigured: string;
  };
  adminConfigured: boolean;
}

export async function fetchBootstrap(): Promise<BootstrapPayload> {
  const res = await fetch('/api/bootstrap');
  if (!res.ok) throw new Error('Không thể tải dữ liệu cơ sở dữ liệu.');
  return res.json();
}

export async function sendAssistantMessage(payload: {
  question: string;
  locale: SupportedLocale;
  sessionId: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}) {
  const res = await fetch('/api/assistant/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function verifyAdminKey(adminKey: string) {
  const res = await fetch('/api/admin/verify', {
    method: 'POST',
    headers: { 'x-admin-key': adminKey },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Xác thực quản trị thất bại.');
  return data;
}

export async function adminUpsertTreasure(adminKey: string, record: TreasureRecord, isNew: boolean) {
  const url = isNew ? '/api/admin/treasures' : `/api/admin/treasures/${encodeURIComponent(record.id)}`;
  const res = await fetch(url, {
    method: isNew ? 'POST' : 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify(record),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Không thể lưu hồ sơ bảo vật.');
  return data;
}

export async function adminDeleteTreasure(adminKey: string, id: string) {
  const res = await fetch(`/api/admin/treasures/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'x-admin-key': adminKey },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Không thể xóa hồ sơ.');
  return data;
}

export async function adminUploadImage(adminKey: string, formData: FormData) {
  const res = await fetch('/api/admin/images/upload', {
    method: 'POST',
    headers: { 'x-admin-key': adminKey },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Không thể tải ảnh lên.');
  return data;
}

export async function adminUpdateImagePermission(
  adminKey: string,
  imageId: string,
  payload: Partial<TreasureImageRecord>,
) {
  const res = await fetch(`/api/admin/images/${encodeURIComponent(imageId)}/permission`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Không thể cập nhật quyền hình ảnh.');
  return data;
}

export async function adminUpsertPermission(adminKey: string, perm: PublicationPermissionRecord) {
  const res = await fetch('/api/admin/permissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify(perm),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Không thể lưu quyền công bố.');
  return data;
}

export async function adminCreateBackup(adminKey: string) {
  const res = await fetch('/api/admin/backup', {
    method: 'POST',
    headers: { 'x-admin-key': adminKey },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Không thể tạo bản sao lưu.');
  return data;
}

export async function adminRescanImages(adminKey: string) {
  const res = await fetch('/api/admin/images/rescan', {
    method: 'POST',
    headers: { 'x-admin-key': adminKey },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Không thể kiểm kê ảnh.');
  return data;
}

export async function adminImportTreasures(adminKey: string, treasures: TreasureRecord[]) {
  const res = await fetch('/api/admin/import', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify({ treasures }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Không thể nhập dữ liệu.');
  return data;
}

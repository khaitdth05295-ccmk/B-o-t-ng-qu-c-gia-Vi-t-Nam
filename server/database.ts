import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import {
  CULTURES,
  HISTORICAL_PERIODS,
  KEEPERS,
  LOCATIONS,
  MATERIALS,
  RECOGNITION_DECISIONS,
} from '../src/data/periodsCulturesMaterials.ts';
import { ARTICLES, SOURCES } from '../src/data/sourcesAndArticles.ts';
import {
  INITIAL_PUBLICATION_PERMISSIONS,
  INITIAL_TREASURE_IMAGES,
  TREASURES,
} from '../src/data/treasuresData.ts';
import { INITIAL_TRANSLATIONS } from '../src/data/translationsData.ts';
import type {
  AiConversationEntry,
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
  TranslationRecord,
  TreasureImageRecord,
  TreasureRecord,
} from '../src/types/heritage.ts';

const DB_DIR = path.resolve(process.cwd(), 'database');
const BACKUP_DIR = path.join(DB_DIR, 'backups');
export const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/treasures');
export const STATIC_IMAGES_DIR = path.resolve(process.cwd(), 'public/images/treasures');

export interface UserRoleRecord {
  id: string;
  username: string;
  role: 'curator' | 'admin' | 'reviewer';
  displayName: string;
}

export interface DatabaseTables {
  treasures: TreasureRecord[];
  museums: KeeperInstitution[];
  heritage_sites: KeeperInstitution[];
  locations: LocationRecord[];
  treasure_images: TreasureImageRecord[];
  historical_periods: HistoricalPeriod[];
  cultures: CultureRecord[];
  materials: MaterialRecord[];
  recognition_decisions: RecognitionDecision[];
  articles: ArticleRecord[];
  sources: SourceRecord[];
  translations: TranslationRecord[];
  publication_permissions: PublicationPermissionRecord[];
  users: UserRoleRecord[];
  ai_conversations: AiConversationEntry[];
}

const TABLE_FILES: Record<keyof DatabaseTables, string> = {
  treasures: 'treasures.json',
  museums: 'museums.json',
  heritage_sites: 'heritage_sites.json',
  locations: 'locations.json',
  treasure_images: 'treasure_images.json',
  historical_periods: 'historical_periods.json',
  cultures: 'cultures.json',
  materials: 'materials.json',
  recognition_decisions: 'recognition_decisions.json',
  articles: 'articles.json',
  sources: 'sources.json',
  translations: 'translations.json',
  publication_permissions: 'publication_permissions.json',
  users: 'users.json',
  ai_conversations: 'ai_conversations.json',
};

function ensureDirs() {
  for (const dir of [DB_DIR, BACKUP_DIR, UPLOAD_DIR, STATIC_IMAGES_DIR]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

function readTableFile<T>(filename: string, fallback: T): T {
  const fullPath = path.join(DB_DIR, filename);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
  try {
    const raw = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeTableFile<T>(filename: string, data: T): void {
  ensureDirs();
  const fullPath = path.join(DB_DIR, filename);
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
}

export class HeritageDatabase {
  private tables!: DatabaseTables;

  constructor() {
    ensureDirs();
    this.loadOrSeed();
    this.scanImageInventory();
  }

  private loadOrSeed() {
    const museumsSeed = KEEPERS.filter((k) => k.kind === 'museum');
    const sitesSeed = KEEPERS.filter((k) => k.kind === 'heritage_site');
    const usersSeed: UserRoleRecord[] = [
      { id: 'usr-admin', username: 'admin', role: 'admin', displayName: 'Quản trị viên Hệ thống' },
      { id: 'usr-curator', username: 'curator', role: 'curator', displayName: 'Biên tập viên Bảo tàng' },
    ];

    this.tables = {
      treasures: readTableFile(TABLE_FILES.treasures, TREASURES),
      museums: readTableFile(TABLE_FILES.museums, museumsSeed),
      heritage_sites: readTableFile(TABLE_FILES.heritage_sites, sitesSeed),
      locations: readTableFile(TABLE_FILES.locations, LOCATIONS),
      treasure_images: readTableFile(TABLE_FILES.treasure_images, INITIAL_TREASURE_IMAGES),
      historical_periods: readTableFile(TABLE_FILES.historical_periods, HISTORICAL_PERIODS),
      cultures: readTableFile(TABLE_FILES.cultures, CULTURES),
      materials: readTableFile(TABLE_FILES.materials, MATERIALS),
      recognition_decisions: readTableFile(TABLE_FILES.recognition_decisions, RECOGNITION_DECISIONS),
      articles: readTableFile(TABLE_FILES.articles, ARTICLES),
      sources: readTableFile(TABLE_FILES.sources, SOURCES),
      translations: readTableFile(TABLE_FILES.translations, INITIAL_TRANSLATIONS),
      publication_permissions: readTableFile(
        TABLE_FILES.publication_permissions,
        INITIAL_PUBLICATION_PERMISSIONS,
      ),
      users: readTableFile(TABLE_FILES.users, usersSeed),
      ai_conversations: readTableFile(TABLE_FILES.ai_conversations, []),
    };
  }

  public getAllKeepers(): KeeperInstitution[] {
    return [...this.tables.museums, ...this.tables.heritage_sites];
  }

  public getTables(): DatabaseTables {
    return this.tables;
  }

  public scanImageInventory() {
    const allowedExt = new Set(['.jpg', '.jpeg', '.png', '.webp']);
    const scannedFiles: Array<{ fullPath: string; publicUrl: string; filename: string; hash: string }> = [];

    const scanDir = (dir: string, urlPrefix: string) => {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir)) {
        const full = path.join(dir, entry);
        const stat = fs.statSync(full);
        if (stat.isFile() && allowedExt.has(path.extname(entry).toLowerCase())) {
          const buf = fs.readFileSync(full);
          const hash = crypto.createHash('sha256').update(buf).digest('hex');
          scannedFiles.push({
            fullPath: full,
            publicUrl: `${urlPrefix}/${entry}`,
            filename: entry,
            hash,
          });
        }
      }
    };

    scanDir(UPLOAD_DIR, '/uploads/treasures');
    scanDir(STATIC_IMAGES_DIR, '/images/treasures');

    const byFilename = new Map(scannedFiles.map((f) => [f.filename.toLowerCase(), f]));
    const mappedUrls = new Set<string>();

    this.tables.treasure_images = this.tables.treasure_images.map((img) => {
      if (img.filePath) {
        const diskPath = path.resolve(process.cwd(), 'public', img.filePath.replace(/^\//, ''));
        if (fs.existsSync(diskPath)) {
          mappedUrls.add(img.filePath);
          return { ...img, fileStatus: 'verified' };
        }
      }
      const matched = byFilename.get(img.expectedFilename.toLowerCase());
      if (matched) {
        mappedUrls.add(matched.publicUrl);
        return {
          ...img,
          filePath: matched.publicUrl,
          fileStatus: 'verified',
          sha256OrHash: matched.hash,
        };
      }
      return { ...img, filePath: null, fileStatus: 'missing' };
    });

    writeTableFile(TABLE_FILES.treasure_images, this.tables.treasure_images);

    const hashCounts = new Map<string, string[]>();
    for (const f of scannedFiles) {
      const list = hashCounts.get(f.hash) ?? [];
      list.push(f.publicUrl);
      hashCounts.set(f.hash, list);
    }

    const duplicates = Array.from(hashCounts.entries())
      .filter(([, urls]) => urls.length > 1)
      .map(([hash, urls]) => ({ hash, urls }));

    const unusedFiles = scannedFiles.filter((f) => !mappedUrls.has(f.publicUrl));
    const missingImages = this.tables.treasure_images.filter((i) => i.fileStatus === 'missing');

    return {
      scannedTotal: scannedFiles.length,
      verifiedMappedCount: this.tables.treasure_images.filter((i) => i.fileStatus === 'verified').length,
      missingImages,
      unusedFiles,
      duplicates,
    };
  }

  public isRecordComplete(t: TreasureRecord): boolean {
    const hasCoreFields =
      Boolean(t.code && t.officialName && t.dating && t.summary && t.currentKeeperId) &&
      t.periodIds.length > 0 &&
      t.materialIds.length > 0;
    const hasSources = t.sourceIds.length > 0;
    const perm = this.tables.publication_permissions.find((p) => p.id === t.permissionId);
    const hasValidPermission =
      Boolean(perm) &&
      (perm!.status === 'permission_granted' ||
        perm!.status === 'official_public_no_separate_permission');
    return hasCoreFields && hasSources && hasValidPermission;
  }

  public getStats(): DatabaseStats {
    const audit = this.scanImageInventory();
    const treasures = this.tables.treasures;
    const permsMap = new Map(this.tables.publication_permissions.map((p) => [p.id, p]));

    const completeRecords = treasures.filter((t) => this.isRecordComplete(t)).length;
    const verifiedRecords = treasures.filter((t) => t.archival.verificationLevel === 'verified').length;
    const publishedRecords = treasures.filter((t) => t.isPublished).length;
    const missingSourceCount = treasures.filter((t) => t.sourceIds.length === 0).length;
    const pendingPermissionCount = treasures.filter((t) => {
      const p = permsMap.get(t.permissionId);
      return !p || p.status === 'unconfirmed';
    }).length;

    return {
      officialRecognizedTotal: 357,
      officialBatchCount: 14,
      officialReferenceDate: '02/2026',
      platformStoredTotal: treasures.length,
      nationalTreasuresStored: treasures.filter((t) => t.recognitionStatus === 'national_treasure').length,
      representativeArtifactsStored: treasures.filter(
        (t) => t.recognitionStatus === 'representative_heritage',
      ).length,
      completeRecords,
      verifiedRecords,
      publishedRecords,
      pendingCompletion: treasures.length - completeRecords,
      missingImageCount: audit.missingImages.length,
      missingSourceCount,
      pendingPermissionCount,
      verifiedImageFilesCount: audit.verifiedMappedCount,
      unusedImageFilesCount: audit.unusedFiles.length,
      duplicateImageFilesCount: audit.duplicates.length,
      totalSourcesCount: this.tables.sources.length,
      totalKeepersCount: this.getAllKeepers().length,
    };
  }

  public upsertTreasure(record: TreasureRecord): TreasureRecord {
    const idx = this.tables.treasures.findIndex((t) => t.id === record.id);
    const updated = { ...record, updatedAt: new Date().toISOString().slice(0, 10) };
    if (idx >= 0) {
      this.tables.treasures[idx] = updated;
    } else {
      this.tables.treasures.unshift(updated);
      const hasImageRow = this.tables.treasure_images.some((i) => i.treasureId === updated.id);
      if (!hasImageRow) {
        this.tables.treasure_images.push({
          id: `img-${updated.id}`,
          treasureId: updated.id,
          angle: 'representative',
          expectedFilename: `${updated.code.toLowerCase()}.jpg`,
          filePath: null,
          mimeType: null,
          fileStatus: 'missing',
          caption: `${updated.officialName} — ${updated.dating}`,
          source: updated.dublinCore.source || 'Chưa xác minh nguồn ảnh',
          rightsOwner: updated.archival.currentHoldingInstitution,
          permissionStatus: 'unconfirmed',
          copyType: updated.archival.displayedCopyType,
          sha256OrHash: null,
        });
        writeTableFile(TABLE_FILES.treasure_images, this.tables.treasure_images);
      }
    }
    writeTableFile(TABLE_FILES.treasures, this.tables.treasures);
    return updated;
  }

  public deleteTreasure(id: string): boolean {
    const before = this.tables.treasures.length;
    this.tables.treasures = this.tables.treasures.filter((t) => t.id !== id);
    if (this.tables.treasures.length === before) return false;
    writeTableFile(TABLE_FILES.treasures, this.tables.treasures);
    return true;
  }

  public upsertKeeper(keeper: KeeperInstitution): KeeperInstitution {
    if (keeper.kind === 'museum') {
      const idx = this.tables.museums.findIndex((m) => m.id === keeper.id);
      if (idx >= 0) this.tables.museums[idx] = keeper;
      else this.tables.museums.push(keeper);
      writeTableFile(TABLE_FILES.museums, this.tables.museums);
    } else {
      const idx = this.tables.heritage_sites.findIndex((s) => s.id === keeper.id);
      if (idx >= 0) this.tables.heritage_sites[idx] = keeper;
      else this.tables.heritage_sites.push(keeper);
      writeTableFile(TABLE_FILES.heritage_sites, this.tables.heritage_sites);
    }
    return keeper;
  }

  public upsertSource(source: SourceRecord): SourceRecord {
    const idx = this.tables.sources.findIndex((s) => s.id === source.id);
    if (idx >= 0) this.tables.sources[idx] = source;
    else this.tables.sources.push(source);
    writeTableFile(TABLE_FILES.sources, this.tables.sources);
    return source;
  }

  public upsertPermission(perm: PublicationPermissionRecord): PublicationPermissionRecord {
    const idx = this.tables.publication_permissions.findIndex((p) => p.id === perm.id);
    if (idx >= 0) this.tables.publication_permissions[idx] = perm;
    else this.tables.publication_permissions.push(perm);
    writeTableFile(TABLE_FILES.publication_permissions, this.tables.publication_permissions);
    return perm;
  }

  public upsertTranslation(tr: TranslationRecord): TranslationRecord {
    const idx = this.tables.translations.findIndex((x) => x.id === tr.id);
    if (idx >= 0) this.tables.translations[idx] = tr;
    else this.tables.translations.push(tr);
    writeTableFile(TABLE_FILES.translations, this.tables.translations);
    return tr;
  }

  public registerUploadedImage(params: {
    treasureId: string;
    angle: TreasureImageRecord['angle'];
    publicUrl: string;
    filename: string;
    mimeType: TreasureImageRecord['mimeType'];
    caption: string;
    source: string;
    rightsOwner: string;
    permissionStatus: TreasureImageRecord['permissionStatus'];
    copyType: TreasureImageRecord['copyType'];
    hash: string;
  }): TreasureImageRecord {
    const existingIdx = this.tables.treasure_images.findIndex(
      (i) => i.treasureId === params.treasureId && i.angle === params.angle && i.fileStatus === 'missing',
    );
    const record: TreasureImageRecord = {
      id: existingIdx >= 0 ? this.tables.treasure_images[existingIdx].id : `img-${Date.now()}`,
      treasureId: params.treasureId,
      angle: params.angle,
      expectedFilename: params.filename,
      filePath: params.publicUrl,
      mimeType: params.mimeType,
      fileStatus: 'verified',
      caption: params.caption,
      source: params.source,
      rightsOwner: params.rightsOwner,
      permissionStatus: params.permissionStatus,
      copyType: params.copyType,
      sha256OrHash: params.hash,
    };

    if (existingIdx >= 0) {
      this.tables.treasure_images[existingIdx] = record;
    } else {
      this.tables.treasure_images.push(record);
    }
    writeTableFile(TABLE_FILES.treasure_images, this.tables.treasure_images);
    return record;
  }

  public updateImagePermission(
    imageId: string,
    updates: Partial<Pick<TreasureImageRecord, 'permissionStatus' | 'source' | 'rightsOwner' | 'caption' | 'copyType'>>,
  ): TreasureImageRecord | null {
    const idx = this.tables.treasure_images.findIndex((i) => i.id === imageId);
    if (idx < 0) return null;
    this.tables.treasure_images[idx] = { ...this.tables.treasure_images[idx], ...updates };
    writeTableFile(TABLE_FILES.treasure_images, this.tables.treasure_images);
    return this.tables.treasure_images[idx];
  }

  public logAiConversation(entry: AiConversationEntry) {
    this.tables.ai_conversations.unshift(entry);
    if (this.tables.ai_conversations.length > 200) {
      this.tables.ai_conversations = this.tables.ai_conversations.slice(0, 200);
    }
    writeTableFile(TABLE_FILES.ai_conversations, this.tables.ai_conversations);
  }

  public createBackup(): string {
    ensureDirs();
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${stamp}.json`;
    const fullPath = path.join(BACKUP_DIR, filename);
    fs.writeFileSync(fullPath, JSON.stringify(this.tables, null, 2), 'utf-8');
    return filename;
  }

  public exportCsv(): string {
    const keepersMap = new Map(this.getAllKeepers().map((k) => [k.id, k.officialName]));
    const escapeCsv = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;
    const header = [
      'Identifier',
      'OfficialName',
      'RecognitionStatus',
      'BatchNumber',
      'DecisionNumber',
      'Dating',
      'Dynasty',
      'DiscoveryPlace',
      'CurrentKeeper',
      'VerificationLevel',
      'Source',
    ];
    const rows = this.tables.treasures.map((t) =>
      [
        t.code,
        t.officialName,
        t.recognitionStatus,
        t.batchNumber !== null ? String(t.batchNumber) : '',
        t.decisionNumber || '',
        t.dating,
        t.dynasty,
        t.discoveryPlace,
        keepersMap.get(t.currentKeeperId) || t.archival.currentHoldingInstitution,
        t.archival.verificationLevel,
        t.dublinCore.source,
      ]
        .map(escapeCsv)
        .join(','),
    );
    return '\uFEFF' + [header.join(','), ...rows].join('\n');
  }

  public importTreasures(items: TreasureRecord[]): number {
    let added = 0;
    for (const item of items) {
      if (item && item.id && item.officialName && item.code) {
        this.upsertTreasure(item);
        added++;
      }
    }
    return added;
  }
}

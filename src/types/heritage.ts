export type SupportedLocale =
  | 'vi'
  | 'en'
  | 'fr'
  | 'zh-cn'
  | 'zh-tw'
  | 'ja'
  | 'ko'
  | 'es'
  | 'ru'
  | 'de';

export type RecognitionStatus = 'national_treasure' | 'representative_heritage';

export type VerificationLevel = 'verified' | 'partial' | 'unverified';

export type CopyType =
  | 'original'
  | 'replica'
  | 'digital_of_original'
  | 'digital_of_replica';

export type OriginalCondition = 'good' | 'minor_damage' | 'severe_damage' | 'unknown';

export type PublicationPermissionStatus =
  | 'permission_granted'
  | 'official_public_no_separate_permission'
  | 'unconfirmed'
  | 'not_permitted';

export interface DublinCoreMetadata {
  title: string;
  creator: string;
  subject: string;
  description: string;
  publisher: string;
  contributor: string;
  date: string;
  type: string;
  format: string;
  identifier: string;
  source: string;
  language: string;
  relation: string;
  coverage: string;
  rights: string;
}

export interface ExtendedArchivalFields {
  currentHoldingInstitution: string;
  holdingAtDocumentationTime: string;
  displayedCopyType: CopyType;
  originalCondition: OriginalCondition;
  registrationNumber: string;
  permissionGrantor: string;
  permittedScope: string;
  unpublishedSections: string;
  verificationLevel: VerificationLevel;
  imageFiles: string[];
  documentationSource: string;
}

export interface TreasureEncyclopediaSections {
  overview: string;
  formationHistory: string;
  origin: string;
  discoveryProcess: string;
  historicalContext: string;
  datingDetail: string;
  cultureAndDynastyDetail: string;
  physicalCharacteristics: string;
  structure: string;
  materialAnalysis: string;
  craftingTechnique: string;
  motifsAndSymbols: string;
  inscriptionsAndMarks: string;
  historicalValue: string;
  culturalValue: string;
  artisticValue: string;
  archaeologicalValue: string;
  scientificValue: string;
  recognitionProcess: string;
  recognitionDecisionSummary: string;
  currentKeeperDetail: string;
  exhibitionStatus: string;
  conservationInfo: string;
  researchDocuments: string;
}

export interface TreasureRecord {
  id: string;
  code: string;
  officialName: string;
  otherNames: string[];
  recognitionStatus: RecognitionStatus;
  batchNumber: number | null;
  decisionId: string | null;
  decisionNumber: string | null;
  decisionDate: string | null;
  dating: string;
  periodIds: string[];
  cultureId: string;
  dynasty: string;
  materialIds: string[];
  artifactType: string;
  discoveryPlace: string;
  currentKeeperId: string;
  exhibitionPlace: string;
  summary: string;
  sections: TreasureEncyclopediaSections;
  dublinCore: DublinCoreMetadata;
  archival: ExtendedArchivalFields;
  sourceIds: string[];
  relatedTreasureIds: string[];
  permissionId: string;
  isPublished: boolean;
  updatedAt: string;
}

export interface HistoricalPeriod {
  id: string;
  order: number;
  name: string;
  dateRange: string;
  summary: string;
  keyEvents: string[];
  sourceIds: string[];
}

export interface CultureRecord {
  id: string;
  name: string;
  timeSpan: string;
  region: string;
  description: string;
}

export interface MaterialRecord {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface LocationRecord {
  id: string;
  provinceOrCity: string;
  region: 'Bắc Bộ' | 'Trung Bộ' | 'Nam Bộ';
  lat: number;
  lng: number;
}

export interface KeeperInstitution {
  id: string;
  kind: 'museum' | 'heritage_site';
  officialName: string;
  shortName: string;
  provinceOrCity: string;
  locationId: string;
  publicAddress: string;
  coordinates: {
    lat: number;
    lng: number;
    verified: boolean;
    coordinateSource: string;
  };
  history: string;
  introduction: string;
  officialWebsite: string;
  visitingInfo: string;
  openingHours: string;
  imageId: string | null;
  sourceIds: string[];
}

export interface RecognitionDecision {
  id: string;
  batchNumber: number;
  decisionNumber: string;
  signedDate: string;
  signer: string;
  totalArtifactsInBatch: number | null;
  officialUrl: string;
  notes: string;
}

export interface TreasureImageRecord {
  id: string;
  treasureId: string;
  angle: 'representative' | 'full' | 'closeup' | 'supplemental';
  expectedFilename: string;
  filePath: string | null;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp' | null;
  fileStatus: 'verified' | 'missing';
  caption: string;
  source: string;
  rightsOwner: string;
  permissionStatus: PublicationPermissionStatus;
  copyType: CopyType;
  sha256OrHash: string | null;
}

export interface PublicationPermissionRecord {
  id: string;
  recordId: string;
  recordType: 'treasure' | 'image' | 'article';
  status: PublicationPermissionStatus;
  grantorNameOrAgency: string;
  grantorRole: string;
  confirmedDate: string | null;
  permittedScope: string;
  sourceReference: string;
  imageCopyrightCondition: string;
  contentRightsNote: string;
}

export interface SourceRecord {
  id: string;
  code: string;
  group: 'state_agency' | 'museum' | 'research_institute' | 'international' | 'books_journals';
  name: string;
  organizationOrAuthor: string;
  documentTitle: string;
  url: string;
  publishedDate: string;
  accessedDate: string;
  description: string;
  relatedTreasureIds: string[];
  verificationStatus: 'verified' | 'pending';
}

export interface ArticleRecord {
  id: string;
  category:
    | 'Công nhận bảo vật quốc gia'
    | 'Khảo cổ học'
    | 'Lịch sử Việt Nam'
    | 'Nghệ thuật và mỹ thuật'
    | 'Văn hóa'
    | 'Hoạt động bảo tàng'
    | 'Bảo tồn di sản'
    | 'Triển lãm'
    | 'Nghiên cứu chuyên ngành';
  title: string;
  authorOrAgency: string;
  publishedDate: string;
  summary: string;
  content: string[];
  imageUrl: string | null;
  sourceId: string;
  relatedArticleIds: string[];
  relatedTreasureIds: string[];
}

export interface TranslationRecord {
  id: string;
  entityType: 'treasure' | 'museum' | 'article';
  entityId: string;
  locale: SupportedLocale;
  translatedTitle: string;
  translatedSummary: string;
  translatedNote: string;
  academicReviewStatus: 'verified_academic' | 'machine_or_editorial_unreviewed';
}

export interface AiConversationEntry {
  id: string;
  sessionId: string;
  locale: SupportedLocale;
  question: string;
  answer: string;
  citedTreasureIds: string[];
  citedSourceIds: string[];
  createdAt: string;
}

export interface DatabaseStats {
  officialRecognizedTotal: number;
  officialBatchCount: number;
  officialReferenceDate: string;
  platformStoredTotal: number;
  nationalTreasuresStored: number;
  representativeArtifactsStored: number;
  completeRecords: number;
  verifiedRecords: number;
  publishedRecords: number;
  pendingCompletion: number;
  missingImageCount: number;
  missingSourceCount: number;
  pendingPermissionCount: number;
  verifiedImageFilesCount: number;
  unusedImageFilesCount: number;
  duplicateImageFilesCount: number;
  totalSourcesCount: number;
  totalKeepersCount: number;
}

export type MapProviderId = 'osm' | 'carto' | 'maptiler';

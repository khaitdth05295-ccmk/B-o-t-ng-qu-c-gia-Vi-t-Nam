import type { SupportedLocale, TranslationRecord } from '../types/heritage';
import { TREASURES } from './treasuresData';

export interface LocaleInfo {
  code: SupportedLocale;
  label: string;
  nativeName: string;
  flagLabel: string;
}

export const SUPPORTED_LOCALES: LocaleInfo[] = [
  { code: 'vi', label: 'Tiếng Việt', nativeName: 'Tiếng Việt', flagLabel: 'VN' },
  { code: 'en', label: 'English', nativeName: 'English', flagLabel: 'EN' },
  { code: 'fr', label: 'Français', nativeName: 'Français', flagLabel: 'FR' },
  { code: 'zh-cn', label: '中文简体', nativeName: '简体中文', flagLabel: 'ZH-CN' },
  { code: 'zh-tw', label: '中文繁體', nativeName: '繁體中文', flagLabel: 'ZH-TW' },
  { code: 'ja', label: '日本語', nativeName: '日本語', flagLabel: 'JA' },
  { code: 'ko', label: '한국어', nativeName: '한국어', flagLabel: 'KO' },
  { code: 'es', label: 'Español', nativeName: 'Español', flagLabel: 'ES' },
  { code: 'ru', label: 'Русский', nativeName: 'Русский', flagLabel: 'RU' },
  { code: 'de', label: 'Deutsch', nativeName: 'Deutsch', flagLabel: 'DE' },
];

export interface UITranslationStrings {
  brandTitle: string;
  brandSub: string;
  nav: {
    home: string;
    encyclopedia: string;
    map: string;
    timeline: string;
    museums: string;
    gallery: string;
    news: string;
    sources: string;
    about: string;
    admin: string;
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    ctaExplore: string;
    ctaMap: string;
  };
  stats: {
    officialTotalLabel: string;
    officialTotalSub: string;
    storedTotalLabel: string;
    storedTotalSub: string;
    verifiedTotalLabel: string;
    verifiedTotalSub: string;
    keepersLabel: string;
  };
  labels: {
    nationalTreasure: string;
    representativeHeritage: string;
    searchPlaceholder: string;
    openAssistant: string;
    close: string;
    viewDetail: string;
    quickView: string;
    dating: string;
    period: string;
    culture: string;
    material: string;
    keeper: string;
    discoveryPlace: string;
    decision: string;
    sources: string;
    unverifiedNotice: string;
    translationDisclaimer: string;
    all: string;
    filter: string;
    reset: string;
    missingImageNotice: string;
  };
  assistant: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    send: string;
    unavailableTitle: string;
    unavailableBody: string;
    suggestedQuestions: string[];
  };
  map: {
    title: string;
    providerLabel: string;
    resetView: string;
    reloadTiles: string;
    tileError: string;
    offlineMarkersOnly: string;
    discoveryVsHoldingNote: string;
  };
  footer: {
    legalBasis: string;
    copyrightNote: string;
  };
}

export const UI_TRANSLATIONS: Record<SupportedLocale, UITranslationStrings> = {
  vi: {
    brandTitle: 'BẢO VẬT QUỐC GIA VIỆT NAM',
    brandSub: 'Vietnam National Treasures · Dự án D05',
    nav: {
      home: 'Trang chủ',
      encyclopedia: 'Bách khoa toàn thư',
      map: 'Bản đồ Di sản',
      timeline: 'Dòng thời gian',
      museums: 'Bảo tàng & Di tích',
      gallery: 'Thư viện hình ảnh',
      news: 'Tin tức & Nghiên cứu',
      sources: 'Nguồn tham khảo',
      about: 'Giới thiệu',
      admin: 'Quản trị',
    },
    hero: {
      kicker: 'CỔNG THÔNG TIN DI SẢN & BẢO TÀNG SỐ · LUẬT DI SẢN VĂN HÓA 45/2024/QH15',
      title: 'BẢO VẬT QUỐC GIA VIỆT NAM',
      subtitle: 'Khám phá những dấu ấn lịch sử và giá trị văn hóa trường tồn của dân tộc.',
      ctaExplore: 'Tra cứu Bách khoa toàn thư',
      ctaMap: 'Mở Bản đồ Di sản tương tác',
    },
    stats: {
      officialTotalLabel: 'Được công nhận chính thức',
      officialTotalSub: '357 bảo vật & nhóm hiện vật qua 14 đợt (mốc 02/2026)',
      storedTotalLabel: 'Hồ sơ trên nền tảng',
      storedTotalSub: 'Hồ sơ độc lập đã nhập vào cơ sở dữ liệu',
      verifiedTotalLabel: 'Hồ sơ đã xác minh',
      verifiedTotalSub: 'Có nguồn đối chiếu và kiểm tra pháp lý đầy đủ',
      keepersLabel: 'Bảo tàng & Di tích lưu giữ',
    },
    labels: {
      nationalTreasure: 'BẢO VẬT QUỐC GIA',
      representativeHeritage: 'HIỆN VẬT DI SẢN TIÊU BIỂU',
      searchPlaceholder: 'Tìm bảo vật, niên đại, bảo tàng, quyết định...',
      openAssistant: 'Trợ lý Di sản',
      close: 'Đóng',
      viewDetail: 'Xem hồ sơ đầy đủ',
      quickView: 'Xem nhanh',
      dating: 'Niên đại',
      period: 'Thời kỳ lịch sử',
      culture: 'Nền văn hóa',
      material: 'Chất liệu',
      keeper: 'Đơn vị lưu giữ',
      discoveryPlace: 'Nơi phát hiện',
      decision: 'Quyết định công nhận',
      sources: 'Nguồn tham khảo',
      unverifiedNotice: 'Chưa có dữ liệu xác minh',
      translationDisclaimer: 'Bản dịch giao diện và tóm tắt biên tập; tên riêng và tên chính thức giữ nguyên bản tiếng Việt.',
      all: 'Tất cả',
      filter: 'Bộ lọc',
      reset: 'Đặt lại',
      missingImageNotice: 'Chưa có tệp ảnh gốc tải lên (chờ bổ sung từ bộ ảnh hiện vật)',
    },
    assistant: {
      title: 'TRỢ LÝ DI SẢN VIỆT NAM',
      subtitle: 'Tra cứu RAG từ cơ sở dữ liệu bảo vật, bảo tàng và văn bản công nhận',
      inputPlaceholder: 'Hỏi về trống đồng Ngọc Lũ, Cửu Đỉnh, bảo tàng, quyết định công nhận...',
      send: 'Gửi',
      unavailableTitle: 'Trợ lý AI hiện chưa khả dụng',
      unavailableBody: 'Máy chủ chưa cấu hình biến môi trường OPENAI_API_KEY. Toàn bộ Bách khoa toàn thư, Bản đồ và Cơ sở dữ liệu vẫn hoạt động bình thường.',
      suggestedQuestions: [
        'Trống đồng Ngọc Lũ được công nhận đợt nào và lưu giữ ở đâu?',
        'So sánh giá trị lịch sử giữa Bia Võ Cạnh và 82 Bia Tiến sĩ Văn Miếu?',
        'Những bảo vật nào hiện trưng bày tại Bảo tàng Điêu khắc Chăm Đà Nẵng?',
      ],
    },
    map: {
      title: 'Bản đồ Địa lý Tương tác Nơi Lưu giữ Bảo vật Quốc gia',
      providerLabel: 'Lớp bản đồ nền',
      resetView: 'Xem toàn Việt Nam',
      reloadTiles: 'Tải lại bản đồ',
      tileError: 'Không thể tải ô bản đồ từ nhà cung cấp hiện tại.',
      offlineMarkersOnly: 'Tất cả dịch vụ bản đồ nền đang ngoại tuyến; vẫn giữ nguyên vị trí các đơn vị lưu giữ.',
      discoveryVsHoldingNote: 'Bản đồ hiển thị tọa độ công khai của Bảo tàng và Di tích lưu giữ/trưng bày đã xác minh; không công bố địa chỉ tư nhân hoặc vị trí nhạy cảm.',
    },
    footer: {
      legalBasis: 'Căn cứ nội dung: Luật Di sản văn hóa số 45/2024/QH15 và danh mục chính thức từ Cục Di sản văn hóa (dsvh.gov.vn).',
      copyrightNote: 'Nền tảng Bách khoa toàn thư số & Bản đồ Di sản (Dự án D05). Phân biệt rõ quyền nội dung và quyền sử dụng hình ảnh từng hiện vật.',
    },
  },
  en: {
    brandTitle: 'VIETNAM NATIONAL TREASURES',
    brandSub: 'Digital Heritage Encyclopedia & Museum Map · D05',
    nav: {
      home: 'Home',
      encyclopedia: 'Encyclopedia',
      map: 'Heritage Map',
      timeline: 'Timeline',
      museums: 'Museums & Sites',
      gallery: 'Image Archive',
      news: 'News & Research',
      sources: 'References',
      about: 'About',
      admin: 'Admin',
    },
    hero: {
      kicker: 'NATIONAL HERITAGE PORTAL · CULTURAL HERITAGE LAW NO. 45/2024/QH15',
      title: 'VIETNAM NATIONAL TREASURES',
      subtitle: 'Discover the enduring historical milestones and cultural values of the Vietnamese nation.',
      ctaExplore: 'Browse Encyclopedia',
      ctaMap: 'Open Interactive Map',
    },
    stats: {
      officialTotalLabel: 'Officially Recognized',
      officialTotalSub: '357 treasures & groups across 14 batches (as of Feb 2026)',
      storedTotalLabel: 'Platform Records',
      storedTotalSub: 'Independent records cataloged in this database',
      verifiedTotalLabel: 'Verified Records',
      verifiedTotalSub: 'Cross-checked against primary sources and legal decisions',
      keepersLabel: 'Museums & Heritage Sites',
    },
    labels: {
      nationalTreasure: 'NATIONAL TREASURE',
      representativeHeritage: 'REPRESENTATIVE HERITAGE ARTIFACT',
      searchPlaceholder: 'Search artifacts, dating, museums, decisions...',
      openAssistant: 'Heritage Assistant',
      close: 'Close',
      viewDetail: 'View Full Dossier',
      quickView: 'Quick View',
      dating: 'Dating',
      period: 'Historical Period',
      culture: 'Culture',
      material: 'Material',
      keeper: 'Holding Institution',
      discoveryPlace: 'Discovery Site',
      decision: 'Recognition Decision',
      sources: 'References',
      unverifiedNotice: 'Unverified data',
      translationDisclaimer: 'Editorial / automated translation; not yet certified as an academic translation. Official proper names remain in Vietnamese.',
      all: 'All',
      filter: 'Filter',
      reset: 'Reset',
      missingImageNotice: 'Original artifact photo not yet uploaded to asset inventory',
    },
    assistant: {
      title: 'VIETNAM HERITAGE ASSISTANT',
      subtitle: 'RAG lookup grounded in verified treasure, museum, and legal decision records',
      inputPlaceholder: 'Ask about Ngoc Lu bronze drum, Nine Dynastic Urns, museums...',
      send: 'Send',
      unavailableTitle: 'AI Assistant Unavailable',
      unavailableBody: 'OPENAI_API_KEY is not configured on the server. All encyclopedia, map, and museum records remain fully accessible.',
      suggestedQuestions: [
        'Which recognition batch included the Ngoc Lu Bronze Drum and where is it kept?',
        'Compare the historical significance of the Vo Canh Stele and the 82 Doctoral Stelae.',
        'Which National Treasures are preserved at the Museum of Cham Sculpture in Da Nang?',
      ],
    },
    map: {
      title: 'Interactive Map of National Treasure Holding Institutions',
      providerLabel: 'Basemap Layer',
      resetView: 'Full Vietnam View',
      reloadTiles: 'Reload Tiles',
      tileError: 'Unable to load map tiles from the selected provider.',
      offlineMarkersOnly: 'Basemap tile services are currently unreachable; verified institution markers remain visible.',
      discoveryVsHoldingNote: 'Displays verified public coordinates of holding museums and heritage sites; private addresses and sensitive storage sites are excluded.',
    },
    footer: {
      legalBasis: 'Legal basis: Cultural Heritage Law No. 45/2024/QH15 and official registries from the Department of Cultural Heritage (dsvh.gov.vn).',
      copyrightNote: 'Digital Heritage Encyclopedia & Map (Project D05). Content rights and artifact image rights are tracked independently.',
    },
  },
  fr: {
    brandTitle: 'TRÉSORS NATIONAUX DU VIETNAM',
    brandSub: 'Encyclopédie numérique & Carte muséale · D05',
    nav: {
      home: 'Accueil',
      encyclopedia: 'Encyclopédie',
      map: 'Carte du patrimoine',
      timeline: 'Chronologie',
      museums: 'Musées & Sites',
      gallery: 'Photothèque',
      news: 'Actualités & Recherche',
      sources: 'Références',
      about: 'À propos',
      admin: 'Administration',
    },
    hero: {
      kicker: 'PORTAIL DU PATRIMOINE NATIONAL · LOI N° 45/2024/QH15',
      title: 'TRÉSORS NATIONAUX DU VIETNAM',
      subtitle: 'Explorez les repères historiques et les valeurs culturelles durables du peuple vietnamien.',
      ctaExplore: 'Consulter l’Encyclopédie',
      ctaMap: 'Ouvrir la Carte interactive',
    },
    stats: {
      officialTotalLabel: 'Reconnus officiellement',
      officialTotalSub: '357 trésors et ensembles en 14 vagues (fév. 2026)',
      storedTotalLabel: 'Fiches enregistrées',
      storedTotalSub: 'Dossiers indépendants dans cette base',
      verifiedTotalLabel: 'Fiches vérifiées',
      verifiedTotalSub: 'Validées avec sources primaires et décrets',
      keepersLabel: 'Musées et Sites conservateurs',
    },
    labels: {
      nationalTreasure: 'TRÉSOR NATIONAL',
      representativeHeritage: 'OBJET PATRIMONIAL REPRÉSENTATIF',
      searchPlaceholder: 'Rechercher un trésor, une datation, un musée...',
      openAssistant: 'Assistant Patrimoine',
      close: 'Fermer',
      viewDetail: 'Voir le dossier complet',
      quickView: 'Aperçu',
      dating: 'Datation',
      period: 'Période historique',
      culture: 'Culture',
      material: 'Matériau',
      keeper: 'Institution conservatrice',
      discoveryPlace: 'Lieu de découverte',
      decision: 'Décision de reconnaissance',
      sources: 'Références',
      unverifiedNotice: 'Données non vérifiées',
      translationDisclaimer: 'Traduction éditoriale non certifiée académiquement ; les noms propres officiels sont conservés en vietnamien.',
      all: 'Tous',
      filter: 'Filtrer',
      reset: 'Réinitialiser',
      missingImageNotice: 'Photographie originale en attente d’importation dans l’inventaire',
    },
    assistant: {
      title: 'ASSISTANT PATRIMOINE DU VIETNAM',
      subtitle: 'Recherche RAG fondée sur la base de données muséale vérifiée',
      inputPlaceholder: 'Interrogez sur le tambour de Ngoc Lu, les Neuf Urnes...',
      send: 'Envoyer',
      unavailableTitle: 'Assistant IA indisponible',
      unavailableBody: 'OPENAI_API_KEY non configurée sur le serveur. Le reste du portail fonctionne normalement.',
      suggestedQuestions: [
        'Où est conservé le tambour de bronze de Ngoc Lu ?',
        'Quelle est la portée historique de la stèle de Vo Canh ?',
        'Quels trésors sont exposés au Musée de la Sculpture Cham à Da Nang ?',
      ],
    },
    map: {
      title: 'Carte géographique interactive des lieux de conservation',
      providerLabel: 'Fond de carte',
      resetView: 'Vue entière du Vietnam',
      reloadTiles: 'Recharger la carte',
      tileError: 'Impossible de charger les tuiles cartographiques.',
      offlineMarkersOnly: 'Fonds de carte hors ligne ; les marqueurs vérifiés restent affichés.',
      discoveryVsHoldingNote: 'Coordonnées publiques vérifiées des musées et sites ; aucune adresse privée sensible.',
    },
    footer: {
      legalBasis: 'Base juridique : Loi sur le patrimoine culturel n° 45/2024/QH15 et Département du Patrimoine culturel.',
      copyrightNote: 'Encyclopédie numérique du patrimoine (Projet D05).',
    },
  },
  'zh-cn': {
    brandTitle: '越南国家宝物',
    brandSub: '数字遗产百科全书与博物馆交互地图 · D05',
    nav: {
      home: '首页',
      encyclopedia: '百科全书',
      map: '遗产地图',
      timeline: '历史时间轴',
      museums: '博物馆与遗迹',
      gallery: '影像资料库',
      news: '资讯与研究',
      sources: '参考文献',
      about: '关于平台',
      admin: '管理后台',
    },
    hero: {
      kicker: '国家遗产数字门户 · 2024年第45号文化遗产法',
      title: '越南国家宝物',
      subtitle: '探索越南民族历久弥新的历史印记与文化价值。',
      ctaExplore: '浏览百科全书',
      ctaMap: '打开交互地图',
    },
    stats: {
      officialTotalLabel: '官方正式认定总数',
      officialTotalSub: '截至2026年2月共14批357件/组国宝',
      storedTotalLabel: '平台收录档案',
      storedTotalSub: '数据库已录独立文物档案数',
      verifiedTotalLabel: '已核验档案',
      verifiedTotalSub: '具备官方来源与法律批文核对',
      keepersLabel: '馆藏博物馆与遗址',
    },
    labels: {
      nationalTreasure: '国家宝物',
      representativeHeritage: '代表性遗产文物',
      searchPlaceholder: '搜索国宝名称、年代、博物馆、批文...',
      openAssistant: '遗产助手',
      close: '关闭',
      viewDetail: '查看完整档案',
      quickView: '快速预览',
      dating: '年代',
      period: '历史时期',
      culture: '文化归属',
      material: '材质',
      keeper: '收藏单位',
      discoveryPlace: '出土地点',
      decision: '认定批文',
      sources: '参考资料',
      unverifiedNotice: '暂无核实数据',
      translationDisclaimer: '此为编辑/机器辅助译文，尚未经学术审定；正式专有名词保留越南语原文。',
      all: '全部',
      filter: '筛选',
      reset: '重置',
      missingImageNotice: '文物实物照片尚未上传至图库档案',
    },
    assistant: {
      title: '越南遗产智能助手',
      subtitle: '基于国宝档案与博物馆数据库的RAG检索问答',
      inputPlaceholder: '询问玉缕铜鼓、顺化九鼎、博物馆藏品...',
      send: '发送',
      unavailableTitle: 'AI 助手暂不可用',
      unavailableBody: '服务器未配置 OPENAI_API_KEY，但网站百科与地图功能完全正常。',
      suggestedQuestions: [
        '玉缕铜鼓在哪一批被认定为国家宝物，现藏于何处？',
        '武竞碑与河内文庙进士碑有何历史价值？',
        '岘港占婆雕刻博物馆藏有哪些国家宝物？',
      ],
    },
    map: {
      title: '越南国家宝物馆藏地交互地图',
      providerLabel: '地图底图图层',
      resetView: '查看越南全境',
      reloadTiles: '重新加载地图',
      tileError: '无法加载当前底图瓦片。',
      offlineMarkersOnly: '底图服务离线，已保留馆藏机构坐标标记。',
      discoveryVsHoldingNote: '仅展示已核实博物馆与遗迹的公开坐标，不公开私人地址或敏感库房位置。',
    },
    footer: {
      legalBasis: '依据：第45/2024/QH15号文化遗产法及越南文化遗产局官方名录 (dsvh.gov.vn)。',
      copyrightNote: '越南国家宝物数字百科平台 (项目 D05)。',
    },
  },
  'zh-tw': {
    brandTitle: '越南國家寶物',
    brandSub: '數位遺產百科全書與博物館互動地圖 · D05',
    nav: {
      home: '首頁',
      encyclopedia: '百科全書',
      map: '遺產地圖',
      timeline: '歷史時間軸',
      museums: '博物館與遺蹟',
      gallery: '影像資料庫',
      news: '資訊與研究',
      sources: '參考文獻',
      about: '關於平台',
      admin: '管理後台',
    },
    hero: {
      kicker: '國家遺產數位入口 · 2024年第45號文化遺產法',
      title: '越南國家寶物',
      subtitle: '探索越南民族歷久彌新的歷史印記與文化價值。',
      ctaExplore: '瀏覽百科全書',
      ctaMap: '開啟互動地圖',
    },
    stats: {
      officialTotalLabel: '官方正式認定總數',
      officialTotalSub: '截至2026年2月共14批357件/組國寶',
      storedTotalLabel: '平台收錄檔案',
      storedTotalSub: '資料庫已錄獨立文物檔案數',
      verifiedTotalLabel: '已核驗檔案',
      verifiedTotalSub: '具備官方來源與法律批文核對',
      keepersLabel: '館藏博物館與遺址',
    },
    labels: {
      nationalTreasure: '國家寶物',
      representativeHeritage: '代表性遺產文物',
      searchPlaceholder: '搜尋國寶名稱、年代、博物館、批文...',
      openAssistant: '遺產助手',
      close: '關閉',
      viewDetail: '查看完整檔案',
      quickView: '快速預覽',
      dating: '年代',
      period: '歷史時期',
      culture: '文化歸屬',
      material: '材質',
      keeper: '收藏單位',
      discoveryPlace: '出土地點',
      decision: '認定批文',
      sources: '參考資料',
      unverifiedNotice: '暫無核實數據',
      translationDisclaimer: '此為編輯/機器輔助譯文，尚未經學術審定；正式專有名詞保留越南語原文。',
      all: '全部',
      filter: '篩選',
      reset: '重設',
      missingImageNotice: '文物實物照片尚未上傳至圖庫檔案',
    },
    assistant: {
      title: '越南遺產智能助手',
      subtitle: '基於國寶檔案與博物館資料庫的RAG檢索問答',
      inputPlaceholder: '詢問玉縷銅鼓、順化九鼎、博物館藏品...',
      send: '發送',
      unavailableTitle: 'AI 助手暫不可用',
      unavailableBody: '伺服器未配置 OPENAI_API_KEY，但網站百科與地圖功能完全正常。',
      suggestedQuestions: [
        '玉縷銅鼓在哪一批被認定為國家寶物，現藏於何處？',
        '武競碑與河內文廟進士碑有何歷史價值？',
        '峴港占婆雕刻博物館藏有哪些國家寶物？',
      ],
    },
    map: {
      title: '越南國家寶物館藏地互動地圖',
      providerLabel: '地圖底圖圖層',
      resetView: '查看越南全境',
      reloadTiles: '重新載入地圖',
      tileError: '無法載入目前底圖圖磚。',
      offlineMarkersOnly: '底圖服務離線，已保留館藏機構座標標記。',
      discoveryVsHoldingNote: '僅展示已核實博物館與遺蹟的公開座標，不公開私人地址或敏感庫房位置。',
    },
    footer: {
      legalBasis: '依據：第45/2024/QH15號文化遺產法及越南文化遺產局官方名錄。',
      copyrightNote: '越南國家寶物數位百科平台 (專案 D05)。',
    },
  },
  ja: {
    brandTitle: 'ベトナム国宝アーカイブ',
    brandSub: 'デジタル文化遺産百科事典・博物館マップ · D05',
    nav: {
      home: 'ホーム',
      encyclopedia: '百科事典',
      map: '遺産マップ',
      timeline: '歴史年表',
      museums: '博物館・史跡',
      gallery: '画像ギャラリー',
      news: 'ニュース・研究',
      sources: '参考文献',
      about: '概要',
      admin: '管理',
    },
    hero: {
      kicker: '国家遺産ポータル · 文化遺産法第45/2024/QH15号',
      title: 'ベトナム国宝',
      subtitle: 'ベトナム民族の歴史的足跡と永続する文化的価値を探求する。',
      ctaExplore: '百科事典を見る',
      ctaMap: 'インタラクティブ地図を開く',
    },
    stats: {
      officialTotalLabel: '公式認定総数',
      officialTotalSub: '2026年2月時点で第14次まで計357件/群',
      storedTotalLabel: 'プラットフォーム収録数',
      storedTotalSub: '本データベース登録済みの独立資料数',
      verifiedTotalLabel: '検証済み資料',
      verifiedTotalSub: '一次史料および首相決定書と照合済み',
      keepersLabel: '収蔵博物館・史跡',
    },
    labels: {
      nationalTreasure: 'ベトナム国宝',
      representativeHeritage: '代表的な遺産資料',
      searchPlaceholder: '国宝名、年代、博物館、認定決定を検索...',
      openAssistant: '遺産アシスタント',
      close: '閉じる',
      viewDetail: '詳細資料を見る',
      quickView: 'クイック表示',
      dating: '年代',
      period: '歴史時代',
      culture: '文化圏',
      material: '材質',
      keeper: '収蔵機関',
      discoveryPlace: '出土地',
      decision: '認定決定',
      sources: '出典・参考文献',
      unverifiedNotice: '未検証データ',
      translationDisclaimer: '編集・補助翻訳であり学術査読済みではありません。固有名詞はベトナム語原文を保持しています。',
      all: 'すべて',
      filter: '絞り込み',
      reset: 'リセット',
      missingImageNotice: '実物写真はまだ画像アーカイブに登録されていません',
    },
    assistant: {
      title: 'ベトナム遺産アシスタント',
      subtitle: '検証済み国宝・博物館データベースに基づくRAG検索',
      inputPlaceholder: 'ゴックルー銅鼓、九鼎、博物館について質問...',
      send: '送信',
      unavailableTitle: 'AIアシスタントは現在利用できません',
      unavailableBody: 'サーバーに OPENAI_API_KEY が未設定ですが、百科事典・地図機能はすべて利用可能です。',
      suggestedQuestions: [
        'ゴックルー銅鼓はどの回で国宝に認定され、どこに所蔵されていますか？',
        'ヴォーカン碑と文廟の進士碑の歴史的価値を比較してください。',
        'ダナン・チャム彫刻博物館に所蔵されている国宝はどれですか？',
      ],
    },
    map: {
      title: 'ベトナム国宝 収蔵機関インタラクティブマップ',
      providerLabel: 'ベースマップ',
      resetView: 'ベトナム全体を表示',
      reloadTiles: 'タイルを再読込',
      tileError: '地図タイルを読み込めませんでした。',
      offlineMarkersOnly: 'ベースマップがオフラインですが、検証済み収蔵機関マーカーは表示されています。',
      discoveryVsHoldingNote: '公的博物館・史跡の公開座標のみを表示し、個人宅や非公開収蔵庫は掲載しません。',
    },
    footer: {
      legalBasis: '法的根拠：文化遺産法第45/2024/QH15号およびベトナム文化遺産局公式名簿。',
      copyrightNote: 'ベトナム国宝デジタル百科事典 (プロジェクト D05)。',
    },
  },
  ko: {
    brandTitle: '베트남 국보 디지털 백과',
    brandSub: '디지털 문화유산 백과사전 및 박물관 지도 · D05',
    nav: {
      home: '홈',
      encyclopedia: '백과사전',
      map: '유산 지도',
      timeline: '역사 연표',
      museums: '박물관 및 유적',
      gallery: '이미지 아카이브',
      news: '소식 및 연구',
      sources: '참고문헌',
      about: '소개',
      admin: '관리자',
    },
    hero: {
      kicker: '국가 유산 포털 · 문화유산법 제45/2024/QH15호',
      title: '베트남 국보',
      subtitle: '베트남 민족의 영속적인 역사적 발자취와 문화적 가치를 탐구하십시오.',
      ctaExplore: '백과사전 탐색',
      ctaMap: '인터랙티브 지도 열기',
    },
    stats: {
      officialTotalLabel: '공식 지정 총수',
      officialTotalSub: '2026년 2월 기준 14차례 총 357건/군',
      storedTotalLabel: '플랫폼 수록 기록',
      storedTotalSub: '데이터베이스에 등록된 독립 유물 기록',
      verifiedTotalLabel: '검증 완료 기록',
      verifiedTotalSub: '공식 출처 및 총리 결정문 대조 완료',
      keepersLabel: '소장 박물관 및 유적지',
    },
    labels: {
      nationalTreasure: '베트남 국보',
      representativeHeritage: '대표 유산 유물',
      searchPlaceholder: '국보명, 연대, 박물관, 지정 결정 검색...',
      openAssistant: '유산 도우미',
      close: '닫기',
      viewDetail: '상세 기록 보기',
      quickView: '미리보기',
      dating: '연대',
      period: '역사 시대',
      culture: '문화권',
      material: '재질',
      keeper: '소장 기관',
      discoveryPlace: '출토지',
      decision: '지정 결정문',
      sources: '참고 자료',
      unverifiedNotice: '미확인 데이터',
      translationDisclaimer: '편집 번역본이며 학술 검증된 번역이 아닙니다. 공식 고유명사는 베트남어 원문을 유지합니다.',
      all: '전체',
      filter: '필터',
      reset: '초기화',
      missingImageNotice: '실물 사진이 아직 이미지 아카이브에 업로드되지 않았습니다',
    },
    assistant: {
      title: '베트남 유산 AI 도우미',
      subtitle: '검증된 국보 및 박물관 데이터베이스 기반 RAG 검색',
      inputPlaceholder: '응옥루 동고, 구정, 박물관 소장품에 대해 질문하세요...',
      send: '전송',
      unavailableTitle: 'AI 도우미를 사용할 수 없습니다',
      unavailableBody: '서버에 OPENAI_API_KEY가 설정되지 않았습니다. 백과사전과 지도 기능은 정상 작동합니다.',
      suggestedQuestions: [
        '응옥루 동고는 몇 차에 국보로 지정되었으며 어디에 소장되어 있나요?',
        '보깐 비석과 문묘 진사비의 역사적 가치를 비교해 주세요.',
        '다낭 참 조각 박물관에 소장된 국보에는 무엇이 있나요?',
      ],
    },
    map: {
      title: '베트남 국보 소장 기관 인터랙티브 지도',
      providerLabel: '배경 지도',
      resetView: '베트남 전체 보기',
      reloadTiles: '지도 다시 불러오기',
      tileError: '현재 지도 타일을 불러올 수 없습니다.',
      offlineMarkersOnly: '배경 지도가 오프라인이지만 검증된 소장 기관 마커는 유지됩니다.',
      discoveryVsHoldingNote: '공개된 박물관 및 유적지 좌표만 표시하며 개인 주소나 민감한 수장고 위치는 표시하지 않습니다.',
    },
    footer: {
      legalBasis: '법적 근거: 문화유산법 제45/2024/QH15호 및 베트남 문화유산국 공식 목록.',
      copyrightNote: '베트남 국보 디지털 백과사전 (프로젝트 D05).',
    },
  },
  es: {
    brandTitle: 'TESOROS NACIONALES DE VIETNAM',
    brandSub: 'Enciclopedia Digital y Mapa Museográfico · D05',
    nav: {
      home: 'Inicio',
      encyclopedia: 'Enciclopedia',
      map: 'Mapa del Patrimonio',
      timeline: 'Cronología',
      museums: 'Museos y Sitios',
      gallery: 'Archivo Visual',
      news: 'Noticias e Investigación',
      sources: 'Referencias',
      about: 'Acerca de',
      admin: 'Administración',
    },
    hero: {
      kicker: 'PORTAL DEL PATRIMONIO NACIONAL · LEY N.º 45/2024/QH15',
      title: 'TESOROS NACIONALES DE VIETNAM',
      subtitle: 'Explora las huellas históricas y los valores culturales perdurables de la nación vietnamita.',
      ctaExplore: 'Explorar Enciclopedia',
      ctaMap: 'Abrir Mapa Interactivo',
    },
    stats: {
      officialTotalLabel: 'Reconocidos oficialmente',
      officialTotalSub: '357 tesoros y conjuntos en 14 tandas (feb. 2026)',
      storedTotalLabel: 'Registros en la plataforma',
      storedTotalSub: 'Fichas independientes catalogadas en esta base',
      verifiedTotalLabel: 'Registros verificados',
      verifiedTotalSub: 'Contrastados con fuentes oficiales y decretos',
      keepersLabel: 'Museos y Sitios de custodia',
    },
    labels: {
      nationalTreasure: 'TESORO NACIONAL',
      representativeHeritage: 'BIEN PATRIMONIAL REPRESENTATIVO',
      searchPlaceholder: 'Buscar tesoro, datación, museo, decreto...',
      openAssistant: 'Asistente de Patrimonio',
      close: 'Cerrar',
      viewDetail: 'Ver ficha completa',
      quickView: 'Vista rápida',
      dating: 'Datación',
      period: 'Período histórico',
      culture: 'Cultura',
      material: 'Material',
      keeper: 'Institución depositaria',
      discoveryPlace: 'Lugar de hallazgo',
      decision: 'Decisión de reconocimiento',
      sources: 'Referencias',
      unverifiedNotice: 'Dato sin verificar',
      translationDisclaimer: 'Traducción editorial no certificada académicamente; los nombres propios oficiales permanecen en vietnamita.',
      all: 'Todos',
      filter: 'Filtrar',
      reset: 'Restablecer',
      missingImageNotice: 'Fotografía original pendiente de carga en el archivo visual',
    },
    assistant: {
      title: 'ASISTENTE DE PATRIMONIO DE VIETNAM',
      subtitle: 'Consulta RAG basada en la base verificada de tesoros y museos',
      inputPlaceholder: 'Pregunta sobre el tambor de Ngoc Lu, los Nueve Trípodes...',
      send: 'Enviar',
      unavailableTitle: 'Asistente IA no disponible',
      unavailableBody: 'OPENAI_API_KEY no está configurada en el servidor. La enciclopedia y el mapa siguen plenamente operativos.',
      suggestedQuestions: [
        '¿En qué tanda se reconoció el tambor de bronce de Ngoc Lu y dónde se conserva?',
        'Compara la estela de Vo Canh con las 82 estelas doctorales del Templo de la Literatura.',
        '¿Qué Tesoros Nacionales alberga el Museo de Escultura Cham de Da Nang?',
      ],
    },
    map: {
      title: 'Mapa Geográfico Interactivo de Instituciones Depositarias',
      providerLabel: 'Mapa base',
      resetView: 'Vista completa de Vietnam',
      reloadTiles: 'Recargar mapa',
      tileError: 'No se pudieron cargar los mosaicos del proveedor actual.',
      offlineMarkersOnly: 'Servicios de mapa base fuera de línea; se conservan los marcadores verificados.',
      discoveryVsHoldingNote: 'Muestra coordenadas públicas verificadas de museos y sitios patrimoniales; excluye domicilios privados.',
    },
    footer: {
      legalBasis: 'Base jurídica: Ley de Patrimonio Cultural n.º 45/2024/QH15 y Departamento de Patrimonio Cultural.',
      copyrightNote: 'Enciclopedia Digital del Patrimonio Nacional (Proyecto D05).',
    },
  },
  ru: {
    brandTitle: 'НАЦИОНАЛЬНЫЕ СОКРОВИЩА ВЬЕТНАМА',
    brandSub: 'Цифровая энциклопедия и карта музеев · D05',
    nav: {
      home: 'Главная',
      encyclopedia: 'Энциклопедия',
      map: 'Карта наследия',
      timeline: 'Хронология',
      museums: 'Музеи и памятники',
      gallery: 'Фотоархив',
      news: 'Новости и исследования',
      sources: 'Источники',
      about: 'О проекте',
      admin: 'Управление',
    },
    hero: {
      kicker: 'ПОРТАЛ НАЦИОНАЛЬНОГО НАСЛЕДИЯ · ЗАКОН № 45/2024/QH15',
      title: 'НАЦИОНАЛЬНЫЕ СОКРОВИЩА ВЬЕТНАМА',
      subtitle: 'Откройте вехи истории и непреходящие культурные ценности вьетнамского народа.',
      ctaExplore: 'Перейти в энциклопедию',
      ctaMap: 'Открыть интерактивную карту',
    },
    stats: {
      officialTotalLabel: 'Официально признано',
      officialTotalSub: '357 сокровищ и групп за 14 этапов (февр. 2026)',
      storedTotalLabel: 'Записей на платформе',
      storedTotalSub: 'Независимых карточек в базе данных',
      verifiedTotalLabel: 'Проверенных записей',
      verifiedTotalSub: 'Сверено с официальными источниками и указами',
      keepersLabel: 'Музеев и памятников',
    },
    labels: {
      nationalTreasure: 'НАЦИОНАЛЬНОЕ СОКРОВИЩЕ',
      representativeHeritage: 'ЗНАЧИМЫЙ ПАМЯТНИК НАСЛЕДИЯ',
      searchPlaceholder: 'Поиск артефакта, датировки, музея, указа...',
      openAssistant: 'Помощник по наследию',
      close: 'Закрыть',
      viewDetail: 'Открыть полное досье',
      quickView: 'Быстрый просмотр',
      dating: 'Датировка',
      period: 'Исторический период',
      culture: 'Культура',
      material: 'Материал',
      keeper: 'Место хранения',
      discoveryPlace: 'Место находки',
      decision: 'Решение о признании',
      sources: 'Источники',
      unverifiedNotice: 'Нет подтвержденных данных',
      translationDisclaimer: 'Редакционный перевод без академической сертификации; официальные названия даны на вьетнамском.',
      all: 'Все',
      filter: 'Фильтр',
      reset: 'Сбросить',
      missingImageNotice: 'Оригинальная фотография экспоната еще не загружена в архив',
    },
    assistant: {
      title: 'ПОМОЩНИК ПО НАСЛЕДИЮ ВЬЕТНАМА',
      subtitle: 'RAG-поиск по проверенной базе сокровищ, музеев и указов',
      inputPlaceholder: 'Спросите о барабане Нгоклу, Девяти треножниках, музеях...',
      send: 'Отправить',
      unavailableTitle: 'ИИ-помощник недоступен',
      unavailableBody: 'OPENAI_API_KEY не настроен на сервере. Энциклопедия и карта работают в полном объеме.',
      suggestedQuestions: [
        'Когда бронзовый барабан Нгоклу был признан сокровищем и где он хранится?',
        'Сравните историческое значение стелы Вокань и стел Храма Литературы.',
        'Какие национальные сокровища хранятся в Музее тямской скульптуры в Дананге?',
      ],
    },
    map: {
      title: 'Интерактивная карта мест хранения национальных сокровищ',
      providerLabel: 'Картографическая подложка',
      resetView: 'Весь Вьетнам',
      reloadTiles: 'Перезагрузить карту',
      tileError: 'Не удалось загрузить тайлы выбранного провайдера.',
      offlineMarkersOnly: 'Сервисы подложки недоступны; маркеры учреждений сохранены.',
      discoveryVsHoldingNote: 'Показаны только проверенные публичные координаты музеев и памятников.',
    },
    footer: {
      legalBasis: 'Правовая основа: Закон о культурном наследии № 45/2024/QH15 и Департамент культурного наследия.',
      copyrightNote: 'Цифровая энциклопедия наследия (Проект D05).',
    },
  },
  de: {
    brandTitle: 'NATIONALE SCHÄTZE VIETNAMS',
    brandSub: 'Digitale Enzyklopädie & Museumskarte · D05',
    nav: {
      home: 'Startseite',
      encyclopedia: 'Enzyklopädie',
      map: 'Kulturerbe-Karte',
      timeline: 'Zeitstrahl',
      museums: 'Museen & Stätten',
      gallery: 'Bildarchiv',
      news: 'Aktuelles & Forschung',
      sources: 'Quellen',
      about: 'Über das Projekt',
      admin: 'Verwaltung',
    },
    hero: {
      kicker: 'NATIONALES KULTURERBE-PORTAL · GESETZ NR. 45/2024/QH15',
      title: 'NATIONALE SCHÄTZE VIETNAMS',
      subtitle: 'Entdecken Sie die historischen Zeugnisse und beständigen kulturellen Werte Vietnams.',
      ctaExplore: 'Enzyklopädie durchsuchen',
      ctaMap: 'Interaktive Karte öffnen',
    },
    stats: {
      officialTotalLabel: 'Offiziell anerkannt',
      officialTotalSub: '357 Schätze & Gruppen in 14 Runden (Stand Feb. 2026)',
      storedTotalLabel: 'Erfasste Datensätze',
      storedTotalSub: 'Eigenständige Einträge in dieser Datenbank',
      verifiedTotalLabel: 'Geprüfte Datensätze',
      verifiedTotalSub: 'Mit Primärquellen und Regierungsbeschlüssen abgeglichen',
      keepersLabel: 'Museen & Gedenkstätten',
    },
    labels: {
      nationalTreasure: 'NATIONALER SCHATZ',
      representativeHeritage: 'REPRÄSENTATIVES KULTURGUT',
      searchPlaceholder: 'Schatz, Datierung, Museum, Beschluss suchen...',
      openAssistant: 'Kulturerbe-Assistent',
      close: 'Schließen',
      viewDetail: 'Vollständige Akte',
      quickView: 'Kurzansicht',
      dating: 'Datierung',
      period: 'Epoche',
      culture: 'Kultur',
      material: 'Material',
      keeper: 'Aufbewahrungsort',
      discoveryPlace: 'Fundort',
      decision: 'Anerkennungsbeschluss',
      sources: 'Quellen',
      unverifiedNotice: 'Keine verifizierten Daten',
      translationDisclaimer: 'Redaktionelle Übersetzung ohne akademische Begutachtung; offizielle Eigennamen bleiben im vietnamesischen Original.',
      all: 'Alle',
      filter: 'Filter',
      reset: 'Zurücksetzen',
      missingImageNotice: 'Originalfoto noch nicht im Bildinventar hochgeladen',
    },
    assistant: {
      title: 'VIETNAM KULTURERBE-ASSISTENT',
      subtitle: 'RAG-Recherche auf Basis verifizierter Schatz- und Museumsdaten',
      inputPlaceholder: 'Fragen zur Ngoc-Lu-Bronzetrommel, den Neun Urnen...',
      send: 'Senden',
      unavailableTitle: 'KI-Assistent nicht verfügbar',
      unavailableBody: 'OPENAI_API_KEY ist auf dem Server nicht konfiguriert. Enzyklopädie und Karte funktionieren uneingeschränkt.',
      suggestedQuestions: [
        'Wann wurde die Bronzetrommel von Ngoc Lu anerkannt und wo wird sie aufbewahrt?',
        'Vergleichen Sie die Stele von Vo Canh mit den 82 Doktorstelen im Literaturtempel.',
        'Welche Nationalschätze befinden sich im Cham-Skulpturenmuseum Da Nang?',
      ],
    },
    map: {
      title: 'Interaktive Karte der Aufbewahrungsorte',
      providerLabel: 'Basiskarte',
      resetView: 'Ganz Vietnam',
      reloadTiles: 'Karte neu laden',
      tileError: 'Kartenkacheln konnten nicht geladen werden.',
      offlineMarkersOnly: 'Basiskarte offline; verifizierte Museumsmarkierungen bleiben erhalten.',
      discoveryVsHoldingNote: 'Zeigt nur geprüfte öffentliche Koordinaten von Museen und Kulturstätten; keine Privatadressen.',
    },
    footer: {
      legalBasis: 'Rechtsgrundlage: Kulturerbegesetz Nr. 45/2024/QH15 und Amt für Kulturerbe (dsvh.gov.vn).',
      copyrightNote: 'Digitale Enzyklopädie & Kulturerbe-Karte (Projekt D05).',
    },
  },
};

export const INITIAL_TRANSLATIONS: TranslationRecord[] = TREASURES.flatMap((t) => [
  {
    id: `tr-${t.id}-vi`,
    entityType: 'treasure',
    entityId: t.id,
    locale: 'vi',
    translatedTitle: t.officialName,
    translatedSummary: t.summary,
    translatedNote: 'Bản gốc tiếng Việt chuẩn hóa theo hồ sơ công bố chính thức.',
    academicReviewStatus: 'verified_academic',
  },
  {
    id: `tr-${t.id}-en`,
    entityType: 'treasure',
    entityId: t.id,
    locale: 'en',
    translatedTitle: `${t.officialName}`,
    translatedSummary: t.summary,
    translatedNote: 'Metadata mapped for English interface; full scholarly translation pending academic review.',
    academicReviewStatus: 'machine_or_editorial_unreviewed',
  },
]);

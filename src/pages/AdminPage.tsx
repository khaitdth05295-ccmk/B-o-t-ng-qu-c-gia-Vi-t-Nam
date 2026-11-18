import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Download,
  Image as ImageIcon,
  KeyRound,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Upload,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useHeritage } from '../context/HeritageContext';
import {
  adminCreateBackup,
  adminDeleteTreasure,
  adminImportTreasures,
  adminRescanImages,
  adminUpdateImagePermission,
  adminUploadImage,
  adminUpsertPermission,
  adminUpsertTreasure,
  verifyAdminKey,
} from '../services/api';
import type { PublicationPermissionStatus, TreasureRecord } from '../types/heritage';

export const AdminPage: React.FC = () => {
  const { data, reloadData } = useHeritage();
  const [searchParams] = useSearchParams();
  const [adminKey, setAdminKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const initialTab = searchParams.get('tab') === 'images' ? 'images' : 'records';
  const [activeTab, setActiveTab] = useState<'records' | 'images' | 'permissions' | 'backup'>(
    initialTab,
  );

  // Add / Edit Treasure modal state
  const [editingRecord, setEditingRecord] = useState<TreasureRecord | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // Upload image form state
  const [uploadTreasureId, setUploadTreasureId] = useState('bv-01');
  const [uploadAngle, setUploadAngle] = useState<'representative' | 'full' | 'closeup' | 'supplemental'>('representative');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadSource, setUploadSource] = useState('');
  const [uploadRightsOwner, setUploadRightsOwner] = useState('');
  const [uploadPermStatus, setUploadPermStatus] =
    useState<PublicationPermissionStatus>('unconfirmed');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Delete confirmation modal
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!data) return null;

  const { stats, treasures, keepers, images, permissions, imageAudit, adminConfigured } = data;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      await verifyAdminKey(adminKey);
      setAuthenticated(true);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Xác thực thất bại.');
    }
  };

  const handleCreateNewTemplate = () => {
    const newId = `bv-custom-${Date.now()}`;
    setIsNewRecord(true);
    setEditingRecord({
      id: newId,
      code: `VN-BVQG-${String(treasures.length + 1).padStart(3, '0')}`,
      officialName: '',
      otherNames: [],
      recognitionStatus: 'national_treasure',
      batchNumber: null,
      decisionId: null,
      decisionNumber: '',
      decisionDate: '',
      dating: '',
      periodIds: ['period-chuyen-tiep'],
      cultureId: data.cultures[0]?.id || 'culture-dai-viet',
      dynasty: '',
      materialIds: [data.materials[0]?.id || 'mat-bronze'],
      artifactType: '',
      discoveryPlace: '',
      currentKeeperId: keepers[0]?.id || 'keeper-btlsqg',
      exhibitionPlace: '',
      summary: '',
      sections: {
        overview: 'Chưa có dữ liệu xác minh',
        formationHistory: 'Chưa có dữ liệu xác minh',
        origin: 'Chưa có dữ liệu xác minh',
        discoveryProcess: 'Chưa có dữ liệu xác minh',
        historicalContext: 'Chưa có dữ liệu xác minh',
        datingDetail: 'Chưa có dữ liệu xác minh',
        cultureAndDynastyDetail: 'Chưa có dữ liệu xác minh',
        physicalCharacteristics: 'Chưa có dữ liệu xác minh',
        structure: 'Chưa có dữ liệu xác minh',
        materialAnalysis: 'Chưa có dữ liệu xác minh',
        craftingTechnique: 'Chưa có dữ liệu xác minh',
        motifsAndSymbols: 'Chưa có dữ liệu xác minh',
        inscriptionsAndMarks: 'Chưa có dữ liệu xác minh',
        historicalValue: 'Chưa có dữ liệu xác minh',
        culturalValue: 'Chưa có dữ liệu xác minh',
        artisticValue: 'Chưa có dữ liệu xác minh',
        archaeologicalValue: 'Chưa có dữ liệu xác minh',
        scientificValue: 'Chưa có dữ liệu xác minh',
        recognitionProcess: 'Chưa có dữ liệu xác minh',
        recognitionDecisionSummary: 'Chưa có dữ liệu xác minh',
        currentKeeperDetail: 'Chưa có dữ liệu xác minh',
        exhibitionStatus: 'Chưa có dữ liệu xác minh',
        conservationInfo: 'Chưa có dữ liệu xác minh',
        researchDocuments: 'Chưa có dữ liệu xác minh',
      },
      dublinCore: {
        title: '',
        creator: 'Chưa có dữ liệu xác minh',
        subject: '',
        description: '',
        publisher: 'Cổng Di sản D05',
        contributor: 'Cục Di sản văn hóa',
        date: '',
        type: 'PhysicalObject',
        format: '',
        identifier: '',
        source: '',
        language: 'vi',
        relation: '',
        coverage: '',
        rights: 'Chưa xác nhận',
      },
      archival: {
        currentHoldingInstitution: keepers[0]?.officialName || '',
        holdingAtDocumentationTime: keepers[0]?.officialName || '',
        displayedCopyType: 'original',
        originalCondition: 'unknown',
        registrationNumber: 'Chưa có dữ liệu xác minh',
        permissionGrantor: 'Chưa xác nhận',
        permittedScope: 'Chưa xác nhận',
        unpublishedSections: 'Không',
        verificationLevel: 'partial',
        imageFiles: [],
        documentationSource: '',
      },
      sourceIds: ['src-01'],
      relatedTreasureIds: [],
      permissionId: 'perm-01',
      isPublished: false,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
  };

  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    try {
      const normalized = {
        ...editingRecord,
        dublinCore: {
          ...editingRecord.dublinCore,
          title: editingRecord.dublinCore.title || editingRecord.officialName,
          identifier: editingRecord.dublinCore.identifier || editingRecord.code,
          description: editingRecord.dublinCore.description || editingRecord.summary,
          date: editingRecord.dublinCore.date || editingRecord.dating,
        },
      };
      await adminUpsertTreasure(adminKey, normalized, isNewRecord);
      setStatusMessage(`Đã lưu hồ sơ "${normalized.officialName}" thành công.`);
      setEditingRecord(null);
      await reloadData();
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Lỗi lưu hồ sơ.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await adminDeleteTreasure(adminKey, confirmDeleteId);
      setStatusMessage('Đã xóa hồ sơ khỏi cơ sở dữ liệu.');
      setConfirmDeleteId(null);
      await reloadData();
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Lỗi xóa hồ sơ.');
    }
  };

  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    try {
      const fd = new FormData();
      fd.append('file', selectedFile);
      fd.append('treasureId', uploadTreasureId);
      fd.append('angle', uploadAngle);
      fd.append('caption', uploadCaption);
      fd.append('source', uploadSource);
      fd.append('rightsOwner', uploadRightsOwner);
      fd.append('permissionStatus', uploadPermStatus);
      await adminUploadImage(adminKey, fd);
      setStatusMessage('Đã tải ảnh hiện vật lên và cập nhật bảng kiểm kê.');
      setSelectedFile(null);
      await reloadData();
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Lỗi tải ảnh lên.');
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const res = await fetch(`/api/admin/export?format=${format}`, {
        headers: { 'x-admin-key': adminKey },
      });
      if (!res.ok) throw new Error('Không thể xuất dữ liệu.');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vietnam-national-treasures-d05.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Lỗi xuất tệp.');
    }
  };

  const handleImportJsonFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const list = Array.isArray(parsed) ? parsed : parsed.treasures || [];
      const res = await adminImportTreasures(adminKey, list);
      setStatusMessage(`Đã nhập ${res.importedCount} hồ sơ bảo vật vào cơ sở dữ liệu.`);
      await reloadData();
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Tệp JSON nhập không hợp lệ.');
    }
  };

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="border border-[#D8CEB8] bg-white p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3 border-b border-[#EFE9DC] pb-4">
            <span className="flex h-10 w-10 items-center justify-center bg-[#0F1E33] text-[#DFC484]">
              <KeyRound className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#0F1E33]">
                Khu vực Quản trị & Bảo mật
              </h1>
              <p className="text-xs text-[#5B3E2A]">
                Xác thực khóa ADMIN_ACCESS_KEY phía máy chủ
              </p>
            </div>
          </div>

          {!adminConfigured && (
            <div className="border border-[#B45309]/40 bg-[#FEF3C7] p-3 text-xs text-[#78350F] space-y-1">
              <p className="font-semibold">Biến môi trường ADMIN_ACCESS_KEY chưa được cấu hình</p>
              <p>
                Vui lòng thiết lập <code className="font-mono">ADMIN_ACCESS_KEY</code> trong Secrets / môi trường máy chủ để mở khóa thao tác thêm, sửa, xóa, tải ảnh và xuất dữ liệu.
              </p>
            </div>
          )}

          {authError && (
            <div className="border border-[#9A3412]/40 bg-[#FEE2E2] p-3 text-xs text-[#9A3412]">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#3A2618] mb-1.5">
                Khóa truy cập quản trị (ADMIN_ACCESS_KEY)
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Nhập khóa quản trị..."
                className="w-full border border-[#D8CEB8] px-3 py-2 text-sm focus:outline-none focus:border-[#0F1E33]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0F1E33] py-2.5 text-xs font-semibold text-[#FAF8F3] hover:bg-[#182D49] cursor-pointer"
            >
              Xác thực máy chủ & Mở bảng quản trị
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D8CEB8] pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
            Quản trị cơ sở dữ liệu D05 · Đã xác thực máy chủ
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-[#0F1E33]">
            Bảng điều khiển Biên tập, Kiểm kê & Quyền công bố
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            setAuthenticated(false);
            setAdminKey('');
          }}
          className="border border-[#D8CEB8] bg-white px-3 py-1.5 text-xs font-medium text-[#0F1E33] cursor-pointer"
        >
          Khóa phiên quản trị
        </button>
      </div>

      {statusMessage && (
        <div className="border border-[#14532D]/40 bg-[#ECFDF5] px-4 py-3 text-xs text-[#14532D] flex items-center justify-between">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {statusMessage}
          </span>
          <button type="button" onClick={() => setStatusMessage(null)} className="underline cursor-pointer">
            Đóng
          </button>
        </div>
      )}

      {/* Section XV: 9 Independent Admin Statistics */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          ['Tổng số bản ghi (trên nền tảng)', stats.platformStoredTotal],
          ['Số đã nhập (BVQG / Di sản)', `${stats.nationalTreasuresStored} / ${stats.representativeArtifactsStored}`],
          ['Số hoàn chỉnh (đủ trường + nguồn + quyền)', stats.completeRecords],
          ['Số đã xác minh', stats.verifiedRecords],
          ['Số đã công bố', stats.publishedRecords],
          ['Số chờ bổ sung', stats.pendingCompletion],
          ['Số thiếu ảnh', stats.missingImageCount],
          ['Số thiếu nguồn', stats.missingSourceCount],
          ['Số chờ xác nhận quyền', stats.pendingPermissionCount],
          ['Công nhận toàn quốc (Mốc 02/2026)', `${stats.officialRecognizedTotal} (${stats.officialBatchCount} đợt)`],
        ].map(([label, val]) => (
          <div key={String(label)} className="border border-[#D8CEB8] bg-white p-3.5">
            <p className="text-[11px] text-[#5B3E2A] leading-snug">{label}</p>
            <p className="mt-1 font-mono text-xl font-bold text-[#0F1E33] tabular-nums">{val}</p>
          </div>
        ))}
      </section>

      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#D8CEB8] pb-3">
        {[
          { id: 'records', label: 'Hồ sơ Bảo vật & Hiện vật', icon: Database },
          { id: 'images', label: 'Kho ảnh & Kiểm kê tệp', icon: ImageIcon },
          { id: 'permissions', label: 'Phê duyệt & Quyền công bố', icon: ShieldCheck },
          { id: 'backup', label: 'Sao lưu, Nhập & Xuất JSON/CSV', icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold border cursor-pointer ${
                active
                  ? 'border-[#0F1E33] bg-[#0F1E33] text-[#FAF8F3]'
                  : 'border-[#D8CEB8] bg-white text-[#1E242B]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Treasures CRUD */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-2xl font-semibold text-[#0F1E33]">
              Danh sách hồ sơ ({treasures.length})
            </h2>
            <button
              type="button"
              onClick={handleCreateNewTemplate}
              className="inline-flex items-center gap-1.5 bg-[#0F1E33] px-4 py-2 text-xs font-semibold text-[#FAF8F3] cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-[#DFC484]" />
              <span>Thêm hồ sơ mới</span>
            </button>
          </div>

          <div className="border border-[#D8CEB8] bg-white overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="bg-[#F3EFE6] border-b border-[#D8CEB8]">
                <tr>
                  <th className="px-3 py-2.5 text-left font-semibold text-[#3A2618]">Mã</th>
                  <th className="px-3 py-2.5 text-left font-semibold text-[#3A2618]">Tên chính thức</th>
                  <th className="px-3 py-2.5 text-left font-semibold text-[#3A2618]">Phân loại</th>
                  <th className="px-3 py-2.5 text-left font-semibold text-[#3A2618]">Lưu giữ</th>
                  <th className="px-3 py-2.5 text-left font-semibold text-[#3A2618]">Kiểm chứng</th>
                  <th className="px-3 py-2.5 text-right font-semibold text-[#3A2618]">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE9DC]">
                {treasures.map((tr) => (
                  <tr key={tr.id} className="hover:bg-[#FAF8F3]">
                    <td className="px-3 py-2.5 font-mono text-[#7A541C]">{tr.code}</td>
                    <td className="px-3 py-2.5 font-semibold text-[#0F1E33]">{tr.officialName}</td>
                    <td className="px-3 py-2.5">
                      {tr.recognitionStatus === 'national_treasure'
                        ? `Bảo vật QG (Đợt ${tr.batchNumber ?? '?'})`
                        : 'Di sản tiêu biểu'}
                    </td>
                    <td className="px-3 py-2.5">{tr.archival.currentHoldingInstitution}</td>
                    <td className="px-3 py-2.5">{tr.archival.verificationLevel}</td>
                    <td className="px-3 py-2.5 text-right space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewRecord(false);
                          setEditingRecord(tr);
                        }}
                        className="border border-[#D8CEB8] px-2.5 py-1 text-[11px] font-medium text-[#0F1E33] hover:bg-[#F3EFE6] cursor-pointer"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(tr.id)}
                        className="border border-[#9A3412]/40 px-2.5 py-1 text-[11px] font-medium text-[#9A3412] hover:bg-[#FEE2E2] cursor-pointer"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Image Upload & Inventory Audit */}
      {activeTab === 'images' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleUploadImage}
            className="lg:col-span-5 border border-[#D8CEB8] bg-white p-5 space-y-4 text-xs"
          >
            <h2 className="font-serif text-xl font-semibold text-[#0F1E33]">
              Tải ảnh hiện vật thật (JPG, PNG, WEBP)
            </h2>
            <div>
              <label className="block font-semibold text-[#3A2618] mb-1">Gắn với hồ sơ</label>
              <select
                value={uploadTreasureId}
                onChange={(e) => setUploadTreasureId(e.target.value)}
                className="w-full border border-[#D8CEB8] px-2.5 py-2 bg-white"
              >
                {treasures.map((tr) => (
                  <option key={tr.id} value={tr.id}>
                    {tr.code} · {tr.officialName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#3A2618] mb-1">Góc chụp</label>
              <select
                value={uploadAngle}
                onChange={(e) => setUploadAngle(e.target.value as typeof uploadAngle)}
                className="w-full border border-[#D8CEB8] px-2.5 py-2 bg-white"
              >
                <option value="representative">Ảnh đại diện</option>
                <option value="full">Ảnh toàn cảnh</option>
                <option value="closeup">Ảnh cận cảnh</option>
                <option value="supplemental">Góc chụp bổ sung</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#3A2618] mb-1">Chú thích ảnh</label>
              <input
                type="text"
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                className="w-full border border-[#D8CEB8] px-2.5 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#3A2618] mb-1">Nguồn ảnh</label>
              <input
                type="text"
                value={uploadSource}
                onChange={(e) => setUploadSource(e.target.value)}
                placeholder="VD: Ảnh chụp thực địa / Bảo tàng Lịch sử Quốc gia..."
                className="w-full border border-[#D8CEB8] px-2.5 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#3A2618] mb-1">Chủ sở hữu bản quyền ảnh</label>
              <input
                type="text"
                value={uploadRightsOwner}
                onChange={(e) => setUploadRightsOwner(e.target.value)}
                className="w-full border border-[#D8CEB8] px-2.5 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#3A2618] mb-1">Trạng thái quyền công bố ảnh</label>
              <select
                value={uploadPermStatus}
                onChange={(e) => setUploadPermStatus(e.target.value as PublicationPermissionStatus)}
                className="w-full border border-[#D8CEB8] px-2.5 py-2 bg-white"
              >
                <option value="permission_granted">Đã có người cho phép công bố</option>
                <option value="official_public_no_separate_permission">Tư liệu đã công bố chính thức</option>
                <option value="unconfirmed">Chưa có xác nhận</option>
                <option value="not_permitted">Không được phép công bố</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#3A2618] mb-1">Tệp ảnh</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                required
                className="w-full"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0F1E33] py-2.5 font-semibold text-[#FAF8F3] cursor-pointer"
            >
              <Upload className="h-4 w-4 text-[#DFC484]" />
              <span>Tải ảnh lên & Mapping vào hồ sơ</span>
            </button>
          </form>

          <div className="lg:col-span-7 border border-[#D8CEB8] bg-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold text-[#0F1E33]">
                Kiểm kê ảnh ({images.length} mục)
              </h2>
              <button
                type="button"
                onClick={async () => {
                  await adminRescanImages(adminKey);
                  setStatusMessage('Đã quét lại thư mục ảnh và cập nhật trạng thái.');
                  await reloadData();
                }}
                className="inline-flex items-center gap-1.5 border border-[#D8CEB8] px-3 py-1.5 text-xs font-medium cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Quét lại thư mục ảnh</span>
              </button>
            </div>

            {imageAudit && (
              <p className="text-xs text-[#5B3E2A]">
                Đã quét trên đĩa: <strong>{imageAudit.scannedTotal}</strong> · Khớp hồ sơ:{' '}
                <strong>{imageAudit.verifiedMappedCount}</strong> · Trùng hash:{' '}
                <strong>{imageAudit.duplicates.length}</strong> · Chưa gắn:{' '}
                <strong>{imageAudit.unusedFiles.length}</strong>
              </p>
            )}

            <div className="max-h-[420px] overflow-y-auto divide-y divide-[#EFE9DC] text-xs">
              {images.map((img) => (
                <div key={img.id} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-mono font-semibold text-[#0F1E33] truncate">
                      {img.expectedFilename} ({img.fileStatus})
                    </p>
                    <p className="text-[11px] text-[#6B7280] truncate">{img.caption}</p>
                  </div>
                  <select
                    value={img.permissionStatus}
                    onChange={async (e) => {
                      await adminUpdateImagePermission(adminKey, img.id, {
                        permissionStatus: e.target.value as PublicationPermissionStatus,
                      });
                      setStatusMessage(`Đã cập nhật quyền ảnh ${img.expectedFilename}`);
                      await reloadData();
                    }}
                    className="border border-[#D8CEB8] px-2 py-1 text-[11px] bg-white shrink-0"
                  >
                    <option value="permission_granted">Đã cho phép</option>
                    <option value="official_public_no_separate_permission">Công bố chính thức</option>
                    <option value="unconfirmed">Chưa xác nhận</option>
                    <option value="not_permitted">Không được phép</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Publication Permissions */}
      {activeTab === 'permissions' && (
        <div className="border border-[#D8CEB8] bg-white p-6 space-y-4">
          <h2 className="font-serif text-2xl font-semibold text-[#0F1E33]">
            Quản lý Phê duyệt & Quyền công bố ({permissions.length})
          </h2>
          <div className="space-y-3 text-xs">
            {permissions.map((perm) => (
              <div key={perm.id} className="border border-[#E6DFD0] p-4 space-y-2 bg-[#FAF8F3]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono font-bold text-[#7A541C]">{perm.id}</span>
                  <select
                    value={perm.status}
                    onChange={async (e) => {
                      await adminUpsertPermission(adminKey, {
                        ...perm,
                        status: e.target.value as PublicationPermissionStatus,
                      });
                      setStatusMessage('Đã cập nhật trạng thái quyền công bố.');
                      await reloadData();
                    }}
                    className="border border-[#D8CEB8] bg-white px-2.5 py-1 text-xs"
                  >
                    <option value="permission_granted">1. Đã có người cho phép công bố</option>
                    <option value="official_public_no_separate_permission">
                      2. Không cần xin phép riêng (tư liệu công bố chính thức)
                    </option>
                    <option value="unconfirmed">3. Chưa có xác nhận</option>
                    <option value="not_permitted">4. Không được phép công bố</option>
                  </select>
                </div>
                <p>
                  <strong>Cơ quan / Người cho phép:</strong> {perm.grantorNameOrAgency} ({perm.grantorRole})
                </p>
                <p>
                  <strong>Phạm vi sử dụng:</strong> {perm.permittedScope}
                </p>
                <p>
                  <strong>Điều kiện bản quyền hình ảnh:</strong> {perm.imageCopyrightCondition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Backup, Import & Export */}
      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="border border-[#D8CEB8] bg-white p-5 space-y-3">
            <h3 className="font-serif text-xl font-semibold text-[#0F1E33]">Xuất dữ liệu (JSON / CSV)</h3>
            <p className="text-[#4B5563]">
              Tải xuống toàn bộ 15 bảng dữ liệu chuẩn JSON hoặc danh mục bảo vật dạng CSV (UTF-8 BOM).
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleExport('json')}
                className="bg-[#0F1E33] px-4 py-2 font-semibold text-[#FAF8F3] cursor-pointer"
              >
                Xuất JSON
              </button>
              <button
                type="button"
                onClick={() => handleExport('csv')}
                className="border border-[#0F1E33] px-4 py-2 font-semibold text-[#0F1E33] cursor-pointer"
              >
                Xuất CSV
              </button>
            </div>
          </div>

          <div className="border border-[#D8CEB8] bg-white p-5 space-y-3">
            <h3 className="font-serif text-xl font-semibold text-[#0F1E33]">Sao lưu máy chủ</h3>
            <p className="text-[#4B5563]">
              Tạo bản chụp sao lưu toàn bộ cơ sở dữ liệu vào thư mục <code className="font-mono">/database/backups/</code>.
            </p>
            <button
              type="button"
              onClick={async () => {
                const res = await adminCreateBackup(adminKey);
                setStatusMessage(`Đã tạo bản sao lưu: ${res.backupFile}`);
              }}
              className="bg-[#7A541C] px-4 py-2 font-semibold text-white cursor-pointer"
            >
              Tạo bản sao lưu ngay
            </button>
          </div>

          <div className="border border-[#D8CEB8] bg-white p-5 space-y-3">
            <h3 className="font-serif text-xl font-semibold text-[#0F1E33]">Nhập dữ liệu (JSON)</h3>
            <p className="text-[#4B5563]">
              Nhập thêm hoặc cập nhật danh sách hồ sơ bảo vật từ tệp JSON chuẩn hóa.
            </p>
            <input type="file" accept=".json" onChange={handleImportJsonFile} className="w-full pt-1" />
          </div>
        </div>
      )}

      {/* Edit / Add Record Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#091321]/75 p-4" role="dialog">
          <form
            onSubmit={handleSaveRecord}
            className="max-w-2xl w-full bg-[#FAF8F3] border border-[#9A6E2A] p-6 space-y-4 max-h-[88vh] overflow-y-auto text-xs"
          >
            <h3 className="font-serif text-2xl font-bold text-[#0F1E33] border-b border-[#D8CEB8] pb-2">
              {isNewRecord ? 'Thêm hồ sơ bảo vật mới' : `Chỉnh sửa: ${editingRecord.officialName}`}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Mã định danh</label>
                <input
                  type="text"
                  value={editingRecord.code}
                  onChange={(e) => setEditingRecord({ ...editingRecord, code: e.target.value })}
                  className="w-full border border-[#D8CEB8] bg-white px-2.5 py-1.5"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Trạng thái công nhận</label>
                <select
                  value={editingRecord.recognitionStatus}
                  onChange={(e) =>
                    setEditingRecord({
                      ...editingRecord,
                      recognitionStatus: e.target.value as TreasureRecord['recognitionStatus'],
                    })
                  }
                  className="w-full border border-[#D8CEB8] bg-white px-2.5 py-1.5"
                >
                  <option value="national_treasure">Bảo vật Quốc gia (có QĐ)</option>
                  <option value="representative_heritage">Hiện vật Di sản tiêu biểu</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1">Tên chính thức</label>
                <input
                  type="text"
                  value={editingRecord.officialName}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, officialName: e.target.value })
                  }
                  className="w-full border border-[#D8CEB8] bg-white px-2.5 py-1.5"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Niên đại</label>
                <input
                  type="text"
                  value={editingRecord.dating}
                  onChange={(e) => setEditingRecord({ ...editingRecord, dating: e.target.value })}
                  className="w-full border border-[#D8CEB8] bg-white px-2.5 py-1.5"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Số quyết định công nhận</label>
                <input
                  type="text"
                  value={editingRecord.decisionNumber || ''}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, decisionNumber: e.target.value })
                  }
                  className="w-full border border-[#D8CEB8] bg-white px-2.5 py-1.5"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1">Đơn vị lưu giữ</label>
                <select
                  value={editingRecord.currentKeeperId}
                  onChange={(e) => {
                    const k = keepers.find((x) => x.id === e.target.value);
                    setEditingRecord({
                      ...editingRecord,
                      currentKeeperId: e.target.value,
                      archival: {
                        ...editingRecord.archival,
                        currentHoldingInstitution: k?.officialName || '',
                      },
                    });
                  }}
                  className="w-full border border-[#D8CEB8] bg-white px-2.5 py-1.5"
                >
                  {keepers.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.officialName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1">Tóm tắt nội dung</label>
                <textarea
                  rows={3}
                  value={editingRecord.summary}
                  onChange={(e) => setEditingRecord({ ...editingRecord, summary: e.target.value })}
                  className="w-full border border-[#D8CEB8] bg-white px-2.5 py-1.5"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-[#D8CEB8]">
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="border border-[#D8CEB8] bg-white px-4 py-2 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-[#0F1E33] px-4 py-2 font-semibold text-white cursor-pointer"
              >
                Xác nhận lưu hồ sơ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#091321]/75 p-4" role="dialog">
          <div className="max-w-md w-full bg-white border border-[#9A3412] p-6 space-y-4 text-xs">
            <div className="flex items-start gap-2.5 text-[#9A3412]">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <div>
                <h3 className="font-serif text-lg font-bold">Xác nhận xóa bản ghi</h3>
                <p className="mt-1 text-[#1E242B]">
                  Thao tác này sẽ xóa vĩnh viễn hồ sơ bảo vật khỏi cơ sở dữ liệu hiện hành. Bạn nên sao lưu JSON trước khi xóa.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="border border-[#D8CEB8] px-3 py-1.5 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1 bg-[#9A3412] px-3 py-1.5 font-semibold text-white cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Xóa vĩnh viễn</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

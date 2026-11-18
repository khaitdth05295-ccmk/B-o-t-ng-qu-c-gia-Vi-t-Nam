import React from 'react';
import { ArrowLeft, ExternalLink, MapPin, ShieldCheck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ArtifactVisualFrame } from '../components/ArtifactVisualFrame';
import { useHeritage } from '../context/HeritageContext';

export const TreasureDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, locale, t, buildPath } = useHeritage();

  if (!data) return null;

  const treasure = data.treasures.find((tr) => tr.id === id || tr.code === id);
  if (!treasure) {
    return (
      <div className="mx-auto max-w-[1000px] px-4 py-16 text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold text-[#0F1E33]">Không tìm thấy hồ sơ hiện vật</h1>
        <Link to={buildPath('/encyclopedia')} className="inline-block bg-[#0F1E33] px-4 py-2 text-xs text-white">
          Quay lại Bách khoa toàn thư
        </Link>
      </div>
    );
  }

  const keeper = data.keepers.find((k) => k.id === treasure.currentKeeperId);
  const culture = data.cultures.find((c) => c.id === treasure.cultureId);
  const materials = data.materials.filter((m) => treasure.materialIds.includes(m.id));
  const periods = data.periods.filter((p) => treasure.periodIds.includes(p.id));
  const images = data.images.filter((i) => i.treasureId === treasure.id);
  const sources = data.sources.filter((s) => treasure.sourceIds.includes(s.id));
  const relatedTreasures = data.treasures.filter((tr) => treasure.relatedTreasureIds.includes(tr.id));
  const permission = data.permissions.find((p) => p.id === treasure.permissionId);
  const translationNote = data.translations.find(
    (tr) => tr.entityId === treasure.id && tr.locale === locale,
  );

  const isNationalTreasure = treasure.recognitionStatus === 'national_treasure';

  const encyclopedicBlocks: Array<{ id: string; num: string; title: string; body: string }> = [
    { id: 'sec-1', num: '01', title: 'Thông tin tổng quan', body: treasure.sections.overview },
    { id: 'sec-2', num: '02', title: 'Lịch sử hình thành', body: treasure.sections.formationHistory },
    { id: 'sec-3', num: '03', title: 'Nguồn gốc', body: treasure.sections.origin },
    { id: 'sec-4', num: '04', title: 'Quá trình phát hiện', body: treasure.sections.discoveryProcess },
    { id: 'sec-5', num: '05', title: 'Bối cảnh lịch sử', body: treasure.sections.historicalContext },
    { id: 'sec-6', num: '06', title: 'Niên đại', body: treasure.sections.datingDetail },
    { id: 'sec-7', num: '07', title: 'Văn hóa và triều đại', body: treasure.sections.cultureAndDynastyDetail },
    { id: 'sec-8', num: '08', title: 'Đặc điểm hình dáng', body: treasure.sections.physicalCharacteristics },
    { id: 'sec-9', num: '09', title: 'Cấu tạo', body: treasure.sections.structure },
    { id: 'sec-10', num: '10', title: 'Chất liệu', body: treasure.sections.materialAnalysis },
    { id: 'sec-11', num: '11', title: 'Kỹ thuật chế tác', body: treasure.sections.craftingTechnique },
    { id: 'sec-12', num: '12', title: 'Hoa văn và biểu tượng', body: treasure.sections.motifsAndSymbols },
    { id: 'sec-13', num: '13', title: 'Chữ khắc và ký hiệu', body: treasure.sections.inscriptionsAndMarks },
    { id: 'sec-14', num: '14', title: 'Giá trị lịch sử', body: treasure.sections.historicalValue },
    { id: 'sec-15', num: '15', title: 'Giá trị văn hóa', body: treasure.sections.culturalValue },
    { id: 'sec-16', num: '16', title: 'Giá trị nghệ thuật', body: treasure.sections.artisticValue },
    { id: 'sec-17', num: '17', title: 'Giá trị khảo cổ', body: treasure.sections.archaeologicalValue },
    { id: 'sec-18', num: '18', title: 'Giá trị khoa học', body: treasure.sections.scientificValue },
    { id: 'sec-19', num: '19', title: 'Quá trình công nhận', body: treasure.sections.recognitionProcess },
    { id: 'sec-20', num: '20', title: 'Quyết định công nhận', body: treasure.sections.recognitionDecisionSummary },
    { id: 'sec-21', num: '21', title: 'Nơi lưu giữ hiện nay', body: treasure.sections.currentKeeperDetail },
    { id: 'sec-22', num: '22', title: 'Tình trạng trưng bày', body: treasure.sections.exhibitionStatus },
    { id: 'sec-23', num: '23', title: 'Thông tin bảo tồn', body: treasure.sections.conservationInfo },
    { id: 'sec-24', num: '24', title: 'Tài liệu nghiên cứu', body: treasure.sections.researchDocuments },
  ];

  const dublinCoreRows: Array<[string, string]> = [
    ['1. Title', treasure.dublinCore.title],
    ['2. Creator', treasure.dublinCore.creator],
    ['3. Subject', treasure.dublinCore.subject],
    ['4. Description', treasure.dublinCore.description],
    ['5. Publisher', treasure.dublinCore.publisher],
    ['6. Contributor', treasure.dublinCore.contributor],
    ['7. Date', treasure.dublinCore.date],
    ['8. Type', treasure.dublinCore.type],
    ['9. Format', treasure.dublinCore.format],
    ['10. Identifier', treasure.dublinCore.identifier],
    ['11. Source', treasure.dublinCore.source],
    ['12. Language', treasure.dublinCore.language],
    ['13. Relation', treasure.dublinCore.relation],
    ['14. Coverage', treasure.dublinCore.coverage],
    ['15. Rights', treasure.dublinCore.rights],
  ];

  const copyTypeLabels: Record<string, string> = {
    original: 'Bản gốc',
    replica: 'Bản sao',
    digital_of_original: 'Bản số của bản gốc',
    digital_of_replica: 'Bản số của bản sao',
  };

  const conditionLabels: Record<string, string> = {
    good: 'Tốt',
    minor_damage: 'Hư hại nhẹ',
    severe_damage: 'Hư hại nặng',
    unknown: 'Không rõ',
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#5B3E2A]">
        <Link to={buildPath('/encyclopedia')} className="inline-flex items-center gap-1.5 hover:text-[#0F1E33]">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Quay lại Bách khoa toàn thư</span>
        </Link>
        <span className="font-mono text-[#7A541C]">
          Mã định danh: {treasure.code} · Cập nhật: {treasure.updatedAt}
        </span>
      </div>

      {/* Locale Disclaimer when non-Vietnamese */}
      {locale !== 'vi' && (
        <div className="mb-6 border border-[#C8A252] bg-[#F3EFE6] px-4 py-3 text-xs text-[#3A2618]">
          <strong>{t.labels.translationDisclaimer}</strong>{' '}
          {translationNote
            ? `(${translationNote.academicReviewStatus === 'verified_academic' ? 'Đã kiểm duyệt' : 'Chờ thẩm định học thuật'})`
            : ''}
        </div>
      )}

      {/* Header & Summary Infobox */}
      <div className="border-b border-[#D8CEB8] pb-8 mb-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold mb-2">
          <span className={isNationalTreasure ? 'text-[#9A3412]' : 'text-[#4B5563]'}>
            {isNationalTreasure ? t.labels.nationalTreasure : t.labels.representativeHeritage}
          </span>
          <span className="text-[#9CA3AF]" aria-hidden="true">
            ·
          </span>
          <span className="text-[#7A541C]">
            {treasure.decisionNumber
              ? `Đợt ${treasure.batchNumber} (${treasure.decisionNumber}, ${treasure.decisionDate})`
              : 'Chưa có quyết định công nhận Bảo vật Quốc gia'}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0F1E33] text-balance leading-tight">
          {treasure.officialName}
        </h1>
        {treasure.otherNames.length > 0 && (
          <p className="mt-2 text-sm text-[#5B3E2A]">
            Tên gọi khác: <span className="italic">{treasure.otherNames.join('; ')}</span>
          </p>
        )}
      </div>

      {/* Asymmetric Wikipedia + Museum Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Table of Contents (Sticky on Desktop) */}
        <aside className="lg:col-span-3 lg:sticky lg:top-24 border border-[#D8CEB8] bg-white p-5 space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#0F1E33] border-b border-[#EFE9DC] pb-2">
            Mục lục hồ sơ (27 mục)
          </h2>
          <nav className="max-h-[60vh] overflow-y-auto pr-1 space-y-1 text-xs">
            {encyclopedicBlocks.map((b) => (
              <a
                key={b.id}
                href={`#${b.id}`}
                className="block py-1 text-[#4B5563] hover:text-[#0F1E33] hover:underline"
              >
                <span className="font-mono text-[#9A6E2A] mr-1.5">{b.num}.</span>
                {b.title}
              </a>
            ))}
            <a href="#sec-25" className="block py-1 text-[#4B5563] hover:text-[#0F1E33] hover:underline">
              <span className="font-mono text-[#9A6E2A] mr-1.5">25.</span>Nguồn tham khảo
            </a>
            <a href="#sec-26" className="block py-1 text-[#4B5563] hover:text-[#0F1E33] hover:underline">
              <span className="font-mono text-[#9A6E2A] mr-1.5">26.</span>Hình ảnh & Bản quyền
            </a>
            <a href="#sec-27" className="block py-1 text-[#4B5563] hover:text-[#0F1E33] hover:underline">
              <span className="font-mono text-[#9A6E2A] mr-1.5">27.</span>Hiện vật liên quan
            </a>
            <a href="#sec-dc" className="block py-1 font-medium text-[#0F1E33] hover:underline pt-1 border-t border-[#EFE9DC]">
              Chuẩn Dublin Core (15 trường)
            </a>
          </nav>
        </aside>

        {/* Center/Main Encyclopedia Content */}
        <main className="lg:col-span-6 space-y-8">
          <p className="font-serif text-xl text-[#1E242B] leading-relaxed border-b border-[#E6DFD0] pb-6 first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#0F1E33]">
            {treasure.summary}
          </p>

          {encyclopedicBlocks.map((block) => (
            <section key={block.id} id={block.id} className="scroll-mt-24 space-y-2 border-b border-[#EFE9DC] pb-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-serif text-2xl font-semibold text-[#0F1E33]">
                  <span className="font-mono text-sm text-[#9A6E2A] mr-2">{block.num}.</span>
                  {block.title}
                </h2>
                {sources.length > 0 && (
                  <a
                    href="#sec-25"
                    className="font-mono text-[11px] text-[#7A541C] hover:underline shrink-0"
                  >
                    [{sources.map((s) => s.code).join(', ')}]
                  </a>
                )}
              </div>
              <p className="text-sm sm:text-[15px] text-[#1E242B] leading-[1.75]">
                {block.body || t.labels.unverifiedNotice}
              </p>
            </section>
          ))}

          {/* 25. Nguồn tham khảo */}
          <section id="sec-25" className="scroll-mt-24 space-y-3 border-b border-[#EFE9DC] pb-6">
            <h2 className="font-serif text-2xl font-semibold text-[#0F1E33]">
              <span className="font-mono text-sm text-[#9A6E2A] mr-2">25.</span>
              Nguồn tham khảo ({sources.length})
            </h2>
            <ul className="space-y-2.5">
              {sources.map((src) => (
                <li key={src.id} className="border border-[#E6DFD0] bg-white p-3.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-semibold text-[#7A541C]">{src.code}</span>
                    <span className="text-[#14532D]">Đã xác minh</span>
                  </div>
                  <p className="mt-1 font-semibold text-[#0F1E33]">
                    {src.name} — {src.documentTitle}
                  </p>
                  <p className="mt-0.5 text-[#4B5563]">
                    {src.organizationOrAuthor} · Truy cập: {src.accessedDate}
                  </p>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-[#0F1E33] underline hover:text-[#9A6E2A]"
                  >
                    <span>{src.url}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* 26. Hình ảnh */}
          <section id="sec-26" className="scroll-mt-24 space-y-4 border-b border-[#EFE9DC] pb-6">
            <h2 className="font-serif text-2xl font-semibold text-[#0F1E33]">
              <span className="font-mono text-sm text-[#9A6E2A] mr-2">26.</span>
              Hình ảnh hiện vật & Quyền sử dụng
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {images.length > 0 ? (
                images.map((img) => (
                  <ArtifactVisualFrame key={img.id} treasure={treasure} image={img} />
                ))
              ) : (
                <ArtifactVisualFrame treasure={treasure} />
              )}
            </div>
          </section>

          {/* 27. Hiện vật liên quan */}
          <section id="sec-27" className="scroll-mt-24 space-y-3 border-b border-[#EFE9DC] pb-6">
            <h2 className="font-serif text-2xl font-semibold text-[#0F1E33]">
              <span className="font-mono text-sm text-[#9A6E2A] mr-2">27.</span>
              Hiện vật liên quan
            </h2>
            {relatedTreasures.length === 0 ? (
              <p className="text-xs text-[#6B7280]">{t.labels.unverifiedNotice}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedTreasures.map((rel) => (
                  <Link
                    key={rel.id}
                    to={buildPath(`/treasures/${rel.id}`)}
                    className="border border-[#D8CEB8] bg-white p-3.5 hover:border-[#9A6E2A]"
                  >
                    <p className="font-mono text-[11px] text-[#7A541C]">{rel.code}</p>
                    <p className="mt-1 font-serif text-base font-semibold text-[#0F1E33]">
                      {rel.officialName}
                    </p>
                    <p className="mt-0.5 text-xs text-[#6B7280]">{rel.dating}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Dublin Core 15 fields & Extended Archival Fields */}
          <section id="sec-dc" className="scroll-mt-24 space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-[#0F1E33]">
              Chuẩn mô tả 15 trường Dublin Core & Trường bổ sung
            </h2>
            <div className="border border-[#D8CEB8] bg-white overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <tbody>
                  {dublinCoreRows.map(([k, v]) => (
                    <tr key={k} className="border-b border-[#EFE9DC]">
                      <th className="w-40 bg-[#F3EFE6] px-3 py-2 text-left font-semibold text-[#3A2618] align-top">
                        {k}
                      </th>
                      <td className="px-3 py-2 text-[#1E242B]">{v || t.labels.unverifiedNotice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border border-[#D8CEB8] bg-white overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <tbody>
                  <tr className="border-b border-[#EFE9DC]">
                    <th className="w-56 bg-[#F3EFE6] px-3 py-2 text-left font-semibold text-[#3A2618]">
                      Nơi lưu giữ hiện nay
                    </th>
                    <td className="px-3 py-2">{treasure.archival.currentHoldingInstitution}</td>
                  </tr>
                  <tr className="border-b border-[#EFE9DC]">
                    <th className="bg-[#F3EFE6] px-3 py-2 text-left font-semibold text-[#3A2618]">
                      Nơi lưu giữ tại thời điểm tư liệu
                    </th>
                    <td className="px-3 py-2">{treasure.archival.holdingAtDocumentationTime}</td>
                  </tr>
                  <tr className="border-b border-[#EFE9DC]">
                    <th className="bg-[#F3EFE6] px-3 py-2 text-left font-semibold text-[#3A2618]">
                      Loại bản đang hiển thị
                    </th>
                    <td className="px-3 py-2">{copyTypeLabels[treasure.archival.displayedCopyType]}</td>
                  </tr>
                  <tr className="border-b border-[#EFE9DC]">
                    <th className="bg-[#F3EFE6] px-3 py-2 text-left font-semibold text-[#3A2618]">
                      Tình trạng bản gốc
                    </th>
                    <td className="px-3 py-2">{conditionLabels[treasure.archival.originalCondition]}</td>
                  </tr>
                  <tr className="border-b border-[#EFE9DC]">
                    <th className="bg-[#F3EFE6] px-3 py-2 text-left font-semibold text-[#3A2618]">
                      Số đăng ký kiểm kê
                    </th>
                    <td className="px-3 py-2">{treasure.archival.registrationNumber}</td>
                  </tr>
                  <tr className="border-b border-[#EFE9DC]">
                    <th className="bg-[#F3EFE6] px-3 py-2 text-left font-semibold text-[#3A2618]">
                      Người / Cơ quan cho phép công bố
                    </th>
                    <td className="px-3 py-2">{treasure.archival.permissionGrantor}</td>
                  </tr>
                  <tr className="border-b border-[#EFE9DC]">
                    <th className="bg-[#F3EFE6] px-3 py-2 text-left font-semibold text-[#3A2618]">
                      Phạm vi được phép
                    </th>
                    <td className="px-3 py-2">{treasure.archival.permittedScope}</td>
                  </tr>
                  <tr className="border-b border-[#EFE9DC]">
                    <th className="bg-[#F3EFE6] px-3 py-2 text-left font-semibold text-[#3A2618]">
                      Phần không công bố
                    </th>
                    <td className="px-3 py-2">{treasure.archival.unpublishedSections}</td>
                  </tr>
                  <tr>
                    <th className="bg-[#F3EFE6] px-3 py-2 text-left font-semibold text-[#3A2618]">
                      Mức kiểm chứng & Quyền công bố
                    </th>
                    <td className="px-3 py-2">
                      {treasure.archival.verificationLevel === 'verified' ? 'Đã xác minh' : 'Cần bổ sung'} ·{' '}
                      {permission?.status === 'official_public_no_separate_permission'
                        ? 'Không cần xin phép riêng (tư liệu công bố chính thức, có ghi nguồn)'
                        : permission?.status === 'permission_granted'
                          ? 'Đã có người cho phép công bố'
                          : 'Chưa có xác nhận'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>

        {/* Right: Museum Accession Infobox */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="border border-[#D8CEB8] bg-white p-4">
            <ArtifactVisualFrame treasure={treasure} image={images[0]} />
          </div>

          <div className="border border-[#D8CEB8] bg-white p-5 space-y-3 text-xs">
            <h3 className="font-serif text-lg font-semibold text-[#0F1E33] border-b border-[#EFE9DC] pb-2">
              Hồ sơ tóm tắt hiện vật
            </h3>
            <dl className="space-y-2.5">
              <div>
                <dt className="font-semibold text-[#5B3E2A]">Niên đại</dt>
                <dd className="text-[#1E242B] mt-0.5">{treasure.dating}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#5B3E2A]">Thời kỳ lịch sử</dt>
                <dd className="text-[#1E242B] mt-0.5">{periods.map((p) => p.name).join(', ')}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#5B3E2A]">Nền văn hóa</dt>
                <dd className="text-[#1E242B] mt-0.5">{culture?.name || t.labels.unverifiedNotice}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#5B3E2A]">Triều đại</dt>
                <dd className="text-[#1E242B] mt-0.5">{treasure.dynasty}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#5B3E2A]">Chất liệu</dt>
                <dd className="text-[#1E242B] mt-0.5">{materials.map((m) => m.name).join(', ')}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#5B3E2A]">Nơi phát hiện</dt>
                <dd className="text-[#1E242B] mt-0.5">{treasure.discoveryPlace}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#5B3E2A]">Nơi lưu giữ hiện nay</dt>
                <dd className="mt-0.5">
                  {keeper ? (
                    <Link
                      to={buildPath(`/museums/${keeper.id}`)}
                      className="font-semibold text-[#0F1E33] underline hover:text-[#9A6E2A]"
                    >
                      {keeper.officialName}
                    </Link>
                  ) : (
                    treasure.archival.currentHoldingInstitution
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#5B3E2A]">Nơi trưng bày</dt>
                <dd className="text-[#1E242B] mt-0.5">{treasure.exhibitionPlace}</dd>
              </div>
            </dl>

            {keeper && (
              <div className="pt-3 border-t border-[#EFE9DC]">
                <Link
                  to={buildPath(`/map?keeper=${keeper.id}`)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0F1E33] px-3 py-2 text-xs font-semibold text-[#FAF8F3] hover:bg-[#182D49]"
                >
                  <MapPin className="h-3.5 w-3.5 text-[#DFC484]" />
                  <span>Xem vị trí lưu giữ trên bản đồ</span>
                </Link>
              </div>
            )}

            <div className="pt-2 flex items-start gap-2 text-[11px] text-[#5B3E2A]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#9A6E2A] shrink-0 mt-0.5" />
              <span>
                Phân biệt rõ: nơi phát hiện khảo cổ khác với nơi lưu giữ/trưng bày bảo tàng hiện nay.
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

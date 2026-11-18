import React from 'react';
import { GraduationCap } from 'lucide-react';
import { useHeritage } from '../context/HeritageContext';

export const AboutPage: React.FC = () => {
  const { t } = useHeritage();

  const projectRows: Array<[string, string]> = [
    ['Tên đề tài', 'Bản đồ nơi lưu giữ bảo vật quốc gia'],
    ['Mã đề tài', 'D05'],
    ['Tên website', 'BẢO VẬT QUỐC GIA VIỆT NAM'],
    ['Sinh viên thực hiện', 'Trần Đức Khải'],
    ['Mã sinh viên', 'TH05295'],
    ['Nhóm', '2'],
    ['Đơn vị đào tạo', 'FPT Polytechnic'],
    ['Đơn vị phối hợp', 'IMTA TECH'],
    ['Chương trình', 'Thực tập sinh Đợt 15'],
  ];

  return (
    <div className="mx-auto max-w-[1000px] px-4 lg:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="border-b border-[#D8CEB8] pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
          Giới thiệu nền tảng văn hóa
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-[#0F1E33]">
          {t.nav.about} · BẢO VẬT QUỐC GIA VIỆT NAM
        </h1>
      </div>

      {/* Main Intro Prose (Exact required narrative) */}
      <section className="space-y-4 text-base text-[#1E242B] leading-[1.85] font-serif">
        <p className="text-xl text-[#0F1E33] font-medium">
          Bảo vật Quốc gia Việt Nam là không gian khám phá và tra cứu các hiện vật có giá trị đặc biệt về lịch sử, văn hóa, nghệ thuật và khoa học của dân tộc.
        </p>
        <p>
          Thông qua thư viện hiện vật, bài viết bách khoa, bản đồ địa lý và hệ thống dữ liệu bảo tàng, nền tảng mang đến trải nghiệm khám phá di sản Việt Nam một cách trực quan, có hệ thống và dễ tiếp cận.
        </p>
        <p>
          Mỗi bảo vật là một dấu ấn của thời gian, phản ánh đời sống, tư duy, kỹ thuật và bản sắc văn hóa của các thế hệ người Việt.
        </p>
      </section>

      {/* Scope, Compilation Sources, Image Policy, Contact */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#D8CEB8] pt-8 text-sm">
        <div className="border border-[#D8CEB8] bg-white p-5 space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#0F1E33]">Phạm vi nội dung</h2>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            Nền tảng tập trung vào các Bảo vật Quốc gia Việt Nam đã được Thủ tướng Chính phủ quyết định công nhận (tham chiếu Luật Di sản văn hóa số 45/2024/QH15 và mốc 357 bảo vật/nhóm hiện vật qua 14 đợt tính đến 02/2026), đồng thời tách bạch rạch ròi với các hiện vật bảo tàng và hiện vật di sản tiêu biểu chưa có quyết định công nhận riêng.
          </p>
        </div>

        <div className="border border-[#D8CEB8] bg-white p-5 space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#0F1E33]">Nguồn biên soạn</h2>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            Hồ sơ được biên soạn theo chuẩn mô tả 15 trường Dublin Core dựa trên công bố chính thức từ Cục Di sản văn hóa (dsvh.gov.vn), Bộ Văn hóa, Thể thao và Du lịch (bvhttdl.gov.vn), Cổng Thông tin Chính phủ (vanban.chinhphu.vn), các bảo tàng lưu giữ và viện nghiên cứu chuyên ngành.
          </p>
        </div>

        <div className="border border-[#D8CEB8] bg-white p-5 space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#0F1E33]">Chính sách hình ảnh & Bản quyền</h2>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            Nền tảng phân biệt độc lập giữa quyền khai thác nội dung tư liệu và bản quyền hình ảnh chụp hiện vật. Không sử dụng ảnh do AI tạo ra để thay thế ảnh hiện vật thật và chỉ hiển thị công khai những tệp ảnh đã kiểm chứng nguồn gốc và xác nhận quyền công bố.
          </p>
        </div>

        <div className="border border-[#D8CEB8] bg-white p-5 space-y-2">
          <h2 className="font-serif text-xl font-semibold text-[#0F1E33]">Liên hệ & Góp ý tư liệu</h2>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            Mọi đóng góp hiệu đính học thuật, bổ sung hình ảnh có bản quyền hoặc cập nhật quyết định công nhận mới xin liên hệ Ban biên tập Dự án D05 qua trang Quản trị tư liệu hoặc email liên hệ thực hiện đề tài: <span className="font-mono text-[#0F1E33]">khaitdth05295@gmail.com</span>.
          </p>
        </div>
      </section>

      {/* BẢNG THÔNG TIN THỰC HIỆN ĐỀ TÀI (Exact design specification from Section XVIII) */}
      <section className="pt-4">
        <div className="border-2 border-[#4E3422] bg-white overflow-hidden">
          {/* Light Bronze Gold Title Bar with Graduation Cap Icon */}
          <div className="bg-[#EBD8AC] border-b-2 border-[#4E3422] px-5 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="h-5 w-5 text-[#3A2618] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#3A2618]">
                THÔNG TIN THỰC HIỆN ĐỀ TÀI
              </h2>
            </div>
            <span className="font-mono text-xs font-bold text-[#3A2618] border border-[#4E3422] bg-[#FAF8F3] px-2.5 py-1">
              Mã số: D05
            </span>
          </div>

          {/* Two-Column Table: Cream label column + White value column + Deep brown borders */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <tbody>
                {projectRows.map(([label, value], idx) => (
                  <tr
                    key={label}
                    className={idx < projectRows.length - 1 ? 'border-b border-[#4E3422]/40' : ''}
                  >
                    <th
                      scope="row"
                      className="w-1/3 sm:w-64 bg-[#F3EFE6] border-r border-[#4E3422]/40 px-4 py-3 text-left font-bold text-[#3A2618]"
                    >
                      {label}
                    </th>
                    <td className="bg-white px-4 py-3 font-semibold text-[#1E242B]">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

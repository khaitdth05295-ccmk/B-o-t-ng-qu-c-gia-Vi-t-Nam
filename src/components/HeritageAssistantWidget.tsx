import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, BookOpen, ExternalLink, MessageSquareText, Send, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHeritage } from '../context/HeritageContext';
import { sendAssistantMessage } from '../services/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citedTreasures?: Array<{ id: string; officialName: string; code: string; recognitionStatus: string }>;
  citedSources?: Array<{ id: string; code: string; name: string; url: string }>;
}

export const HeritageAssistantWidget: React.FC = () => {
  const { data, locale, t, assistantOpen, setAssistantOpen, buildPath } = useHeritage();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId] = useState(() => `d05-${Date.now()}`);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const assistantAvailable = data?.assistantStatus?.available ?? false;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, assistantOpen]);

  const handleAsk = async (questionText?: string) => {
    const q = (questionText ?? input).trim();
    if (!q || sending) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: q };
    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput('');
    setSending(true);

    try {
      const historyForApi = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await sendAssistantMessage({
        question: q,
        locale,
        sessionId,
        history: historyForApi,
      });

      if (!res.available) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: `${t.assistant.unavailableTitle}: ${t.assistant.unavailableBody}`,
          },
        ]);
      } else if (res.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: `Lỗi xử lý câu hỏi: ${res.error}`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: res.answer,
            citedTreasures: res.citedTreasures,
            citedSources: res.citedSources,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: 'Không thể kết nối máy chủ trợ lý OpenAI.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating Corner Trigger */}
      {!assistantOpen && (
        <button
          type="button"
          onClick={() => setAssistantOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 bg-[#0F1E33] text-[#FAF8F3] border border-[#C8A252]/70 px-4 py-3 shadow-lg hover:bg-[#182D49] transition-colors cursor-pointer"
          aria-label={t.assistant.title}
        >
          <MessageSquareText className="h-4 w-4 text-[#DFC484]" />
          <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
            {t.labels.openAssistant}
          </span>
        </button>
      )}

      {/* Slide-over Assistant Panel */}
      {assistantOpen && (
        <div
          className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-[440px] h-[600px] max-h-[82vh] flex flex-col bg-[#FAF8F3] border border-[#9A6E2A]/60 shadow-2xl"
          role="dialog"
          aria-label={t.assistant.title}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 bg-[#0F1E33] px-4 py-3.5 text-[#FAF8F3]">
            <div>
              <h3 className="font-serif text-base font-semibold tracking-wide text-[#DFC484]">
                {t.assistant.title}
              </h3>
              <p className="text-[11px] text-[#C7BCA6] mt-0.5 leading-snug">
                {t.assistant.subtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAssistantOpen(false)}
              className="p-1.5 text-[#C7BCA6] hover:text-white cursor-pointer"
              aria-label={t.labels.close}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Unavailable Banner if OPENAI_API_KEY not configured */}
          {!assistantAvailable && (
            <div className="border-b border-[#D8CEB8] bg-[#F3EFE6] px-4 py-3 flex items-start gap-2.5 text-xs text-[#3A2618]">
              <AlertCircle className="h-4 w-4 text-[#9A6E2A] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{t.assistant.unavailableTitle}</p>
                <p className="mt-0.5 text-[#5B3E2A] leading-relaxed">
                  {t.assistant.unavailableBody}
                </p>
              </div>
            </div>
          )}

          {/* Conversation History */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Tra cứu thông tin xác thực từ cơ sở dữ liệu bảo vật, bảo tàng, di tích và nguồn tham khảo trên nền tảng.
                </p>
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7A541C]">
                    Câu hỏi gợi ý
                  </p>
                  {t.assistant.suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      disabled={!assistantAvailable || sending}
                      onClick={() => handleAsk(q)}
                      className="w-full text-left border border-[#D8CEB8] bg-white px-3 py-2 text-xs text-[#0F1E33] hover:border-[#9A6E2A] hover:bg-[#F3EFE6] disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#0F1E33] text-[#FAF8F3]'
                      : 'bg-white border border-[#D8CEB8] text-[#1E242B]'
                  }`}
                >
                  {msg.content}
                </div>

                {msg.citedTreasures && msg.citedTreasures.length > 0 && (
                  <div className="mt-2 w-full space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7A541C]">
                      Hồ sơ liên quan
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citedTreasures.map((ct) => (
                        <Link
                          key={ct.id}
                          to={buildPath(`/treasures/${ct.id}`)}
                          onClick={() => setAssistantOpen(false)}
                          className="inline-flex items-center gap-1 border border-[#C8A252] bg-[#FAF8F3] px-2 py-1 text-[11px] font-medium text-[#0F1E33] hover:bg-[#EBE4D5]"
                        >
                          <BookOpen className="h-3 w-3 text-[#9A6E2A]" />
                          <span>{ct.officialName}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {msg.citedSources && msg.citedSources.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#5B3E2A]">
                    {msg.citedSources.slice(0, 3).map((s) => (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline hover:text-[#0F1E33]"
                      >
                        <span>[{s.code}] {s.name}</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {sending && (
              <div className="text-xs italic text-[#7A541C]">
                Đang truy xuất cơ sở dữ liệu và tổng hợp câu trả lời...
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="border-t border-[#D8CEB8] bg-white p-3 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!assistantAvailable || sending}
              placeholder={t.assistant.inputPlaceholder}
              className="flex-1 border border-[#D8CEB8] px-3 py-2 text-xs text-[#1E242B] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#0F1E33] disabled:bg-[#F3EFE6]"
            />
            <button
              type="submit"
              disabled={!assistantAvailable || sending || !input.trim()}
              className="inline-flex items-center gap-1.5 bg-[#0F1E33] px-3.5 py-2 text-xs font-medium text-[#FAF8F3] hover:bg-[#182D49] disabled:opacity-45 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5 text-[#DFC484]" />
              <span>{t.assistant.send}</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

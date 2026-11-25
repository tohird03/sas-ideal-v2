import { useEffect, useRef, useState } from 'react';
import { Button, ConfigProvider, Input } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { EXAMPLES, TOOL_LABELS } from './constants';
import { SendIcon, SparkIcon, StopIcon, TrashIcon } from './icons';
import { mdComponents } from './markdown';
import { CSS } from './styles';
import { AiHttpError, IChatMessage, aiChatStream } from './api/ai.api';
import React from 'react';

export const AiChat = () => {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [text, setText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [status, setStatus] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Faqat xabarlar maydoni pastga suriladi (butun sahifa emas)
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Oxirgi (assistant) xabar matniga yangi bo'lak qo'shadi
  const appendToLast = (chunk: string) =>
    setMessages((prev) => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (last?.role === 'assistant') {
        copy[copy.length - 1] = { ...last, content: last.content + chunk };
      }
      return copy;
    });

  const send = async () => {
    const value = text.trim();
    if (!value || streaming) return;

    const history: IChatMessage[] = [...messages, { role: 'user', content: value }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setText('');
    setStatus('');
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      await aiChatStream(
        history,
        (event) => {
          if (event.type === 'text') {
            setStatus('');
            appendToLast(event.text);
          } else if (event.type === 'tool') {
            setStatus(TOOL_LABELS[event.name] ?? "Ma'lumot olinmoqda...");
          } else if (event.type === 'error') {
            appendToLast(`\n\n⚠️ ${event.message}`);
          }
        },
        ctrl.signal,
      );
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        appendToLast(`\n\n⚠️ ${e instanceof AiHttpError ? e.message : "Xatolik yuz berdi, qayta urinib ko'ring."}`);
      }
    } finally {
      setStreaming(false);
      setStatus('');
      abortRef.current = null;
    }
  };

  const stop = () => abortRef.current?.abort();

  const lastIndex = messages.length - 1;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#d9732b',
          borderRadius: 12,
          colorText: '#1b1612',
          colorBorder: '#eadfd2',
        },
      }}
    >
      <div className="aic">
        <style>{CSS}</style>

        {/* Sarlavha */}
        <div className="aic-header">
          <div className="aic-header-left">
            <div className="aic-logo">
              <SparkIcon />
            </div>
            <div>
              <div className="aic-title">SAS IDEAL yordamchi</div>
              <div className="aic-subtitle">
                <span className={`aic-dot ${streaming ? 'busy' : ''}`} />
                {streaming ? status || 'Javob yozmoqda...' : 'Tayyor'}
              </div>
            </div>
          </div>
          <Button
            className="aic-clear"
            icon={<TrashIcon />}
            onClick={() => setMessages([])}
            disabled={streaming || messages.length === 0}
          >
            <span className="aic-clear-text">Tozalash</span>
          </Button>
        </div>

        {/* Xabarlar */}
        <div className="aic-scroll" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="aic-empty">
              <div className="aic-empty-logo">
                <SparkIcon />
              </div>
              <h3>Qanday yordam bera olaman?</h3>
              <p>
                Mijozlar, yetkazib beruvchilar, mahsulotlar, sotuvlar, kirim, qaytarish, to'lovlar va xodimlar
                oyligi haqida so'rang. Jadval va grafik ko'rinishida javob beraman.
              </p>
              <div className="aic-chips">
                {EXAMPLES.map((s) => (
                  <button key={s} className="aic-chip" onClick={() => setText(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => {
            const isUser = m.role === 'user';
            const isLast = i === lastIndex && m.role === 'assistant';
            const waiting = streaming && isLast && !m.content;

            return (
              <div key={i} className={`aic-row ${isUser ? 'user' : 'bot'}`}>
                {!isUser && (
                  <div className="aic-avatar">
                    <SparkIcon />
                  </div>
                )}
                <div className={`aic-bubble ${isUser ? 'user' : 'bot'}`}>
                  {waiting ? (
                    <div className="aic-typing">
                      <span className="aic-dots">
                        <i />
                        <i />
                        <i />
                      </span>
                      <span>{status || "O'ylanmoqda..."}</span>
                    </div>
                  ) : isUser ? (
                    m.content
                  ) : (
                    <div className="ai-md">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                        {m.content}
                      </ReactMarkdown>
                      {streaming && isLast && <span className="aic-caret" />}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Kiritish */}
        <div className="aic-footer">
          <div className="aic-input-row">
            <Input
              size="large"
              className="aic-field"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onPressEnter={send}
              placeholder="Masalan: shu oy eng ko'p sotilgan mahsulotlar"
              disabled={streaming}
            />
                          <Button
                size="large"
                className="aic-btn"
                type="primary"
                icon={<SendIcon />}
                onClick={send}
                disabled={!text.trim()}
              >
                <span className="aic-btn-text">Yuborish</span>
              </Button>
            {/* {streaming ? (
              <Button size="large" className="aic-btn" danger type="primary" icon={<StopIcon />} onClick={stop}>
                <span className="aic-btn-text">To'xtatish</span>
              </Button>
            ) : (
              <Button
                size="large"
                className="aic-btn"
                type="primary"
                icon={<SendIcon />}
                onClick={send}
                disabled={!text.trim()}
              >
                <span className="aic-btn-text">Yuborish</span>
              </Button>
            )} */}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

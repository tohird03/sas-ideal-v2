// AiChat uslublari. Komponent ichiga <style> sifatida kiritiladi (tashqi CSS fayl shart emas).
export const CSS = `
.aic {
  --bg: #faf7f2;
  --card: #ffffff;
  --line: #eadfd2;
  --sand: #f3ece4;
  --ink: #1b1612;
  --muted: #8a7f74;
  --accent: #d9732b;
  --accent-soft: #fbe9db;
  display: flex; flex-direction: column;
  height: 100%; min-height: 0;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 20px;
  overflow: hidden;
  color: var(--ink);
}

/* Sarlavha */
.aic-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; background: var(--card); border-bottom: 1px solid var(--line);
}
.aic-header-left { display: flex; align-items: center; gap: 12px; }
.aic-logo {
  width: 38px; height: 38px; border-radius: 12px; display: grid; place-items: center; color: #fff;
  background: linear-gradient(135deg, #f0924a, #d9732b);
  box-shadow: 0 4px 12px rgba(217,115,43,.3);
}
.aic-title { font-weight: 700; font-size: 15px; line-height: 1.2; }
.aic-subtitle { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted); margin-top: 2px; }
.aic-dot { width: 7px; height: 7px; border-radius: 50%; background: #3fb36b; }
.aic-dot.busy { background: var(--accent); animation: aic-pulse 1s ease-in-out infinite; }
.aic-clear.ant-btn { display: inline-flex; align-items: center; gap: 4px; color: var(--muted); background: var(--card); }
.aic-clear.ant-btn:not(:disabled):hover { color: #c0392b !important; border-color: #f0c4be !important; background: #fdf3f1 !important; }

/* Xabarlar maydoni */
.aic-scroll {
  flex: 1; min-height: 0; overflow-y: auto; padding: 18px 16px;
  display: flex; flex-direction: column; gap: 14px;
}
.aic-scroll::-webkit-scrollbar { width: 8px; }
.aic-scroll::-webkit-scrollbar-thumb { background: #e2d6c8; border-radius: 8px; }

.aic-row { display: flex; gap: 10px; align-items: flex-end; animation: aic-in .25s ease-out; }
.aic-row.user { justify-content: flex-end; }
.aic-avatar {
  flex: none; width: 30px; height: 30px; border-radius: 10px;
  display: grid; place-items: center; color: var(--accent); background: var(--accent-soft);
}
.aic-avatar svg { width: 16px; height: 16px; }

.aic-bubble { min-width: 0; padding: 10px 14px; font-size: 14.5px; line-height: 1.55; word-break: break-word; }
.aic-bubble.user {
  max-width: 80%; white-space: pre-wrap;
  background: var(--ink); color: #fff; border-radius: 18px 18px 4px 18px;
}
.aic-bubble.bot {
  max-width: calc(100% - 42px);
  background: var(--card); color: var(--ink); border: 1px solid var(--line);
  border-radius: 18px 18px 18px 4px; box-shadow: 0 1px 2px rgba(60,40,20,.04);
}

/* Markdown */
.ai-md > :first-child { margin-top: 0; }
.ai-md > :last-child { margin-bottom: 0; }
.ai-md p { margin: 0 0 8px; }
.ai-md ul, .ai-md ol { margin: 0 0 8px; padding-left: 20px; }
.ai-md strong { font-weight: 650; }
.ai-md code { background: var(--sand); padding: 1px 6px; border-radius: 6px; font-size: 13px; }

/* Jadval */
.aic-table { margin: 8px 0; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
.aic-table-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 10px; background: #fff;
  border-bottom: 1px solid var(--line);
  font-size: 12.5px; color: var(--muted);
}
.aic-table-bar .ant-btn { display: inline-flex; align-items: center; gap: 6px; }
.aic-table .ant-table { background: transparent; font-size: 13px; }
.aic-table .ant-table-thead > tr > th {
  background: var(--sand) !important; color: #5b5047; font-weight: 600;
  border-bottom: 1px solid var(--line); white-space: nowrap;
}
.aic-table .ant-table-tbody > tr > td { border-bottom: 1px solid #f3ebe1; }
.aic-table .ant-table-tbody > tr:last-child > td { border-bottom: none; }
.aic-table .ant-table-tbody > tr:hover > td { background: #fdf8f2 !important; }
.aic-table .ant-pagination { margin: 8px 10px !important; }

/* Kutish va yozish */
.aic-typing { display: flex; align-items: center; gap: 10px; color: var(--muted); }
.aic-dots { display: inline-flex; gap: 4px; }
.aic-dots i { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); opacity: .35; animation: aic-bounce 1.2s infinite; }
.aic-dots i:nth-child(2) { animation-delay: .15s; }
.aic-dots i:nth-child(3) { animation-delay: .3s; }
.aic-caret {
  display: inline-block; width: 7px; height: 16px; margin-left: 3px; vertical-align: text-bottom;
  background: var(--accent); border-radius: 2px; animation: aic-blink 1s steps(2) infinite;
}

/* Bo'sh holat */
.aic-empty { margin: auto; text-align: center; max-width: 460px; padding: 12px; }
.aic-empty-logo {
  width: 56px; height: 56px; margin: 0 auto 14px; border-radius: 18px; color: #fff;
  display: grid; place-items: center;
  background: linear-gradient(135deg, #f0924a, #d9732b);
  box-shadow: 0 8px 20px rgba(217,115,43,.3);
}
.aic-empty-logo svg { width: 26px; height: 26px; }
.aic-empty h3 { margin: 0 0 4px; font-size: 18px; font-weight: 700; }
.aic-empty p { margin: 0 0 18px; color: var(--muted); font-size: 14px; }
.aic-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.aic-chip {
  border: 1px solid var(--line); background: var(--card); color: var(--ink);
  border-radius: 999px; padding: 8px 14px; font-size: 13px; cursor: pointer; transition: all .15s;
}
.aic-chip:hover { border-color: var(--accent); background: var(--accent-soft); color: #a8531a; transform: translateY(-1px); }

/* Kiritish */
.aic-footer { padding: 12px 16px; background: var(--card); border-top: 1px solid var(--line); }
.aic-input-row { display: flex; gap: 8px; }
.aic-field.ant-input { border-radius: 14px; background: var(--bg); padding-inline: 16px; font-size: 14.5px; }
.aic-field.ant-input:hover, .aic-field.ant-input:focus { background: #fff; }
.aic-btn.ant-btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 14px; font-weight: 600; padding-inline: 18px; box-shadow: none; }

@keyframes aic-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes aic-bounce { 0%, 80%, 100% { opacity: .3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-4px); } }
@keyframes aic-blink { 50% { opacity: 0; } }
@keyframes aic-pulse { 50% { opacity: .35; } }

/* Jami qatori */
.aic-table .aic-total-row > td { background: #fbf6ef !important; border-top: 1px solid var(--line); }
.aic-table .ant-table-summary > tr > td { background: #fbf6ef; }

/* Grafik */
.aic-chart { margin: 10px 0; padding: 12px 12px 6px; background: #fff; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
.aic-chart-title { font-weight: 650; font-size: 13.5px; margin-bottom: 6px; }
.aic-chart-title span { color: var(--muted); font-weight: 500; }
.aic-chart-loading { display: grid; place-items: center; height: 120px; color: var(--muted); font-size: 13px; }

@media (max-width: 600px) {
  .aic { border-radius: 0; border-left: none; border-right: none; }
  .aic-clear-text, .aic-btn-text { display: none; }
  .aic-btn.ant-btn { padding-inline: 14px; }
  .aic-bubble.user { max-width: 88%; }
}
`;

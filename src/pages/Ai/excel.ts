// Har qanday markdown jadvalni .xlsx qilib yuklab beradi.
// Ustun turi sarlavhaga emas, katakchalardagi qiymatga qarab aniqlanadi.
// exceljs faqat tugma bosilganda yuklanadi.

export type ColKind = 'number' | 'date' | 'datetime' | 'text';

const isBlank = (s: string) => s === '' || s === '-' || s === '—';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DATETIME_RE = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
const NUM_RE = /^[-−]?\d[\d\s]*([.,]\d+)?$/; // 41 472,11 | -5 | 12,5 (bo'shliq NBSP ham bo'lishi mumkin)
const EN_NUM_RE = /^[-−]?\d{1,3}(,\d{3})+(\.\d+)?$/; // 41,472.11

export function isNumberCell(s: string): boolean {
  if (EN_NUM_RE.test(s)) return true;
  if (!NUM_RE.test(s)) return false;

  const grouped = /\s/.test(s);
  const intPart = s.replace(/\s/g, '').replace(/^[-−]/, '').split(/[.,]/)[0];

  // Telefon, kod, ID: bo'shliqsiz uzun yoki 0 bilan boshlanadigan raqamlar matn bo'lib qoladi
  if (!grouped && (intPart.length >= 10 || (intPart.length > 1 && intPart.startsWith('0')))) {
    return false;
  }
  return true;
}

export function parseNum(s: string): number {
  if (EN_NUM_RE.test(s)) return Number(s.replace(/,/g, '').replace('−', '-'));
  return Number(s.replace(/\s/g, '').replace('−', '-').replace(',', '.'));
}

// Har bir ustunning turini qiymatlariga qarab aniqlaydi
export function detectKinds(head: string[], body: string[][]): ColKind[] {
  return head.map((_, c) => {
    const cells = body.map((r) => (r[c] ?? '').trim()).filter((s) => !isBlank(s));
    if (cells.length === 0) return 'text';
    if (cells.every(isNumberCell)) return 'number';
    if (cells.every((s) => DATE_RE.test(s))) return 'date';
    if (cells.every((s) => DATETIME_RE.test(s) || DATE_RE.test(s))) return 'datetime';
    return 'text';
  });
}

const toDate = (s: string) => {
  const [d, t = '00:00'] = s.split(' ');
  const [y, m, day] = d.split('-').map(Number);
  const [h, mi] = t.split(':').map(Number);
  // UTC sifatida yoziladi: Excel'da Toshkent vaqti o'zgarmay ko'rinadi
  return new Date(Date.UTC(y, m - 1, day, h, mi));
};

/**
 * @param totals jadvalning "Jami" qatori (bo'lsa, oxiriga qalin qilib qo'shiladi)
 */
export async function downloadExcel(
  head: string[],
  body: string[][],
  name = 'jadval',
  totals?: string[],
) {
  const mod: any = await import('exceljs');
  const ExcelJS = mod.default ?? mod;

  const kinds = detectKinds(head, [...body, ...(totals ? [totals] : [])]);

  const convert = (r: string[]) =>
    head.map((_, c) => {
      const s = (r[c] ?? '').trim();
      if (isBlank(s)) return kinds[c] === 'text' ? '' : null;
      if (kinds[c] === 'number') return isNumberCell(s) ? parseNum(s) : s;
      if (kinds[c] === 'date' || kinds[c] === 'datetime') return DATE_RE.test(s) || DATETIME_RE.test(s) ? toDate(s) : s;
      return s;
    });

  const rows = body.map(convert);

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Jadval');

  ws.addRow(head);
  rows.forEach((r) => ws.addRow(r));

  // Sarlavha qatori
  const headerRow = ws.getRow(1);
  headerRow.font = { bold: true };
  headerRow.eachCell((cell: any) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3ECE4' } };
    cell.border = { bottom: { style: 'thin', color: { argb: 'FFEADFD2' } } };
  });
  ws.views = [{ state: 'frozen', ySplit: 1 }];
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: head.length } };

  head.forEach((title, i) => {
    // Ustun kengligi asl matn uzunligiga qarab
    const maxLen = body.reduce((m, r) => Math.max(m, (r[i] ?? '').length), title.length);
    ws.getColumn(i + 1).width = Math.min(Math.max(maxLen + 2, 8), 50);

    if (kinds[i] === 'number') {
      const texts = body.map((r) => (r[i] ?? '').trim()).filter((s) => !isBlank(s));
      const grouped = texts.some((s) => /\s/.test(s) || EN_NUM_RE.test(s));
      const decimals = rows.some((r) => typeof r[i] === 'number' && !Number.isInteger(r[i]));
      const fmt = (grouped ? '#,##0' : '0') + (decimals ? '.00' : '');

      ws.getRow(1).getCell(i + 1).alignment = { horizontal: 'right' };
      rows.forEach((_, k) => {
        const cell = ws.getRow(k + 2).getCell(i + 1);
        cell.numFmt = fmt;
        cell.alignment = { horizontal: 'right' };
      });
    } else if (kinds[i] === 'date' || kinds[i] === 'datetime') {
      ws.getColumn(i + 1).width = kinds[i] === 'datetime' ? 18 : 12;
      rows.forEach((_, k) => {
        ws.getRow(k + 2).getCell(i + 1).numFmt = kinds[i] === 'datetime' ? 'yyyy-mm-dd hh:mm' : 'yyyy-mm-dd';
      });
    }
  });

  if (totals) {
    const row = ws.addRow(convert(totals));
    row.font = { bold: true };
    head.forEach((_, i) => {
      const cell = row.getCell(i + 1);
      cell.border = { top: { style: 'thin', color: { argb: 'FFEADFD2' } } };
      if (kinds[i] === 'number') {
        cell.numFmt = ws.getRow(2).getCell(i + 1).numFmt || '#,##0';
        cell.alignment = { horizontal: 'right' };
      }
    });
  }

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}-${new Date().toLocaleDateString('sv-SE')}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

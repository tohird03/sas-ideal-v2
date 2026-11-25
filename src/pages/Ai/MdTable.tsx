import { useMemo, useState } from 'react';
import { Button, Table } from 'antd';
import { detectKinds, downloadExcel, parseNum } from './excel';
import { DownloadIcon } from './icons';
import React from 'react';

// hast tugunidan matnni yig'adi
const nodeText = (n: any): string =>
  n.type === 'text' ? n.value : (n.children ?? []).map(nodeText).join('');

const rowsOf = (section: any) =>
  (section?.children ?? []).filter((c: any) => c.tagName === 'tr');

const cellsOf = (tr: any) =>
  (tr?.children ?? []).filter((c: any) => c.type === 'element').map(nodeText);

// Backend "Jami" qatorini ['', 'Jami', '12 000', ...] ko'rinishida yuboradi
const isTotalsRow = (row: string[]) =>
  row.length > 1 && (row[0] === 'Jami' || (row[0] === '' && row[1] === 'Jami'));

// Har qanday markdown jadvalni Ant Design Table ga aylantiradi va tepasiga Excel tugmasini qo'yadi
export function MdTable({ node }: { node?: any }) {
  const [loading, setLoading] = useState(false);

  const { head, body, totals } = useMemo(() => {
    const children = node?.children ?? [];
    const thead = children.find((c: any) => c.tagName === 'thead');
    const tbody = children.find((c: any) => c.tagName === 'tbody');

    const head: string[] = cellsOf(rowsOf(thead)[0]);
    let body: string[][] = rowsOf(tbody).map(cellsOf);
    let totals: string[] | undefined;

    const last = body[body.length - 1];
    if (last && isTotalsRow(last)) {
      totals = last;
      body = body.slice(0, -1);
    }
    return { head, body, totals };
  }, [node]);

  // Ustun turi (son, sana, matn) qiymatlarga qarab aniqlanadi
  const kinds = useMemo(() => detectKinds(head, body), [head, body]);

  const columns = head.map((title, i) => {
    const kind = kinds[i];
    return {
      title,
      dataIndex: String(i),
      key: String(i),
      align: kind === 'number' ? ('right' as const) : undefined,
      sorter: (a: any, b: any) => {
        const x = String(a[i] ?? '');
        const y = String(b[i] ?? '');
        if (kind === 'number') return (x ? parseNum(x) : -Infinity) - (y ? parseNum(y) : -Infinity);
        return x.localeCompare(y, 'ru');
      },
    };
  });

  const data = body.map((row, k) => ({
    key: k,
    ...Object.fromEntries(row.map((v, i) => [String(i), v])),
  }));

  const exportExcel = async () => {
    setLoading(true);
    try {
      await downloadExcel(head, body, 'jadval', totals);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aic-table">
      <div className="aic-table-bar">
        <span>{data.length} ta qator</span>
        <Button size="small" icon={<DownloadIcon />} loading={loading} onClick={exportExcel}>
          Excel yuklab olish
        </Button>
      </div>
      <Table
        size="small"
        pagination={data.length > 20 ? { pageSize: 20, size: 'small', showSizeChanger: false } : false}
        columns={columns}
        dataSource={data}
        scroll={{ x: 'max-content' }}
        summary={
          totals
            ? () => (
                <Table.Summary.Row className="aic-total-row">
                  {totals.map((v, i) => (
                    <Table.Summary.Cell key={i} index={i} align={kinds[i] === 'number' ? 'right' : undefined}>
                      <b>{v}</b>
                    </Table.Summary.Cell>
                  ))}
                </Table.Summary.Row>
              )
            : undefined
        }
      />
    </div>
  );
}

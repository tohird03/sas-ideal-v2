import { memo, useMemo } from 'react';
import { Area, Bar, Column, Line, Pie } from '@ant-design/plots';
import React from 'react';

export interface ChartPayload {
  type: 'bar' | 'column' | 'line' | 'area' | 'pie';
  title: string;
  xLabel: string;
  yLabel: string;
  data: { x: string; y: number; series: string }[];
}

const PALETTE = ['#d9732b', '#3b7dd8', '#3fb36b', '#8a5cc6', '#c0392b', '#d4a017', '#2a9d8f', '#8a7f74'];

const nf = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });
const full = (v: number) => nf.format(v).replace(/−/g, '-');

// O'q yorliqlari uchun qisqa: 1 200 000 -> 1,2 mln
const short = (v: number) => {
  const a = Math.abs(v);
  const f = (n: number, s: string) => `${nf.format(Math.round(n * 10) / 10)} ${s}`;
  if (a >= 1e9) return f(v / 1e9, 'mlrd');
  if (a >= 1e6) return f(v / 1e6, 'mln');
  if (a >= 1e3) return f(v / 1e3, 'ming');
  return full(v);
};

function Chart({ payload }: { payload: ChartPayload }) {
  const { type, data, title, yLabel } = payload;
  const multi = new Set(data.map((d) => d.series)).size > 1;

  const common: any = {
    data,
    xField: 'x',
    yField: 'y',
    height: type === 'bar' ? Math.min(Math.max(data.length * 28 + 60, 240), 640) : 320,
    autoFit: true,
    scale: { color: { range: PALETTE } },
    axis: { y: { labelFormatter: short, title: false }, x: { title: false } },
    tooltip: { items: [{ channel: 'y', valueFormatter: full }] },
    ...(multi ? { colorField: 'series' } : {}),
  };

  return (
    <div className="aic-chart">
      <div className="aic-chart-title">
        {title}
        {yLabel && !title.includes(yLabel) ? <span> — {yLabel}</span> : null}
      </div>
      {type === 'pie' ? (
        <Pie
          data={data}
          angleField="y"
          colorField="x"
          height={320}
          innerRadius={0.55}
          scale={{ color: { range: PALETTE } }}
          label={{ text: 'x', position: 'outside', style: { fontSize: 11 } }}
          legend={{ color: { position: 'bottom', layout: { justifyContent: 'center' } } }}
          tooltip={{ items: [{ channel: 'y', valueFormatter: full }] }}
        />
      ) : type === 'bar' ? (
        <Bar {...common} />
      ) : type === 'column' ? (
        <Column {...common} />
      ) : type === 'area' ? (
        <Area {...common} />
      ) : (
        <Line {...common} point={{ shapeField: 'circle', sizeField: 3 }} />
      )}
    </div>
  );
}

// Oqim paytida blok hali to'liq emas: JSON.parse xato beradi -> skelet ko'rsatiladi
function ChartBlockImpl({ source }: { source: string }) {
  const payload = useMemo<ChartPayload | null>(() => {
    try {
      const p = JSON.parse(source);
      return Array.isArray(p?.data) && p.data.length ? p : null;
    } catch {
      return null;
    }
  }, [source]);

  if (!payload) return <div className="aic-chart aic-chart-loading">Grafik tayyorlanmoqda...</div>;
  return <Chart payload={payload} />;
}

// source o'zgarmasa qayta chizilmaydi (matn oqib kelayotganda grafik "miltillamaydi")
export const ChartBlock = memo(ChartBlockImpl);

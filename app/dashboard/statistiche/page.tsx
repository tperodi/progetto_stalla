"use client";
import { useRef, useState, useEffect } from 'react';
import { VChart as VChartReact } from '@visactor/react-vchart';
import type { VChart } from '@visactor/vchart';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardStatistiche() {
  const [year, setYear] = useState(2025);
  const [weeklyData, setWeeklyData] = useState<{ settimana: string; valore: number }[]>([]);
  const chartRef = useRef<VChart | null>(null);

  useEffect(() => {
    fetch(`/api/statistiche/andamento-settimanale?year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        setWeeklyData(
          data.map((item: { settimana: number; numero_fecondazioni: number }) => ({
            settimana: `Settimana ${item.settimana}`,
            valore: item.numero_fecondazioni,
          }))
        );
      });
  }, [year]);

const barSpec = {
  type: 'bar',
  data: [{ id: 'barData', values: weeklyData }],
  xField: 'settimana',
  yField: 'valore',
  animationAppear: {
    duration: 800,
    oneByOne: true,
    easing: 'bounceOut',
  },
  axes: [
    { type: 'band' as const, orient: 'bottom' },
    { type: 'linear' as const, orient: 'left' },
  ],
  legends: [
    {
      visible: false,
    },
  ],
  title: {
    visible: true,
    text: `Numero Fecondazioni Settimanali (${year})`,
  },
  tooltip: {
    visible: true,
  },
};

  const exportChart = () => {
    chartRef.current?.exportImg(`Fecondazioni_${year}.png`);
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Statistiche Fecondazioni</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border px-3 py-2 rounded shadow-sm"
        >
          {[2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <Button onClick={exportChart}>Esporta grafico</Button>
      </div>

      <Card className="p-4">
        <VChartReact ref={chartRef} spec={barSpec} className="h-[400px] w-full" />
      </Card>
    </div>
  );
}

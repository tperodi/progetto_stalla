'use client';

import { VChart, type VChartProps } from '@visactor/react-vchart';
import 'vchart/dist/vchart.css';

interface ChartBlockProps {
  options: VChartProps['options'];
  title: string;
}

export default function ChartBlock({ options, title }: ChartBlockProps) {
  return (
    <div className="rounded-xl border bg-white dark:bg-zinc-900 p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      <VChart options={options} className="h-64 w-full" />
    </div>
  );
}

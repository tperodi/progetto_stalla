"use client"
import React, { useEffect, useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { Card } from '@/components/ui/card'

interface ToroSuccesso {
  toro_id: number
  toro_nome: string
  totali: number
  successi: number
  percentuale_successo: number
}

type ViewMode = 'anno' | 'trimestre' | 'mese' | 'settimana' | 'giorno'

export default function DashboardStatistiche() {
  const [year, setYear] = useState<number>(2025)
  const [viewMode, setViewMode] = useState<ViewMode>('anno')
  const [aggregatedData, setAggregatedData] = useState<{ label: string, valore: number }[]>([])
  const [successData, setSuccessData] = useState<ToroSuccesso[]>([])
  const [selectedChart, setSelectedChart] = useState<'fecondazioni' | 'successo' | 'torta'>('fecondazioni')

  const refFecondazioni = useRef<ReactECharts>(null)
  const refSuccesso = useRef<ReactECharts>(null)
  const refTorta = useRef<ReactECharts>(null)

  useEffect(() => {
    const fetchData = async () => {
      const [weekly, success] = await Promise.all([
        fetch('/api/statistiche/andamento-settimanale', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ year, tipo_aggregazione: viewMode }),
        }).then((res) => res.json()),
        fetch('/api/statistiche/successo-inseminazioni').then((res) => res.json())
      ])

      setAggregatedData(weekly)
      setSuccessData(success)
    }

    fetchData()
  }, [year, viewMode])

  const downloadSelectedChartAsPNG = () => {
    const refMap = {
      fecondazioni: refFecondazioni,
      successo: refSuccesso,
      torta: refTorta
    }
    const selectedRef = refMap[selectedChart]
    if (!selectedRef.current) return

    const echartsInstance = selectedRef.current.getEchartsInstance()
    const dataURL = echartsInstance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    })

    const link = document.createElement('a')
    link.href = dataURL
    link.download = `${selectedChart}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const weeklyOption = {
    title: { text: `Fecondazioni - Vista ${viewMode}`, left: 'center' },
    tooltip: {
      trigger: 'item',
      formatter: (params: { name: string; value: number }) =>
        `<b>${params.name}</b><br/>Fecondazioni: ${params.value}`
    },
    xAxis: {
      type: 'category',
      data: aggregatedData.map(d => d.label),
      axisLabel: { rotate: 45 }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      name: 'Fecondazioni'
    },
    dataZoom: [{ type: 'slider' }, { type: 'inside' }],
    series: [
      {
        data: aggregatedData.map(d => d.valore),
        type: 'bar',
        barCategoryGap: '40%',
        barWidth: '40%',
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
          fontWeight: 'bold',
          color: '#1F2937'
        },
        itemStyle: {
          color: '#6366F1',
          borderRadius: [4, 4, 0, 0]
        },
        animationDuration: 800
      }
    ]
  }

  const sortedSuccessData = [...successData].sort((a, b) => b.percentuale_successo - a.percentuale_successo)

  const successOption = {
    title: { text: 'Successo Inseminazioni per Toro', left: 'center' },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: { name: string; value: number }[]) => {
        const data = sortedSuccessData.find(s => s.toro_nome === params[0].name)
        return `
          <b>${params[0].name}</b><br/>
          Successi: ${data?.successi} / ${data?.totali}<br/>
          Percentuale: ${params[0].value.toFixed(1)}%
        `
      }
    },
    grid: { left: 140, top: 60, bottom: 60 },
    xAxis: {
      type: 'value',
      max: 100,
      axisLabel: { formatter: '{value}%' },
      name: '% Successo'
    },
    yAxis: {
      type: 'category',
      data: sortedSuccessData.map(d => d.toro_nome),
      axisLabel: {
        fontSize: 12,
        overflow: 'break',
        width: 100,
        interval: 0
      }
    },
    series: [
      {
        type: 'bar',
        data: sortedSuccessData.map(d => d.percentuale_successo),
        label: {
          show: true,
          position: 'right',
          formatter: (val: { value: number }) => `${val.value.toFixed(1)}%`
        },
        itemStyle: { color: '#3B82F6' },
        emphasis: { itemStyle: { color: '#2563EB' } },
        barWidth: '50%',
        barGap: '30%'
      }
    ]
  }

  const pieColors = [
    '#4F46E5', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
    '#0EA5E9', '#22C55E', '#EAB308', '#D946EF'
  ]

  const tortaOption = {
    title: { text: 'Distribuzione Fecondazioni per Toro', left: 'center' },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    color: pieColors,
    series: [
      {
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: successData.map(t => ({ name: t.toro_nome, value: t.totali })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          formatter: '{b}: {d}%',
          overflow: 'break',
          fontSize: 12,
          width: 120,
          rich: {
            b: { fontWeight: 'bold' }
          }
        },
        labelLayout: { hideOverlap: false }
      }
    ]
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Statistiche</h1>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value as 'fecondazioni' | 'successo' | 'torta')}
            className="border rounded px-3 py-1 shadow-sm text-sm"
          >
            <option value="fecondazioni">Fecondazioni</option>
            <option value="successo">Successo</option>
            <option value="torta">Torta</option>
          </select>
          <button
            onClick={downloadSelectedChartAsPNG}
            className="px-3 py-1 bg-indigo-600 text-white rounded text-xs"
          >
            Scarica PNG
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 justify-center xl:justify-between">
        <Card className="p-4 w-full md:w-[48%] xl:w-[48%]">
          <div className="flex gap-2 mb-4">
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="border rounded px-3 py-1 shadow-sm text-sm"
            >
              {[ 2024, 2025].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              className="border rounded px-3 py-1 shadow-sm text-sm"
            >
              {['anno', 'trimestre', 'mese', 'settimana', 'giorno'].map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>
          <ReactECharts
            ref={refFecondazioni}
            option={weeklyOption}
            className="h-[300px] sm:h-[350px] md:h-[400px] xl:h-[600px]"
          />
        </Card>

        <Card className="p-4 w-full md:w-[48%] xl:w-[48%]">
          <ReactECharts
            ref={refSuccesso}
            option={successOption}
            className="h-[300px] sm:h-[350px] md:h-[400px] xl:h-[600px]"
          />
        </Card>

        <Card className="p-4 w-full md:w-[48%] xl:w-[48%]">
          <ReactECharts
            ref={refTorta}
            option={tortaOption}
            className="h-[300px] sm:h-[350px] md:h-[400px] xl:h-[600px]"
          />
        </Card>
      </div>
    </div>
  )
}
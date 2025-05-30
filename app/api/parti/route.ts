import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { addDays, parseISO, isWithinInterval } from 'date-fns'

export async function POST(req: Request) {
  const { start, end } = await req.json()

  const { data, error } = await supabase
    .from('fecondazione')
    .select(`
      id_bovino,
      data_fecondazione,
      bovino (
        id,
        nome,
        matricola
      )
    `)
    .order('data_fecondazione', { ascending: false })

  if (error) return NextResponse.json({ error }, { status: 500 })

  const latestMap = new Map<number, {
    id_bovino: number
    data_fecondazione: string
    bovino: { id: number; nome: string; matricola: string } | { id: number; nome: string; matricola: string }[]
  }>()

  for (const f of data) {
    if (!f.bovino) continue

    // Se bovino è un array, prendiamo il primo elemento
    const bovinoObj = Array.isArray(f.bovino) ? f.bovino[0] : f.bovino

    if (!latestMap.has(f.id_bovino)) {
      latestMap.set(f.id_bovino, {
        ...f,
        bovino: bovinoObj,
      })
    }
  }

  const filtered = Array.from(latestMap.values()).filter((f) => {
    const partoPrevisto = addDays(parseISO(f.data_fecondazione), 282)
    return isWithinInterval(partoPrevisto, {
      start: parseISO(start),
      end: parseISO(end),
    })
  })

  const result = filtered.map((f) => ({
    id: (f.bovino as { id: number; nome: string; matricola: string }).id,
nome: (f.bovino as { id: number; nome: string; matricola: string }).nome,
matricola: (f.bovino as { id: number; nome: string; matricola: string }).matricola,

    data_ultima_fecondazione: f.data_fecondazione,
    data_previsto_parto: addDays(parseISO(f.data_fecondazione), 282).toISOString().split('T')[0],
  }))

  return NextResponse.json(result)
}

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { addDays, parseISO, isWithinInterval } from 'date-fns'

export async function GET() {

  const { data, error } = await supabase
    .from('parto')
    .select('*, bovino(nome, matricola)')
    .order('data_parto', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const id_bovino = Number(body.id_bovino)

  const { data, error } = await supabase
    .from('parto')
    .insert({
      id_bovino,
      data_parto: body.data_parto,
      tipo_parto: body.tipo_parto,
      note: body.note
    })
    .select('id, id_bovino, data_parto, tipo_parto, note, bovino(nome, matricola)')
    .single()

  if (error) {
    console.error("Errore Supabase:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(req: Request) {
  const body = await req.json()

  const { data, error } = await supabase
    .from('parto')
    .update({
      data_parto: body.data_parto,
      tipo_parto: body.tipo_parto,
      note: body.note
    })
    .eq('id', body.id)
    .select('*, bovino(nome, matricola)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST_PREVISTI(req: Request) {
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
    bovino: { id: number; nome: string; matricola: string }
  }>()

  for (const f of data) {
    if (!f.bovino) continue

    const bovinoObj = Array.isArray(f.bovino) ? f.bovino[0] : f.bovino

    if (!latestMap.has(f.id_bovino)) {
      latestMap.set(f.id_bovino, {
        id_bovino: f.id_bovino,
        data_fecondazione: f.data_fecondazione,
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
    id: f.bovino.id,
    nome: f.bovino.nome,
    matricola: f.bovino.matricola,
    data_ultima_fecondazione: f.data_fecondazione,
    data_previsto_parto: addDays(parseISO(f.data_fecondazione), 282).toISOString().split('T')[0],
  }))

  return NextResponse.json(result)
}
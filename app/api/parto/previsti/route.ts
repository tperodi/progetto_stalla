import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { addDays, parseISO, isWithinInterval } from 'date-fns'

export async function POST(req: Request) {
  const { start, end } = await req.json()

  // Fetch tutte le fecondazioni (ultime per bovino)
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

  // Mappa per prendere solo l'ultima fecondazione per bovino
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

  // Ottieni gli ID dei bovini con parto registrato
  const { data: partiRegistrati, error: partoError } = await supabase
    .from('parto')
    .select('id_bovino')

  if (partoError) return NextResponse.json({ error: partoError }, { status: 500 })

  const boviniConParto = new Set(partiRegistrati.map(p => p.id_bovino))

  // Filtro per data prevista e assenza di parto
  const filtered = Array.from(latestMap.values()).filter((f) => {
    const partoPrevisto = addDays(parseISO(f.data_fecondazione), 282)
    return (
      isWithinInterval(partoPrevisto, {
        start: parseISO(start),
        end: parseISO(end),
      }) &&
      !boviniConParto.has(f.id_bovino) // <-- qui il controllo principale
    )
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

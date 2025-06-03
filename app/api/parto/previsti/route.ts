import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { addDays, parseISO, isWithinInterval } from 'date-fns'

type BovinoConFecondazione = {
  id: number
  id_bovino: number
  data_fecondazione: string
  bovino: {
    id: number
    nome: string
    matricola: string
  } | {
    id: number
    nome: string
    matricola: string
  }[] // fallback per array
}

export async function POST(req: Request) {
  const { start, end } = await req.json()

  // 1. Fecondazioni ordinate per data decrescente
  const { data: fecondazioni, error: fecondazioniError } = await supabase
    .from('fecondazione')
    .select(`
      id,
      id_bovino,
      data_fecondazione,
      bovino:id_bovino (
        id,
        nome,
        matricola
      )
    `)
    .order('data_fecondazione', { ascending: false })

  if (fecondazioniError) {
    return NextResponse.json({ error: fecondazioniError.message }, { status: 500 })
  }

  // 2. Parti registrati
  const { data: parti, error: partiError } = await supabase
    .from('parto')
    .select('id_bovino')

  if (partiError) {
    return NextResponse.json({ error: partiError.message }, { status: 500 })
  }

  const boviniConParto = new Set(parti.map(p => p.id_bovino))

  // 3. Ultima fecondazione per ogni bovino
  const latestMap = new Map<number, typeof fecondazioni[0]>()

  for (const f of fecondazioni) {
    if (!f.id_bovino || !f.bovino) continue
    if (!latestMap.has(f.id_bovino)) {
      latestMap.set(f.id_bovino, f)
    }
  }

  // 4. Filtro su data prevista del parto e assenza di parto registrato
  const filtered = Array.from(latestMap.values()).filter(f => {
    const dataFecondazione = parseISO(f.data_fecondazione)
    const dataPartoPrevisto = addDays(dataFecondazione, 282)

    return (
      isWithinInterval(dataPartoPrevisto, {
        start: parseISO(start),
        end: parseISO(end),
      }) &&
      !boviniConParto.has(f.id_bovino)
    )
  })

  // 5. Risultato finale
  

const result = filtered.map((f: BovinoConFecondazione) => {
  const bovino = Array.isArray(f.bovino) ? f.bovino[0] : f.bovino
  return {
    id: bovino.id,
    nome: bovino.nome,
    matricola: bovino.matricola,
    data_ultima_fecondazione: f.data_fecondazione,
    data_previsto_parto: addDays(parseISO(f.data_fecondazione), 282).toISOString().split('T')[0],
  }
})


  return NextResponse.json(result)
}

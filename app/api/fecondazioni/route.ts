import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET: tutte le fecondazioni con info su bovino e toro
export async function GET() {
  const { data, error } = await supabase
    .from('fecondazione')
    .select(`
      id,
      data_fecondazione,
      esito,
      note,
      tipo,
      bovino: id_bovino ( id, nome, matricola ),
      toro: id_toro ( id, nome )
    `)
    .order('data_fecondazione', { ascending: false })

  if (error) {
    console.error('Errore GET fecondazioni:', error)
    return NextResponse.json({ error: 'Errore recupero fecondazioni' }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST: inserisce una nuova fecondazione
export async function POST(req: Request) {
  const body = await req.json()
  console.log('📥 Body ricevuto:', body)

  const { data, error } = await supabase
    .from('fecondazione')
    .insert({
      id_bovino: body.bovinoId,
      id_toro: body.toroId,
      data_fecondazione: body.data,
      esito: body.esito,
      note: body.note,
      tipo: body.tipo // Assicurati che il frontend invii 'tipo'
    })
    .select()

  if (error) {
    console.error('❌ Errore POST fecondazione:', error)
    return NextResponse.json({ error: error.message, details: error.details }, { status: 500 })
  }

  return NextResponse.json(data?.[0] || {})
}

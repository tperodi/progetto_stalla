import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  

  const { data, error } = await supabase
    .from('evento_sanitario')
    .select(`
      id,
      tipo_evento,
      descrizione,
      data_evento,
      id_bovino,
      bovino (
        id,
        matricola,
        nome
      )
    `)
    .order('data_evento', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()

  const { data, error } = await supabase
    .from('evento_sanitario')
    .insert({
      tipo_evento: body.tipo,
      descrizione: body.descrizione,
      data_evento: body.data,
      id_bovino: body.bovinoId
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

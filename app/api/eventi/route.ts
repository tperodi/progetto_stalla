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

export async function PATCH(req: Request) {
  const body = await req.json()

  const { id, tipo, descrizione, data, bovinoId } = body

  const { data: updated, error } = await supabase
    .from('evento_sanitario')
    .update({
      tipo_evento: tipo,
      descrizione: descrizione,
      data_evento: data,
      id_bovino: bovinoId,
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(updated)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()

  const { error } = await supabase
    .from('evento_sanitario')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}

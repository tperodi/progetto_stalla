import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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


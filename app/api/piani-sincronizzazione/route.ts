import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const body = await req.json()
  const { nome, data_inizio,data_fine, note } = body

  const { data, error } = await supabase
    .from('piano_sincronizzazione')
    .insert([{ nome, data_inizio, note, data_fine }])
    .select()

  if (error) {
    console.error('Errore creazione piano:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0])
}

export async function GET() {
  const { data, error } = await supabase
    .from('piano_sincronizzazione')
    .select('*')
    .order('data_inizio', { ascending: false })

  if (error) {
    console.error('Errore fetch piani:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

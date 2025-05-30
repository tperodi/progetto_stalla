import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'


export async function GET() {
  const { data, error } = await supabase
    .from('toro') // Nome della tabella
    .select('*') // Solo i campi necessari

  if (error) {
    console.error('Errore nel recupero tori:', error)
    return NextResponse.json({ error: 'Errore nel recupero dei tori' }, { status: 500 })
  }

  return NextResponse.json(data)
}

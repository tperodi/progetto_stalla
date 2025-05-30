import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { stato_riproduttivo, stato_ginecologico } = await req.json()
  const { data, error } = await supabase
    .from('bovino')
    .select('*')
    .or(`stato_riproduttivo.eq.${stato_riproduttivo},stato_ginecologico.eq.${stato_ginecologico}`)

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
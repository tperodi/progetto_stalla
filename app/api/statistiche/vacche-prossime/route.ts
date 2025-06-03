import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface Body { start: string; end: string }

export async function POST(req: Request) {
  const { start, end } = (await req.json()) as Body

  const { data, error } = await supabase.rpc('vacche_prossime_parto', {
    start_date: start,
    end_date: end,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

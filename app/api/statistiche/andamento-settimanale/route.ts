import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { year, tipo_aggregazione } = await req.json()
  const { data, error } = await supabase.rpc('andamento_fecondazioni_temporale', {
    anno: year,
    tipo_aggregazione
  })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

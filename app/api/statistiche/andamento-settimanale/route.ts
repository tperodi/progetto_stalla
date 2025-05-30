import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { year } = await req.json()
  const { data, error } = await supabase.rpc('andamento_fecondazioni_settimanale', { anno: year })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

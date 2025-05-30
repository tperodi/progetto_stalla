import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  const { data, error } = await supabase.rpc('conta_fecondazioni_per_toro')
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
// app/api/bovini/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Assicurati che il percorso sia corretto

export async function GET() {
  const { data, error } = await supabase.rpc('bovini_con_dati_completi').order('matricola', { ascending: true }) // ordinamento crescente

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const {
    matricola,
    nome,
    sesso,
    data_nascita,
    stato_riproduttivo,
    note,
    id_madre,
    id_padre,
    id_stalla
  } = body

  const { data, error } = await supabase
    .from('bovino')
    .insert([
      {
        matricola,
        nome,
        sesso,
        data_nascita,
        stato_riproduttivo,
        note,
        id_madre,
        id_padre,
        id_stalla,
      }
    ])
    .select()
    .single()
    

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}


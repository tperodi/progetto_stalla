// app/api/bovini/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/* ---------- PUT: aggiorna un bovino ---------- */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // 👈  params è Promise
) {
  const { id } = await params                        // 👈  await la promise
  const bovinoId = Number(id)

  if (!bovinoId) {
    return NextResponse.json({ error: 'ID non valido' }, { status: 400 })
  }

  /* prendi solo i campi ammessi */
  const {
    matricola,
    nome,
    data_nascita,
    sesso,
    stato_riproduttivo,
    id_madre,
    id_padre,
    id_stalla,
    note,
  } = await req.json()

  const { error } = await supabase
    .from('bovino')
    .update({
      matricola,
      nome,
      data_nascita,
      sesso,
      stato_riproduttivo,
      id_madre,
      id_padre,
      id_stalla,
      note,
    })
    .eq('id', bovinoId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Bovino aggiornato' }, { status: 200 })
}

/* ---------- DELETE: elimina un bovino ---------- */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // 👈  stessa cosa qui
) {
  const { id } = await params
  const bovinoId = Number(id)

  if (!bovinoId) {
    return NextResponse.json({ error: 'ID non valido' }, { status: 400 })
  }

  const { error } = await supabase.from('bovino').delete().eq('id', bovinoId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Bovino eliminato' }, { status: 200 })
}

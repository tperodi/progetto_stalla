// app/api/bovini/[id]/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/* ---------- PUT /api/bovini/[id] ---------- */
export async function PUT(
  req: Request,                            // <-- usare Request
  { params }: { params: { id: string } }   //     firma corretta
) {
  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'ID non valido' }, { status: 400 })
  }

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
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Bovino aggiornato' }, { status: 200 })
}

/* ---------- DELETE /api/bovini/[id] ---------- */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'ID non valido' }, { status: 400 })
  }

  const { error } = await supabase.from('bovino').delete().eq('id', id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Bovino eliminato' }, { status: 200 })
}

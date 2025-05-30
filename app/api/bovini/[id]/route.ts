import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params
  const parsedId = parseInt(id)

  if (isNaN(parsedId)) {
    return NextResponse.json({ error: 'ID non valido' }, { status: 400 })
  }

  try {
    const body = await req.json()

    // Rimuovi dal body eventuali proprietà non appartenenti alla tabella "bovino"
    const {
      matricola,
      nome,
      data_nascita,
      sesso,
      stato_riproduttivo,
      id_madre,
      id_padre,
      id_stalla,
      note
    } = body

    const updateData = {
      matricola,
      nome,
      data_nascita,
      sesso,
      stato_riproduttivo,
      id_madre,
      id_padre,
      id_stalla,
      note
    }

    const { error } = await supabase
      .from('bovino')
      .update(updateData)
      .eq('id', parsedId)

    if (error) {
      console.error('Errore Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Bovino aggiornato' }, { status: 200 })
  } catch (err) {
    console.error('Errore generico:', err)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}


// DELETE: elimina un bovino
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  const { error } = await supabase.from('bovino').delete().eq('id', id);
  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ message: 'Bovino eliminato' });
}

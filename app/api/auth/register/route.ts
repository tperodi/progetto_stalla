// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password, nome } = await req.json()

    if (!email || !password || !nome) {
      return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })
    }

    // Cripta la password
    const password_hash = await bcrypt.hash(password, 10)

    // Inserisci l'utente con la colonna corretta
    const { data, error: insertError } = await supabase
      .from('utente')
      .insert([{ email, password_hash, nome }])
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ user: data }, { status: 201 })
  } catch (error) {
    console.error('Errore nella registrazione:', error)
    return NextResponse.json({ error: 'Errore nella creazione utente' }, { status: 500 })
  }
}

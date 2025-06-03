import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const { data: users, error } = await supabase
    .from('utente')
    .select('id, email, password_hash, nome, ruolo')
    .eq('email', email)
    .limit(1)

  if (error || !users || users.length === 0) {
    return NextResponse.json({ error: 'Utente non trovato' }, { status: 401 })
  }

  const utente = users[0]

  const passwordCorretta = await bcrypt.compare(password, utente.password_hash)

  if (!passwordCorretta) {
    return NextResponse.json({ error: 'Password errata' }, { status: 401 })
  }

  // Crea un token semplice (es. id + ruolo) - puoi usare JWT se vuoi più sicurezza
  const sessionData = JSON.stringify({
    id: utente.id,
    ruolo: utente.ruolo,
    nome: utente.nome,
    email: utente.email,
  })

  ;(await cookies()).set('session', sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 giorno
  })

  return NextResponse.json({ message: 'Login effettuato', user: utente })
}

import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value

  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard')

  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/', req.url) // oppure '/login' se hai una pagina login dedicata
    loginUrl.searchParams.set('error', 'token_mancante')
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// components/landing/AuthSection.tsx
'use client'

import React, { useState, Suspense } from 'react'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

import QueryWarning from '@/components/QueryWarning'

/* ——————————————————————————————————————
   Form di login / registrazione
————————————————————————————————————— */
export default function AuthSection() {
  const [showPassword, setShowPassword] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const [email, setEmail] = useState('')
  const [nome, setNome] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()

  /* handle form submit ---------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login'
    const body = isRegistering ? { email, password, nome } : { email, password }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    if (res.ok) {
      toast.success(
        isRegistering
          ? 'Registrazione completata'
          : `Benvenuto ${data.user?.nome || data.user?.email}`,
      )
      router.push('/dashboard')
    } else {
      toast.error(data.error || 'Errore')
    }
  }

  /* JSX ------------------------------------------------------------------- */
  return (
    <section
      id="login"
      className="w-full py-16 bg-gradient-to-br from-green-50 to-white"
    >
      {/* mostra eventuali warning derivanti dalla query-string */}
      <Suspense fallback={null}>
        <QueryWarning />
      </Suspense>

      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* titolo -------------------------------------------------------- */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isRegistering
                ? 'Registrati su StallaSmart'
                : 'Accedi a StallaSmart'}
            </h2>
            <p className="text-gray-600">
              Gestisci la tua stalla in modo intelligente
            </p>
          </div>

          {/* card ---------------------------------------------------------- */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* nome (solo in registrazione) */}
              {isRegistering && (
                <div>
                  <Label
                    htmlFor="nome"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Nome
                  </Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Mario Rossi"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
              )}

              {/* email ---------------------------------------------------- */}
              <div>
                <Label
                  htmlFor="email"
                  className="block text-gray-700 mb-2 font-medium"
                >
                  Email
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="mario.rossi@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* password ------------------------------------------------- */}
              <div>
                <Label
                  htmlFor="password"
                  className="block text-gray-700 mb-2 font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* submit ---------------------------------------------------- */}
              <Button type="submit" className="w-full">
                {isRegistering ? 'Registrati' : 'Accedi'}
              </Button>

              {/* switch login/registrati ---------------------------------- */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  {isRegistering
                    ? 'Hai già un account? '
                    : 'Non hai ancora un account? '}
                  <button
                    type="button"
                    onClick={() => setIsRegistering((v) => !v)}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    {isRegistering ? 'Accedi' : 'Registrati'}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

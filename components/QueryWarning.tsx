/* components/landing/QueryWarning.tsx
   – piccolo componente client-side montato in <Suspense> */
'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function QueryWarning() {
  const searchParams = useSearchParams()          // ✅ import “normale”
  const error = searchParams.get('error')

  useEffect(() => {
    if (error === 'token_mancante')
      toast.warning('Per accedere devi effettuare il login')
    else if (error === 'token_scaduto')
      toast.warning('Sessione scaduta, effettua di nuovo il login')
  }, [error])

  return null
}

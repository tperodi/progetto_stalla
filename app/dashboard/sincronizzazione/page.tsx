'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function SincronizzazioniPage() {
  const [piano, setPiano] = useState('')
  const [saved, setSaved] = useState<string[]>([])

  const handleSubmit = () => {
    if (!piano) return toast.error('Inserisci un piano')
    setSaved([...saved, piano])
    setPiano('')
    toast.success('Piano salvato')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Piani di sincronizzazione</h1>
      <div className="flex gap-2">
        <Input
          placeholder="Inserisci descrizione piano"
          value={piano}
          onChange={e => setPiano(e.target.value)}
        />
        <Button onClick={handleSubmit}>Aggiungi</Button>
      </div>
      <ul className="list-disc pl-6">
        {saved.map((p, i) => <li key={i}>{p}</li>)}
      </ul>
    </div>
  )
}
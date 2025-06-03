'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface Piano {
  id: number
  nome: string
  data_inizio: string
  data_fine: string | null
  note: string
}

export default function PianiSincronizzazionePage() {
  const [piani, setPiani] = useState<Piano[]>([])
  const [nome, setNome] = useState('')
  const [dataInizio, setDataInizio] = useState('')
  const [dataFine, setDataFine] = useState('')
  const [note, setNote] = useState('')

  const fetchPiani = async () => {
    const res = await fetch('/api/piani-sincronizzazione')
    const data = await res.json()
    setPiani(data)
  }

  const aggiungiPiano = async () => {
    const res = await fetch('/api/piani-sincronizzazione', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        data_inizio: dataInizio,
        data_fine: dataFine || null, // invia null se vuoto
        note
      })
    })

    if (res.ok) {
      toast.success('Piano creato con successo')
      setNome('')
      setDataInizio('')
      setDataFine('')
      setNote('')
      fetchPiani()
    } else {
      toast.error('Errore nella creazione del piano')
    }
  }

  useEffect(() => {
    fetchPiani()
  }, [])

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">📅 Piani di Sincronizzazione</h1>

      <Card className="p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">➕ Nuovo Piano</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input placeholder="Nome piano" value={nome} onChange={(e) => setNome(e.target.value)} />
          <Input type="date" value={dataInizio} onChange={(e) => setDataInizio(e.target.value)} />
          <Input type="date" value={dataFine} onChange={(e) => setDataFine(e.target.value)} placeholder="Data fine (opzionale)" />
          <Textarea
            className="col-span-1 sm:col-span-2"
            placeholder="Note (es. protocollo, farmaci...)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <Button className="mt-4" onClick={aggiungiPiano}>Crea Piano</Button>
      </Card>

      <h2 className="text-xl font-semibold mb-4">📋 Elenco Piani</h2>
      <div className="space-y-4">
        {piani.map(p => (
          <Card key={p.id} className="p-4">
            <p className="font-semibold">{p.nome}</p>
            <p>📅 Inizio: {p.data_inizio}</p>
            {p.data_fine && <p>📅 Fine: {p.data_fine}</p>}
            <p className="text-sm text-gray-600 whitespace-pre-line mt-2">{p.note}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

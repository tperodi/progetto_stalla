'use client'

import { useEffect, useState } from 'react'
import { format, parseISO, addDays } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import BovinoCombobox from '@/components/shared/bovinoComboBox'

export default function PartiPage() {
  type Parto = {
    id: number
    id_bovino: number
    data_parto: string
    tipo_parto: string | null
    note: string | null
    bovino: {
      nome: string
      matricola: string
    }
  }

  type BovinoPrevisto = {
    id: number
    nome: string
    matricola: string
    data_ultima_fecondazione: string
    data_previsto_parto: string
  }

  const [parti, setParti] = useState<Parto[]>([])
  const [previsti, setPrevisti] = useState<BovinoPrevisto[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [newParto, setNewParto] = useState({
    id_bovino: 0,
    data_parto: '',
    tipo_parto: '',
    note: ''
  })

  useEffect(() => {
    fetchParti()
    fetchPrevisti()
  }, [])

  const fetchParti = async () => {
    const res = await fetch('/api/parto')
    const data = await res.json()
    setParti(data)
    setLoading(false)
  }

  const fetchPrevisti = async () => {
    const today = new Date()
    const future = addDays(today, 30)
    const res = await fetch('/api/parto/previsti', {
      method: 'POST',
      body: JSON.stringify({
        start: today.toISOString().split('T')[0],
        end: future.toISOString().split('T')[0],
      })
    })
    const data = await res.json()
    setPrevisti(data)
  }

  const handleAdd = async () => {
  const res = await fetch('/api/parto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...newParto, id_bovino: Number(newParto.id_bovino) })
  })

  const data = await res.json()

  if (!data.error) {
    setParti([data, ...parti])
    setPrevisti(prev => prev.filter(b => b.id !== Number(newParto.id_bovino))) // ⬅️ Rimuove il bovino dalla lista previsti
    setNewParto({ id_bovino: 0, data_parto: '', tipo_parto: '', note: '' })
    setOpen(false)
  } else {
    console.error("Errore API:", data.error)
  }
}


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Parti</h1>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Registra nuovo parto</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuovo Parto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
    <BovinoCombobox
  value={newParto.id_bovino}
  onChange={(val: number) => setNewParto({ ...newParto, id_bovino: val })}
/>


            <Input
              type="date"
              value={newParto.data_parto}
              onChange={(e) => setNewParto({ ...newParto, data_parto: e.target.value })}
            />
            <Input
              placeholder="Tipo parto"
              value={newParto.tipo_parto}
              onChange={(e) => setNewParto({ ...newParto, tipo_parto: e.target.value })}
            />
            <Textarea
              placeholder="Note"
              value={newParto.note}
              onChange={(e) => setNewParto({ ...newParto, note: e.target.value })}
            />
            <Button onClick={handleAdd}>Salva</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Parti previsti entro 30 giorni</h2>
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          previsti.length > 0 ? (
            previsti.map(b => (
  <div key={b.id} className="border p-3 rounded flex justify-between items-center">
    <div>
      <p><strong>{b.nome}</strong> ({b.matricola})</p>
      <p>Data prevista: {format(parseISO(b.data_previsto_parto), 'dd/MM/yyyy')}</p>
    </div>
    <Button
      variant="outline"
      onClick={() => {
        setNewParto({
          id_bovino: b.id,
          data_parto: b.data_previsto_parto,
          tipo_parto: '',
          note: ''
        })
        setOpen(true)
      }}
    >
      Conferma parto
    </Button>
  </div>
))
          ) : <p>Nessun parto previsto entro 30 giorni.</p>
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Parti registrati</h2>
        {parti.length > 0 ? (
          parti.map(p => (
            <div key={p.id} className="border p-3 rounded">
              <p><strong>{p.bovino.nome}</strong> ({p.bovino.matricola})</p>
              <p>Data parto: {format(parseISO(p.data_parto), 'dd/MM/yyyy')}</p>
              {p.tipo_parto && <p>Tipo: {p.tipo_parto}</p>}
              {p.note && <p>Note: {p.note}</p>}
            </div>
          ))
        ) : <p>Nessun parto registrato.</p>}
      </div>
    </div>
  )
}

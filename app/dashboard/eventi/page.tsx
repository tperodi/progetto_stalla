'use client'

import { useState, useEffect } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from '@/components/ui/select'
import { PlusCircle, Loader2, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const eventiOptions = [
  'Inseminazione',
  'Diagnosi gravidanza',
  'Data asciutta',
  'Patologia',
  'Vaccinazione',
  'Visita'
]

type Evento = {
  id: number
  tipo_evento: string
  descrizione: string
  data_evento: string
  id_bovino: number
  bovino: {
    nome: string
    matricola: string
  }
}

export default function EventiSanitariRiproduttivi() {
  const [eventi, setEventi] = useState<Evento[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({
    tipo: '',
    data: '',
    descrizione: '',
    bovinoId: ''
  })
  const [loading, setLoading] = useState(true)

  const fetchEventi = async () => {
    try {
      const res = await fetch('/api/eventi')
      const data = await res.json()
      setEventi(data)
    } catch {
      toast.error('Errore nel caricamento eventi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEventi()
  }, [])

  const handleSubmit = async () => {
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/eventi/${editingId}` : '/api/eventi'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_evento: form.tipo,
          data_evento: form.data,
          descrizione: form.descrizione,
          id_bovino: parseInt(form.bovinoId)
        })
      })
      if (!res.ok) throw new Error()
      toast.success(editingId ? 'Evento aggiornato' : 'Evento registrato')
      setDialogOpen(false)
      setForm({ tipo: '', data: '', descrizione: '', bovinoId: '' })
      setEditingId(null)
      fetchEventi()
    } catch {
      toast.error('Errore durante il salvataggio')
    }
  }

  const handleEdit = (e: Evento) => {
    setForm({
      tipo: e.tipo_evento,
      data: e.data_evento,
      descrizione: e.descrizione,
      bovinoId: e.id_bovino.toString()
    })
    setEditingId(e.id)
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Vuoi eliminare questo evento?')) return
    try {
      const res = await fetch(`/api/eventi/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Evento eliminato')
      fetchEventi()
    } catch {
      toast.error('Errore durante l eliminazione')
    }
  }

  return (
    <div className="space-y-6 px-4 md:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Eventi sanitari e riproduttivi</h1>
        <Button onClick={() => {
          setForm({ tipo: '', data: '', descrizione: '', bovinoId: '' })
          setEditingId(null)
          setDialogOpen(true)
        }} className="self-start md:self-auto">
          <PlusCircle className="mr-2 w-4 h-4" /> Nuovo evento
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center mt-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {eventi.map((e) => (
            <div key={e.id} className="border rounded-lg p-4 text-sm shadow-sm bg-white dark:bg-zinc-900">
              <div className="font-medium mb-1 text-base text-primary">{e.tipo_evento}</div>
              <p className="text-muted-foreground text-sm mb-1">{e.data_evento}</p>
              <p className="text-sm">{e.descrizione}</p>
              <p className="text-sm italic mt-1">Bovino: {e.bovino?.nome} ({e.bovino?.matricola})</p>
              <div className="mt-3 flex gap-2">
                <Button size="icon" variant="outline" onClick={() => handleEdit(e)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(e.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modifica evento' : 'Nuovo evento'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label>Tipo evento</Label>
              <Select value={form.tipo} onValueChange={(val) => setForm({ ...form, tipo: val })}>
                <SelectTrigger><SelectValue placeholder="Seleziona tipo" /></SelectTrigger>
                <SelectContent>
                  {eventiOptions.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Data evento</Label>
              <Input
                type="date"
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
              />
            </div>

            <div>
              <Label>Descrizione</Label>
              <Input
                value={form.descrizione}
                onChange={(e) => setForm({ ...form, descrizione: e.target.value })}
              />
            </div>

            <div>
              <Label>ID Bovino</Label>
              <Input
                value={form.bovinoId}
                onChange={(e) => setForm({ ...form, bovinoId: e.target.value })}
              />
            </div>

            <Button onClick={handleSubmit} className="mt-2">
              {editingId ? 'Salva modifiche' : 'Salva evento'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
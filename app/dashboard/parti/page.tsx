'use client'

import { useCallback, useEffect, useState } from 'react'
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
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

  const [allParti, setAllParti] = useState<Parto[]>([])
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

  const [search, setSearch] = useState('')
  const [tipo, setTipo] = useState('')
  const [dataDal, setDataDal] = useState('')
  const [visibleCount, setVisibleCount] = useState(3)

  useEffect(() => {
    fetchParti()
    fetchPrevisti()
  }, [])

  const fetchParti = async () => {
    const res = await fetch('/api/parto')
    const data = await res.json()
    setAllParti(data)
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
      setAllParti([data, ...allParti])
      setParti([data, ...parti])
      setPrevisti(prev => prev.filter(b => b.id !== Number(newParto.id_bovino)))
      setNewParto({ id_bovino: 0, data_parto: '', tipo_parto: '', note: '' })
      setOpen(false)
    } else {
      console.error("Errore API:", data.error)
    }
  }

  const handleFiltri = useCallback((search: string, tipo: string, dataDal: string) => {
    let filtrati = [...allParti]

    if (search)
      filtrati = filtrati.filter((p) =>
        `${p.bovino.nome} ${p.bovino.matricola}`.toLowerCase().includes(search.toLowerCase())
      )

    if (tipo)
      filtrati = filtrati.filter((p) =>
        (p.tipo_parto ?? '').toLowerCase().includes(tipo.toLowerCase())
      )

    if (dataDal)
      filtrati = filtrati.filter((p) => p.data_parto >= dataDal)

    setParti(filtrati)
    setVisibleCount(3)
  }, [allParti])

  useEffect(() => {
    handleFiltri(search, tipo, dataDal)
  }, [search, tipo, dataDal, handleFiltri])

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestione Parti</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>+ Nuovo parto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registra nuovo parto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label>Bovino</Label>
              <BovinoCombobox
                value={newParto.id_bovino}
                onChange={(val: number) => setNewParto({ ...newParto, id_bovino: val })}
              />
              <Label>Data parto</Label>
              <Input
                type="date"
                value={newParto.data_parto}
                onChange={(e) => setNewParto({ ...newParto, data_parto: e.target.value })}
              />
              <Label>Tipo parto</Label>
              <Input
                placeholder="Es. naturale, cesareo..."
                value={newParto.tipo_parto}
                onChange={(e) => setNewParto({ ...newParto, tipo_parto: e.target.value })}
              />
              <Label>Note</Label>
              <Textarea
                placeholder="Eventuali note sul parto"
                value={newParto.note}
                onChange={(e) => setNewParto({ ...newParto, note: e.target.value })}
              />
              <Button onClick={handleAdd}>Salva</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* PARTI PREVISTI */}
      <Card>
        <CardHeader>
          <CardTitle>Parti previsti entro 30 giorni</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : previsti.length > 0 ? (
            <div className="space-y-2">
              {previsti.map(b => (
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
              ))}
            </div>
          ) : (
            <p>Nessun parto previsto entro 30 giorni.</p>
          )}
        </CardContent>
      </Card>

      {/* FILTRI */}
      <Card>
        <CardHeader>
          <CardTitle>Filtri</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Cerca per nome o matricola</Label>
            <Input
              placeholder="Es. GYMNAST, M1049"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <Label>Tipo parto</Label>
            <Input
              placeholder="naturale, cesareo..."
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            />
          </div>
          <div>
            <Label>Data dal</Label>
            <Input
              type="date"
              value={dataDal}
              onChange={(e) => setDataDal(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* PARTI REGISTRATI */}
      <Card>
        <CardHeader>
          <CardTitle>Storico Parti Registrati</CardTitle>
        </CardHeader>
        <CardContent className=" p-2 space-y-3">
          {parti.length > 0 ? (
            <>
              <div className="grid gap-4">
                {parti.slice(0, visibleCount).map(p => (
                  <div key={p.id} className="border p-3 rounded">
                    <p><strong>{p.bovino.nome}</strong> ({p.bovino.matricola})</p>
                    <p>Data parto: {format(parseISO(p.data_parto), 'dd/MM/yyyy')}</p>
                    {p.tipo_parto && <p>Tipo: {p.tipo_parto}</p>}
                    {p.note && <p>Note: {p.note}</p>}
                  </div>
                ))}
              </div>
              {visibleCount < parti.length && (
                <div className="pt-4">
                  <Button onClick={() => setVisibleCount(prev => prev + 3)}>
                    Carica altri parti
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p>Nessun parto registrato.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

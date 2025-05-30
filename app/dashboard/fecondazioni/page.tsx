'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { PlusCircle, Check, ChevronsUpDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'



interface EventoFecondazione {
  id: number
  data_fecondazione: string
  esito: boolean | null
  note: string | null
  toro: {
    nome: string
  }
  bovino: {
    nome: string
    matricola: string
  }
}

interface Bovino {
  id: string
  nome: string
  matricola: string
}

interface Toro {
  id: string
  nome: string
}

function Combobox({
  options,
  value,
  onChange,
  placeholder
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const selectedLabel = options.find(opt => opt.value === value)?.label ?? ''

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="justify-between w-full">
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>Nessun risultato trovato.</CommandEmpty>
          <CommandGroup>
            {options.map(opt => (
              <CommandItem
                key={opt.value}
                value={opt.label}
                onSelect={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
              >
                <Check className={`mr-2 h-4 w-4 ${value === opt.value ? 'opacity-100' : 'opacity-0'}`} />
                {opt.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default function FecondazioniPage() {
  const [eventi, setEventi] = useState<EventoFecondazione[]>([])
  const [bovini, setBovini] = useState<Bovino[]>([])
  const [tori, setTori] = useState<Toro[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ data: '', bovinoId: '', toroId: '', esito: '', note: '' })
  const [filterEsito, setFilterEsito] = useState('')
  const [filterBovino, setFilterBovino] = useState('')
  const [filterToro, setFilterToro] = useState('')
  const [filterDataDa, setFilterDataDa] = useState('')
  const [filterDataA, setFilterDataA] = useState('')
  const [pagina, setPagina] = useState(1)
  const cardPerPagina = 3

  useEffect(() => {
    fetchEventi()
    fetch('/api/bovini').then(res => res.json()).then(setBovini)
    fetch('/api/tori').then(res => res.json()).then(setTori)
  }, [])

  const fetchEventi = () => {
    fetch('/api/fecondazioni').then(res => res.json()).then(setEventi)
  }

  const handleSubmit = async () => {
  const payload = {
    data: form.data,
    bovinoId: parseInt(form.bovinoId),
    toroId: parseInt(form.toroId),
    esito: form.esito === 'true',
    note: form.note
  }

  console.log('▶️ Payload inviato a /api/fecondazioni:', payload)

  try {
    const res = await fetch('/api/fecondazioni', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    console.log('✅ Risposta API:', data)

    if (!res.ok || data.error) {
      console.error('❌ Errore API:', data.error || 'Richiesta non OK')
      throw new Error(data.error || 'Errore sconosciuto')
    }

    toast.success('Fecondazione registrata')
    setDialogOpen(false)
    setForm({ data: '', bovinoId: '', toroId: '', esito: '', note: '' })
    fetchEventi()
  } catch (err) {
    console.error('❌ Eccezione nel salvataggio:', err)
    toast.error('Errore salvataggio')
  }
}



  const eventiFiltrati = eventi.filter(ev => {
    const matchEsito = filterEsito === '' || (filterEsito === 'true' && ev.esito === true) || (filterEsito === 'false' && ev.esito === false)
    const matchBovino = filterBovino === '' || ev.bovino.nome === filterBovino
    const matchToro = filterToro === '' || ev.toro.nome === filterToro
    const matchDataDa = filterDataDa === '' || new Date(ev.data_fecondazione) >= new Date(filterDataDa)
    const matchDataA = filterDataA === '' || new Date(ev.data_fecondazione) <= new Date(filterDataA)
    return matchEsito && matchBovino && matchToro && matchDataDa && matchDataA
  })

  const eventiVisualizzati = eventiFiltrati.slice(0, pagina * cardPerPagina)
  const haAltro = eventiFiltrati.length > eventiVisualizzati.length

  return (
    <div className="space-y-6 p-6 min-h-screen">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Eventi di fecondazione</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <PlusCircle className="w-4 h-4 mr-2" /> Nuovo evento
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-sm">
        <Select value={filterEsito} onValueChange={setFilterEsito}>
          <SelectTrigger><SelectValue placeholder="Filtra per esito" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Positiva</SelectItem>
            <SelectItem value="false">Negativa</SelectItem>
          </SelectContent>
        </Select>

        <Combobox
          value={filterBovino}
          onChange={setFilterBovino}
          placeholder="Filtra per bovino"
          options={bovini.map(b => ({ value: b.nome, label: b.nome }))}
        />

        <Combobox
          value={filterToro}
          onChange={setFilterToro}
          placeholder="Filtra per toro"
          options={tori.map(t => ({ value: t.nome, label: t.nome }))}
        />

        <div className="flex gap-2">
          <Input type="date" value={filterDataDa} onChange={e => setFilterDataDa(e.target.value)} />
          <Input type="date" value={filterDataA} onChange={e => setFilterDataA(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => {
          setFilterEsito(''); setFilterBovino(''); setFilterToro(''); setFilterDataDa(''); setFilterDataA('');
        }}>
          Reset filtri
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventiVisualizzati.map(ev => (
          <div key={ev.id} className="border rounded-xl p-4 shadow-sm hover:shadow-md transition-all bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-lg">{ev.bovino?.nome}</div>
              <div className="text-sm text-muted-foreground">#{ev.bovino?.matricola}</div>
            </div>
            <div className="text-sm text-gray-600 mb-1"><span className="font-medium">Toro:</span> {ev.toro?.nome}</div>
            <div className="text-sm text-gray-500"><span className="font-medium">Data:</span> {new Date(ev.data_fecondazione).toLocaleDateString('it-IT')}</div>
            <div className="text-sm text-gray-500"><span className="font-medium">Esito:</span> {ev.esito === true ? 'Positiva' : ev.esito === false ? 'Negativa' : 'ND'}</div>
            {ev.note && <div className="text-sm text-muted-foreground mt-1"><span className="font-medium">Note:</span> {ev.note}</div>}
          </div>
        ))}
      </div>

      {haAltro && <div className="flex justify-center mt-4"><Button onClick={() => setPagina(prev => prev + 1)}>Carica altri eventi</Button></div>}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            
              <DialogTitle>Nuova fecondazione</DialogTitle>
            
          </DialogHeader>
          <div className="grid gap-2">
            <Combobox
              value={form.bovinoId}
              onChange={(val) => setForm({ ...form, bovinoId: val })}
              placeholder="Seleziona bovino"
              options={bovini.map(b => ({ value: b.id, label: `${b.nome} (${b.matricola})` }))}
            />
            <Input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} />
            <Combobox
              value={form.toroId}
              onChange={(val) => setForm({ ...form, toroId: val })}
              placeholder="Seleziona toro"
              options={tori.map(t => ({ value: t.id, label: t.nome }))}
            />
            <Select value={form.esito} onValueChange={val => setForm({ ...form, esito: val })}>
              <SelectTrigger><SelectValue placeholder="Esito fecondazione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Positiva</SelectItem>
                <SelectItem value="false">Negativa</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Note aggiuntive" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
            <Button onClick={handleSubmit}>Salva</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

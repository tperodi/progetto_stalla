'use client'

import { useEffect, useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue
} from "@/components/ui/select"

import { toast } from 'sonner'
import { Pencil, PlusCircle, Loader2, Trash2, FileText } from 'lucide-react'
import { useMediaQuery } from '@/hooks/use-media-query'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import BovinoCombobox from '@/components/shared/bovinoComboBox'

const schema = z.object({
  matricola: z.string().min(1),
  nome: z.string().min(1),
  sesso: z.enum(['M', 'F']),
  data_nascita: z.string().min(1),
  stato_riproduttivo: z.string(),
  data_ultimo_parto: z.string().optional(),
  data_ultima_fecondazione: z.string().optional(),
  note: z.string().optional(),
  id_madre: z.number().optional(),
  id_padre: z.number().optional(),
})

type Bovino = {
  id: number
  matricola: string
  nome: string
  sesso: 'M' | 'F'
  data_nascita: string
  stato_riproduttivo: string
  data_ultimo_parto?: string | null
  data_ultima_fecondazione?: string | null
  note?: string
  id_madre?: number | null
  id_padre?: number | null
}

type BovinoForm = z.infer<typeof schema>

export default function BoviniPage() {
  const [bovini, setBovini] = useState<Bovino[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [search, setSearch] = useState('')
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [pagina, setPagina] = useState(1)
  const cardPerPagina = 3

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm<BovinoForm>({ resolver: zodResolver(schema) })

  const id_madre = watch('id_madre')
  const id_padre = watch('id_padre')

  const fetchBovini = async () => {
    try {
      const res = await fetch('/api/bovini')
      const data = await res.json()
      setBovini(data)
    } catch {
      toast.error('Errore nel caricamento dei bovini')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBovini()
  }, [])

  const nuovaMatricola = () => {
  if (bovini.length === 0) return 'IT0000000001'  // Se non ci sono bovini, la matricola parte da "IT0000000001"

  // Estrai l'ultima matricola e assicurati che sia valida
  const ultimeMatricole = bovini
    .map(b => b.matricola)
    .sort((a, b) => b.localeCompare(a))  // Ordina le matricole in ordine decrescente
  
  const ultimaMatricola = ultimeMatricole[0];  // Ottieni la matricola più alta
  
  // Controllo se la matricola è nel formato corretto e ha una parte numerica valida
  const numeroStr = ultimaMatricola.substring(2);  // Rimuovi "IT"
  const numero = parseInt(numeroStr);

  // Verifica che il numero sia valido
  if (isNaN(numero)) {
    throw new Error("Errore nel formato della matricola")
  }

  const nuovaMatricolaNumero = numero + 1;  // Incrementa il numero

  // Riformatta il numero per avere sempre 10 cifre
  return `IT${nuovaMatricolaNumero.toString().padStart(10, '0')}`;  // Aggiungi gli zeri iniziali se necessario
}



  const onSubmit = async (data: BovinoForm) => {
    const isEditing = editingId !== null
    const method = isEditing ? 'PUT' : 'POST'
    const url = isEditing ? `/api/bovini/${editingId}` : '/api/bovini'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const resData = await res.json()
      if (!res.ok) throw new Error(resData.error || 'Errore generico')
      toast.success(isEditing ? 'Bovino aggiornato' : 'Bovino aggiunto')
      setDialogOpen(false)
      setEditingId(null)
      reset()
      fetchBovini()
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('duplicate')) {
        toast.error('Matricola già esistente')
      } else {
        toast.error('Errore durante il salvataggio')
      }
    }
  }

  const openDialog = (b?: Bovino) => {
  if (b) {
    const safeData: Partial<BovinoForm> = {
      matricola: b.matricola,
      nome: b.nome,
      sesso: b.sesso,
      data_nascita: b.data_nascita,
      stato_riproduttivo: b.stato_riproduttivo,
      data_ultimo_parto: b.data_ultimo_parto ?? undefined,
      data_ultima_fecondazione: b.data_ultima_fecondazione ?? undefined,
      note: b.note ?? undefined,
      id_madre: b.id_madre ?? undefined,
      id_padre: b.id_padre ?? undefined,
    }
    Object.entries(safeData).forEach(([key, val]) =>
      setValue(key as keyof BovinoForm, val ?? '')
    )
    setEditingId(b.id)
  } else {
    reset()
    setEditingId(null)
    // Imposta la nuova matricola calcolata
    setValue('matricola', nuovaMatricola())
  }
  setDialogOpen(true)
}


  const handleDelete = async (id: number) => {
    if (!confirm('Vuoi davvero eliminare questo bovino?')) return
    try {
      const res = await fetch(`/api/bovini/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Bovino eliminato')
      fetchBovini()
    } catch {
      toast.error('Errore durante l’eliminazione')
    }
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.text('Lista Bovini', 14, 16)
    const rows = bovini.map(b => [
      b.matricola, b.nome, b.sesso, b.data_nascita,
      b.stato_riproduttivo, b.data_ultimo_parto ?? '-', b.data_ultima_fecondazione ?? '-', b.note ?? '-'
    ])
    autoTable(doc, {
      head: [['Matricola', 'Nome', 'Sesso', 'Nascita', 'Stato Rip.', 'Ult. Parto', 'Ult. Fecond.', 'Note']],
      body: rows,
      startY: 20,
      styles: { fontSize: 8 }
    })
    doc.save('bovini.pdf')
  }

  const filtered = bovini.filter(b =>
    b.nome.toLowerCase().includes(search.toLowerCase()) ||
    b.matricola.toLowerCase().includes(search.toLowerCase())
  )

  const boviniVisualizzati = filtered.slice(0, pagina * cardPerPagina)
  const haAltro = filtered.length > boviniVisualizzati.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold mt-10">Gestione Bovini</h1>
        <div className="flex gap-2">
          <Input placeholder="Cerca per nome o matricola" value={search} onChange={e => {
            setSearch(e.target.value)
            setPagina(1)
          }} />
          <Button onClick={handleExportPDF} variant="secondary">
            <FileText className="w-4 h-4 mr-1" /> Export PDF
          </Button>
          <Button onClick={() => openDialog()} variant="default">
            <PlusCircle className="mr-2 h-4 w-4" /> Nuovo
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : isDesktop ? (
        <div className="overflow-auto rounded-lg border">
          <table className="min-w-full text-sm text-left">
  <thead className="bg-muted text-muted-foreground">
    <tr>
      <th className="px-4 py-2">Matricola</th>
      <th className="px-4 py-2">Nome</th>
      <th className="px-4 py-2">Sesso</th>
      <th className="px-4 py-2">Nascita</th>
      <th className="px-4 py-2">Stato Rip.</th>
      <th className="px-4 py-2">Ult. Parto</th>
      <th className="px-4 py-2">Ult. Fecond.</th>
      <th className="px-4 py-2">Note</th>
      <th className="px-4 py-2">Azioni</th>
    </tr>
  </thead>
  <tbody>
    {filtered.map(b => (
      <tr
        key={b.id}
        className="border-t even:bg-muted/40 odd:bg-background"
      >
        <td className="px-4 py-2">{b.matricola}</td>
        <td className="px-4 py-2">{b.nome}</td>
        <td className="px-4 py-2">{b.sesso}</td>
        <td className="px-4 py-2">{b.data_nascita}</td>
        <td className="px-4 py-2">{b.stato_riproduttivo}</td>
        <td className="px-4 py-2">{b.data_ultimo_parto ?? '—'}</td>
        <td className="px-4 py-2">{b.data_ultima_fecondazione ?? '—'}</td>
        <td className="px-4 py-2">{b.note ?? '—'}</td>
        <td className="px-4 py-2 space-x-2">
          <Button size="icon" variant="ghost" onClick={() => openDialog(b)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => handleDelete(b.id)}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
      ) : (
        <>
          <div className="space-y-4">
            {boviniVisualizzati.map(b => (
              <div key={b.id} className="rounded-lg border p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{b.nome} ({b.matricola})</div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openDialog(b)}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(b.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </div>
                </div>
                <p className="text-sm">Sesso: {b.sesso}</p>
                <p className="text-sm">Nascita: {b.data_nascita}</p>
                <p className="text-sm">Stato riproduttivo: {b.stato_riproduttivo}</p>
                <p className="text-sm">Ultimo parto: {b.data_ultimo_parto ?? '—'}</p>
                <p className="text-sm">Ultima fecondazione: {b.data_ultima_fecondazione ?? '—'}</p>
                <p className="text-sm">Note: {b.note ?? '—'}</p>
              </div>
            ))}
          </div>
          {haAltro && (
            <div className="flex justify-center mt-4">
              <Button onClick={() => setPagina(prev => prev + 1)}>Carica altri bovini</Button>
            </div>
          )}
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modifica Bovino' : 'Nuovo Bovino'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
            <Label>Matricola</Label>
            <Input {...register('matricola')} />
            <Label>Nome</Label>
            <Input {...register('nome')} />
            <Label>Sesso</Label>
            <Select onValueChange={(val) => setValue('sesso', val as 'M' | 'F')}>
              <SelectTrigger><SelectValue placeholder="Seleziona" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Maschio</SelectItem>
                <SelectItem value="F">Femmina</SelectItem>
              </SelectContent>
            </Select>
            <Label>Data nascita</Label>
            <Input type="date" {...register('data_nascita')} />
            <Label>Stato riproduttivo</Label>
            <Input {...register('stato_riproduttivo')} />
            <Label>Ultimo parto</Label>
            <Input type="date" {...register('data_ultimo_parto')} />
            <Label>Ultima fecondazione</Label>
            <Input type="date" {...register('data_ultima_fecondazione')} />
            <Label>Note</Label>
            <Input {...register('note')} />
            <Label>Madre</Label>
            <BovinoCombobox value={id_madre ?? 0} onChange={(v) => setValue('id_madre', v)} filtroSesso="F" placeholder="Seleziona madre" />
            <Label>Padre</Label>
            <BovinoCombobox value={id_padre ?? 0} onChange={(v) => setValue('id_padre', v)} filtroSesso="M" placeholder="Seleziona padre" />
            <Button type="submit" className="w-full mt-2">{editingId ? 'Salva' : 'Aggiungi'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

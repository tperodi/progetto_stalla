'use client'

import { useEffect, useState } from 'react'
import { ChevronsUpDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover'
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/components/ui/command'

type Bovino = {
  id: number
  nome: string
  matricola: string
  sesso: 'M' | 'F'
}

interface BovinoComboboxProps {
  value: number
  onChange: (value: number) => void
  placeholder?: string
  filtroSesso?: 'M' | 'F'
}

export default function BovinoCombobox({
  value,
  onChange,
  placeholder = 'Seleziona bovino',
  filtroSesso
}: BovinoComboboxProps) {
  const [open, setOpen] = useState(false)
  const [bovini, setBovini] = useState<Bovino[]>([])

  useEffect(() => {
    const url = filtroSesso === 'M' ? '/api/tori' : '/api/bovini'
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (filtroSesso && filtroSesso !== 'M') {
          setBovini(data.filter((b: Bovino) => b.sesso === filtroSesso))
        } else {
          setBovini(data)
        }
      })
  }, [filtroSesso])

  const selected = bovini.find(b => b.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="justify-between w-full"
        >
          {selected ? `${selected.nome} (${selected.matricola})` : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 max-h-64 overflow-y-auto">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>Nessun risultato trovato.</CommandEmpty>
          <CommandGroup>
            {bovini.map(b => (
                <CommandItem
                key={b.id}
                value={b.nome}
                onSelect={() => {
                  onChange(b.id)
                  setOpen(false)
                }}
                >
                <Check className={`mr-2 h-4 w-4 ${value === b.id ? 'opacity-100' : 'opacity-0'}`} />
                {b.id} {b.nome}
                {b.matricola ? ` (${b.matricola})` : ''}
                </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
"use client"

import * as React from "react"
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export interface CalendarProps {
  /** Data selezionata */
  selected?: Date
  /** Callback quando si sceglie un giorno */
  onSelect?: (date: Date) => void
  /** Classe extra */
  className?: string
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  // mese attualmente mostrato
  const [month, setMonth] = React.useState(selected ?? new Date())

  // tutte le date da visualizzare (sempre 6 settimane complete)
  const weeks = React.useMemo(() => {
    const first = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
    const last = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
    const days: Date[] = []
    for (let d = first; d <= last; d = addDays(d, 1)) days.push(d)
    return Array.from({ length: 6 }, (_, i) => days.slice(i * 7, i * 7 + 7))
  }, [month])

  return (
    <div className={cn("w-[280px] select-none", className)}>
      {/* intestazione con mese e frecce */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setMonth(addMonths(month, -1))}
          aria-label="Mese precedente"
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="font-medium">{format(month, "MMMM yyyy")}</span>

        <button
          onClick={() => setMonth(addMonths(month, 1))}
          aria-label="Mese successivo"
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* sigle giorni */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {["Lu", "Ma", "Me", "Gi", "Ve", "Sa", "Do"].map(d => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* griglia delle date */}
      <div className="grid grid-cols-7 gap-1 mt-1">
        {weeks.flat().map(day => {
          const disabled = !isSameMonth(day, month)
          const active = selected && isSameDay(day, selected)
          return (
            <button
              key={day.toISOString()}
              disabled={disabled}
              onClick={() => onSelect?.(day)}
              className={cn(
                "h-8 w-8 rounded-sm text-sm",
                disabled && "opacity-40 cursor-default",
                active
                  ? "bg-green-600 text-white"
                  : "hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {format(day, "d")}
            </button>
          )
        })}
      </div>
    </div>
  )
}

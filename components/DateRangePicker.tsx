// components/DateRangePicker.tsx
'use client'

import * as React from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function DateRangePicker({
  dateRange,
  setDateRange,
}: {
  dateRange: { from: Date | undefined, to: Date | undefined },
  setDateRange: (range: { from: Date | undefined, to: Date | undefined }) => void
}) {
  const [open, setOpen] = React.useState(false)

  const label = dateRange.from
    ? dateRange.to
      ? `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`
      : format(dateRange.from, 'dd/MM/yyyy')
    : 'Seleziona intervallo'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[280px] justify-start text-left">
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={(range) =>
            setDateRange({
              from: range?.from ?? undefined,
              to: range?.to ?? undefined,
            })
          }
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}

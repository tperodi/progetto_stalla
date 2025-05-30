'use client';

import { useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

const statusColors = {
  'In lattazione': 'bg-purple-100 dark:bg-purple-900',
  'In asciutta': 'bg-blue-100 dark:bg-blue-900',
  'In accrescimento': 'bg-green-100 dark:bg-green-900',
  'In svezzamento': 'bg-yellow-100 dark:bg-yellow-800',
  'Maschi': 'bg-gray-200 dark:bg-gray-800',
};

function CardPhase({
  title,
  count,
  percentage,
  color,
  selected,
  onClick,
}: {
  title: string;
  count: number;
  percentage: number;
  color: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className={classNames(
        'cursor-pointer hover:shadow-md transition border-2',
        selected ? 'border-black dark:border-white' : 'border-transparent'
      )}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={percentage} className={color} />
        <p className="text-sm mt-2">{count} soggetti – {percentage}%</p>
      </CardContent>
    </Card>
  );
}



export default function DashboardPage() {
  type Bovino = {
    id: number;
    matricola: string;
    nome: string | null;
    data_nascita: string | null;
    sesso: "M" | "F" | null;
    stato_riproduttivo: string | null;
    id_madre: number | null;
    id_padre: number | null;
    id_stalla: number | null;
    note: string | null;
    stato_produttivo?: string | null;
    data_ultimo_parto?: string | null;
    data_ultima_fecondazione?: string | null;
  };

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [animals, setAnimals] = useState<Bovino[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // PAGINAZIONE
  const itemsPerPage = 10; // PAGINAZIONE

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await fetch('/api/bovini');
        const data: Bovino[] = await res.json();
        const normalized = data.map((bovino) => ({
          ...bovino,
          stato_produttivo: bovino.stato_produttivo ?? bovino.stato_riproduttivo ?? null,
        }));
        setAnimals(normalized);
      } catch (err) {
        console.error('Errore fetch bovini:', err);
      }
    };
    fetchAnimals();
  }, []);

  const total = animals.length;

  const getCountAndPercentage = (filter: (a: Bovino) => boolean) => {
    const count = animals.filter(filter).length;
    const percentage = total > 0 ? Number(((count / total) * 100).toFixed(2)) : 0;
    return { count, percentage };
  };

  const phaseStats = {
    'In lattazione': getCountAndPercentage((a) => a.stato_produttivo === 'In lattazione'),
    'In asciutta': getCountAndPercentage((a) => a.stato_produttivo === 'In asciutta'),
    'In accrescimento': getCountAndPercentage((a) => a.stato_produttivo === 'In accrescimento'),
    'In svezzamento': getCountAndPercentage((a) => a.stato_produttivo === 'In svezzamento'),
    'Maschi': getCountAndPercentage((a) => a.sesso === 'M'),
  };

  const toggleStatusFilter = (status: string) => {
    setSelectedStatus((prev) => (prev === status ? null : status));
    setCurrentPage(1); // PAGINAZIONE: reset pagina
  };

  const filteredAnimals = animals.filter((a) => {
    const matchSearch =
      a.matricola.toLowerCase().includes(search.toLowerCase()) ||
      (a.nome?.toLowerCase() ?? '').includes(search.toLowerCase());

    const matchStatus =
      selectedStatus === 'Maschi'
        ? a.sesso === 'M'
        : selectedStatus
        ? a.stato_produttivo === selectedStatus
        : true;

    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage); // PAGINAZIONE
  const startIdx = (currentPage - 1) * itemsPerPage; // PAGINAZIONE
  const visibleAnimals = filteredAnimals.slice(startIdx, startIdx + itemsPerPage); // PAGINAZIONE

  return (
    <div className="w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 flex flex-col gap-8 pt-8">
      {/* Stato mandria */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(phaseStats).map(([title, { count, percentage }]) => (
          <CardPhase
            key={title}
            title={title}
            count={count}
            percentage={percentage}
            color={statusColors[title as keyof typeof statusColors]}
            selected={selectedStatus === title}
            onClick={() => toggleStatusFilter(title)}
          />
        ))}
      </div>

      {/* Ricerca soggetti */}
      <div className="space-y-2 max-w-md w-full">
        <Label htmlFor="search">Cerca per nome o matricola</Label>
        <Input
          id="search"
          type="text"
          placeholder="Es. M1049, GYMNAST..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // PAGINAZIONE: reset pagina
          }}
        />
      </div>

      {/* Tabella soggetti */}
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>Matricola</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Ultimo parto</TableHead>
              <TableHead>Ultima fecondazione</TableHead>
              <TableHead>Sesso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleAnimals.map((a) => (
              <TableRow
                key={a.matricola}
                className={statusColors[a.stato_produttivo as keyof typeof statusColors] || ''}
              >
                <TableCell className="whitespace-nowrap">{a.matricola}</TableCell>
                <TableCell className="whitespace-nowrap">{a.nome}</TableCell>
                <TableCell>{a.stato_produttivo}</TableCell>
                <TableCell className="whitespace-nowrap">{a.data_ultimo_parto ?? '-'}</TableCell>
                <TableCell className="whitespace-nowrap">{a.data_ultima_fecondazione ?? '-'}</TableCell>
                <TableCell>{a.sesso}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Controlli di paginazione */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Precedente
        </button>
        <span className="text-sm">
          Pagina {currentPage} di {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Successiva
        </button>
      </div>
    </div>
  );
}

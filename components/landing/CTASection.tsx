'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

const CTASection: React.FC = () => {
  return (
    <section id="contatti" className="w-full py-16 bg-green-600">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Titolo e descrizione */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pronto a trasformare la gestione della tua stalla?
            </h2>
            <p className="text-xl text-green-100">
              Compila il modulo per richiedere una demo gratuita o parlare con un nostro consulente
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Nome e Cognome
                </Label>
                <Input id="name" type="text" placeholder="Mario Rossi" />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="mb-2 block">
                  Email
                </Label>
                <Input id="email" type="email" placeholder="mario.rossi@esempio.it" />
              </div>

              {/* Telefono */}
              <div>
                <Label htmlFor="phone" className="mb-2 block">
                  Telefono
                </Label>
                <Input id="phone" type="tel" placeholder="+39 123 456 7890" />
              </div>

              {/* Dimensione stalla */}
              <div>
                <Label htmlFor="farm-size" className="mb-2 block">
                  Dimensione della stalla
                </Label>
                <Select>
                  <SelectTrigger id="farm-size">
                    <SelectValue placeholder="Seleziona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Piccola (fino a 30 capi)</SelectItem>
                    <SelectItem value="medium">Media (30-100 capi)</SelectItem>
                    <SelectItem value="large">Grande (più di 100 capi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Messaggio */}
              <div className="md:col-span-2">
                <Label htmlFor="message" className="mb-2 block">
                  Messaggio
                </Label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Descrivi le tue esigenze e come possiamo aiutarti..."
                />
              </div>

              {/* Bottone invio */}
              <div className="md:col-span-2">
                <Button type="submit" className="w-full">
                  Richiedi informazioni
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

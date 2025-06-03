'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-r from-green-50 to-green-100 py-16 md:py-24">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        {/* Testo */}
        <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Gestisci la tua stalla in modo intelligente
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            StallaSmart è la soluzione completa per ottimizzare la gestione
            della tua stalla, migliorare la produttività e il benessere dei tuoi
            animali.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
  <Button
    asChild
    className="bg-green-600 text-white hover:bg-green-700
               dark:bg-green-500 dark:hover:bg-green-400"
  >
    <a href="#contatti">Richiedi una demo</a>
  </Button>

  <Button
    asChild
    variant="outline"
    className="border-green-600 text-green-700 hover:bg-green-50
               dark:border-green-400 dark:text-green-300 dark:hover:bg-green-900"
  >
    <a href="#funzionalita">Scopri di più</a>
  </Button>
</div>


        </div>

        {/* Immagine */}
        <div className="md:w-1/2">
          <div className="rounded-lg shadow-xl overflow-hidden">
            <Image
              src="/images/vacche-frisone-vacche-in-stalla-.jpg"
              alt="Gestione stalla digitale"
              width={1000}
              height={667}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

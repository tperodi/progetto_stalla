'use client';

import React from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

type BenefitItemProps = {
  text: string;
};

const BenefitItem: React.FC<BenefitItemProps> = ({ text }) => (
  <div className="flex items-start mb-4">
    <div className="mr-3 mt-1">
      <Check className="text-green-600" size={20} />
    </div>
    <p className="text-gray-700">{text}</p>
  </div>
);

const BenefitsSection: React.FC = () => {
  const benefits: string[] = [
    'Aumento della produttività fino al 15% grazie alla gestione ottimizzata',
    'Riduzione dei costi veterinari attraverso il monitoraggio preventivo della salute',
    'Miglioramento del benessere animale con controlli regolari e programmati',
    "Risparmio di tempo con l'automazione delle attività amministrative",
    'Decisioni più informate grazie ai dati e alle analisi in tempo reale',
    'Conformità semplificata con le normative agricole e sanitarie',
    'Maggiore efficienza nella gestione del personale',
    'Riduzione degli sprechi di mangime e risorse',
  ];

  return (
    <section id="vantaggi" className="w-full py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          {/* Immagine */}
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="rounded-lg shadow-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Allevatore che utilizza StallaSmart"
                width={1000}
                height={667}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>

          {/* Contenuto */}
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              I vantaggi di StallaSmart
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {benefits.slice(0, 4).map((text, index) => (
                <BenefitItem key={index} text={text} />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-4">
              {benefits.slice(4).map((text, index) => (
                <BenefitItem key={index + 4} text={text} />
              ))}
            </div>
            <div className="mt-8">
              <Button asChild>
                <a href="#contatti">Scopri come possiamo aiutarti</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;

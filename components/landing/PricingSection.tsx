'use client';

import React from 'react';
import { Check } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type PricingCardProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular: boolean;
};

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  isPopular,
}) => {
  return (
    <Card className={`relative ${isPopular ? 'border-green-500' : ''}`}>
      {isPopular && (
        <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium z-10">
          Più popolare
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <div className="text-4xl font-bold text-gray-900 mt-2">
          {price}
          <span className="text-base font-medium text-gray-600"> /mese</span>
        </div>
        <CardDescription className="mt-2 text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 mt-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-6">
        <Button
          className="w-full"
          variant={isPopular ? 'default' : 'secondary'}
          asChild
        >
          <a href="#contatti">{isPopular ? 'Inizia ora' : 'Contattaci'}</a>
        </Button>
      </CardFooter>
    </Card>
  );
};

const PricingSection: React.FC = () => {
  const plans: PricingCardProps[] = [
    {
      title: 'Base',
      price: '€49',
      description: 'Ideale per piccole stalle fino a 30 capi',
      features: [
        'Registro digitale degli animali',
        'Monitoraggio della produzione di latte',
        'Calendario sanitario',
        'Notifiche di base',
        'Supporto via email',
      ],
      isPopular: false,
    },
    {
      title: 'Professionale',
      price: '€99',
      description: 'Per stalle di medie dimensioni fino a 100 capi',
      features: [
        'Tutte le funzionalità del piano Base',
        'Analisi avanzate della produzione',
        'Gestione completa della riproduzione',
        'Sistema di notifiche avanzato',
        'Gestione del personale',
        'Supporto telefonico prioritario',
      ],
      isPopular: true,
    },
    {
      title: 'Enterprise',
      price: 'Personalizzato',
      description: 'Soluzione su misura per grandi allevamenti',
      features: [
        'Tutte le funzionalità del piano Professionale',
        'Integrazione con sistemi di mungitura',
        'API per connessione con altri software',
        'Dashboard personalizzata',
        'Consulente dedicato',
        'Formazione del personale',
        'Supporto 24/7',
      ],
      isPopular: false,
    },
  ];

  return (
    <section id="prezzi" className="w-full py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Piani e prezzi
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Scegli il piano più adatto alle esigenze della tua stalla
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Hai esigenze particolari? Contattaci per una soluzione personalizzata.
          </p>
          <Button variant="outline" asChild>
            <a href="#contatti">Richiedi preventivo personalizzato</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

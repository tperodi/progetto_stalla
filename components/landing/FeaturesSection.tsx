'use client';

import React, { memo } from 'react';
import {
  ClipboardList,
  LineChart,
  Calendar,
  Bell,
  Users,
  Database,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FeatureCard: React.FC<Feature> = ({ icon, title, description }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100 mb-4">
        {icon}
      </div>
      <CardTitle className="text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-gray-600 dark:text-gray-300">
        {description}
      </CardDescription>
    </CardContent>
  </Card>
);


const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      icon: <ClipboardList className="text-green-600" size={24} />,
      title: 'Registro digitale completo',
      description:
        'Tieni traccia di ogni animale con schede dettagliate, storia sanitaria e produttiva.',
    },
    {
      icon: <LineChart className="text-green-600" size={24} />,
      title: 'Analisi della produzione',
      description:
        'Monitora e analizza la produzione di latte con grafici dettagliati e report personalizzabili.',
    },
    {
      icon: <Calendar className="text-green-600" size={24} />,
      title: 'Gestione riproduzione',
      description:
        'Pianifica e monitora i cicli riproduttivi, le inseminazioni e le gravidanze.',
    },
    {
      icon: <Bell className="text-green-600" size={24} />,
      title: 'Sistema di notifiche',
      description:
        'Ricevi promemoria per vaccinazioni, controlli sanitari e altri eventi importanti.',
    },
    {
      icon: <Users className="text-green-600" size={24} />,
      title: 'Gestione del personale',
      description:
        'Assegna compiti, monitora le attività e ottimizza la gestione del lavoro.',
    },
    {
      icon: <Database className="text-green-600" size={24} />,
      title: 'Gestione inventario',
      description:
        'Tieni sotto controllo mangimi, medicinali e altre forniture essenziali.',
    },
  ];

  return (
    <section id="funzionalita" className="w-full py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Funzionalità principali
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            StallaSmart offre tutti gli strumenti necessari per una gestione moderna ed efficiente della tua stalla
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(FeaturesSection);

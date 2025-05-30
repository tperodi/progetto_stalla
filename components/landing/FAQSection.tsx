'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: 'Quanto tempo ci vuole per implementare StallaSmart?',
    answer:
      "L'implementazione base richiede circa 1-2 settimane, inclusa la formazione del personale. Per soluzioni più complesse e personalizzate, potrebbe essere necessario un po' più di tempo.",
  },
  {
    question: 'È possibile importare dati dal mio sistema attuale?',
    answer:
      "Sì, offriamo servizi di migrazione dati da quasi tutti i sistemi di gestione agricola più comuni. I nostri tecnici ti guideranno attraverso l'intero processo.",
  },
  {
    question: 'StallaSmart funziona offline?',
    answer:
      "Sì, l'applicazione ha una modalità offline che consente di registrare dati anche senza connessione internet. Una volta ristabilita la connessione, i dati verranno sincronizzati automaticamente.",
  },
  {
    question: 'Quali dispositivi sono supportati?',
    answer:
      "StallaSmart funziona su qualsiasi dispositivo con un browser web moderno: computer, tablet e smartphone. Abbiamo anche app native per iOS e Android per un'esperienza ottimizzata su dispositivi mobili.",
  },
  {
    question: 'Come vengono protetti i miei dati?',
    answer:
      'Utilizziamo la crittografia SSL/TLS per tutte le comunicazioni e archiviamo i tuoi dati in data center certificati ISO 27001. Eseguiamo backup giornalieri e offriamo opzioni di recupero dati complete.',
  },
  {
    question: "Posso annullare l'abbonamento in qualsiasi momento?",
    answer:
      'Sì, i nostri abbonamenti sono flessibili e possono essere annullati con un preavviso di 30 giorni. Offriamo anche una garanzia di rimborso di 30 giorni per i nuovi clienti.',
  },
];

const FAQSection: React.FC = () => {
  return (
    <section id="faq" className="w-full py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Domande frequenti
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trova le risposte alle domande più comuni su StallaSmart
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="multiple" className="w-full space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium text-gray-800 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-700 mb-4">
            Non hai trovato la risposta che cercavi?
          </p>
          <Button asChild>
            <a href="#contatti">Contattaci</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  farm: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, role, farm, rating }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 italic mb-4">&quot;{quote}&quot;</p>
        <CardTitle className="text-base">{name}</CardTitle>
        <CardDescription className="text-sm">{role}, {farm}</CardDescription>
      </CardContent>
    </Card>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Da quando abbiamo implementato StallaSmart, la produzione è aumentata del 12% e abbiamo ridotto i costi operativi. L'interfaccia è intuitiva e il supporto clienti è sempre disponibile.",
      name: 'Marco Bianchi',
      role: 'Proprietario',
      farm: 'Fattoria Valle Verde',
      rating: 5,
    },
    {
      quote: 'Finalmente possiamo tenere traccia di tutti i nostri animali in modo efficiente. Il sistema di notifiche ci ha aiutato a non perdere mai una vaccinazione o un controllo importante.',
      name: 'Laura Rossi',
      role: 'Allevatrice',
      farm: 'Cascina Buonlatte',
      rating: 5,
    },
    {
      quote: 'StallaSmart ha trasformato la nostra azienda agricola. I report dettagliati ci permettono di prendere decisioni basate sui dati, migliorando la salute del nostro bestiame.',
      name: 'Giuseppe Verdi',
      role: 'Direttore',
      farm: 'Cooperativa Latte Fresco',
      rating: 4,
    }
  ];

  return (
    <section id="testimonianze" className="w-full py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Cosa dicono i nostri clienti
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Centinaia di allevatori in tutta Italia si affidano a StallaSmart
            per gestire le loro stalle
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

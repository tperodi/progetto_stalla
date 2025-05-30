'use client';

import React, { useState, useEffect } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRouter, useSearchParams  } from 'next/navigation';

const LoginSection: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
 const searchParams = useSearchParams();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const error = searchParams.get('error');
    if (shown || !error) return;

    setTimeout(() => {
      if (error === 'token_mancante') {
        toast.warning('Per accedere devi effettuare il login');
      } else if (error === 'token_scaduto') {
        toast.warning('Sessione scaduta, effettua di nuovo il login');
      }
    }, 100); // 🔁 differisce il toast di 100ms

    setShown(true);
  }, [searchParams, shown]);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(`Benvenuto ${data.username}`);
      router.push('/dashboard');
    } else {
      toast.error(data.error || 'Si è verificato un errore');
    }
  };

  return (
    <section id="login" className="w-full py-16 bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Accedi a StallaSmart</h2>
            <p className="text-gray-600">Gestisci la tua stalla in modo intelligente</p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Username */}
              <div>
                <Label htmlFor="username" className="block text-gray-700 mb-2 font-medium">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="mario.rossi"
                    className="pl-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="block text-gray-700 mb-2 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Ricordami + Link */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(val: boolean) => setRememberMe(val)}
                  />
                  <Label htmlFor="remember-me" className="text-sm text-gray-700">
                    Ricordami
                  </Label>
                </div>
                <a href="#" className="text-sm text-green-600 hover:text-green-700">
                  Password dimenticata?
                </a>
              </div>

              <Button type="submit" className="w-full">Accedi</Button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Non hai ancora un account?{' '}
                  <a href="#contatti" className="text-green-600 hover:text-green-700 font-medium">
                    Contattaci per iniziare
                  </a>
                </p>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Accedendo accetti i nostri{' '}
            <a href="#" className="text-green-600 hover:text-green-700">Termini di Servizio</a> e la{' '}
            <a href="#" className="text-green-600 hover:text-green-700">Privacy Policy</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;
// In questo codice, abbiamo aggiunto un toast che appare quando l'utente accede alla pagina di login e il token è mancante o scaduto.
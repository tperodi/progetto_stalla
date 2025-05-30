'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle'; // <- importa il toggle

const navLinks = [
  { href: '#funzionalita', label: 'Funzionalità' },
  { href: '#vantaggi', label: 'Vantaggi' },
  { href: '#testimonianze', label: 'Testimonianze' },
  { href: '#prezzi', label: 'Prezzi' },
  { href: '#faq', label: 'FAQ' },
];

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <span className="text-2xl font-bold text-green-700 dark:text-green-400">
          StallaSmart
        </span>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-700 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button
  asChild
  className="bg-green-600 text-white border-green-700 hover:bg-green-700 hover:border-green-800 transition-colors duration-200 px-6 py-2 rounded-lg shadow-sm"
>
  <a href="#login">Accedi</a>
</Button>

          {/* <ThemeToggle /> 👈 Aggiunto qui */}
          
          <Button asChild>
            <a href="#contatti">Contattaci</a>
          </Button>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xl font-bold text-green-700 dark:text-green-400">
                  StallaSmart
                </span>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a
                      href={link.href}
                      className="text-gray-700 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
                <ThemeToggle /> {/* 👈 Anche nel mobile menu */}
                <SheetClose asChild>
                  <Button asChild className="w-full mt-4">
                    <a href="#contatti">Contattaci</a>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

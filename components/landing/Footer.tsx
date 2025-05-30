'use client';

import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo e descrizione */}
          <div>
            <h3 className="text-xl font-bold mb-4">StallaSmart</h3>
            <p className="text-gray-300 mb-4">
              La soluzione digitale completa per la gestione moderna ed
              efficiente della tua stalla.
            </p>
          </div>

          {/* Collegamenti rapidi */}
          <div>
            <h4 className="text-lg font-medium mb-4">Collegamenti rapidi</h4>
            <ul className="space-y-2">
              {['funzionalita', 'vantaggi', 'testimonianze', 'prezzi', 'faq'].map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Risorse */}
          <div>
            <h4 className="text-lg font-medium mb-4">Risorse</h4>
            <ul className="space-y-2">
              {['Blog', 'Guide', 'Webinar', 'Supporto'].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h4 className="text-lg font-medium mb-4">Contatti</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone size={18} className="mr-2 mt-1 text-green-400" />
                <span>+39 02 1234 5678</span>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="mr-2 mt-1 text-green-400" />
                <span>info@stallasmart.it</span>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-green-400" />
                <span>
                  Via dell&apos;Agricoltura, 123
                  <br />
                  20100 Milano, Italia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Policy */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} StallaSmart. Tutti i diritti
            riservati.
          </p>
          <div className="flex space-x-4">
            {['Privacy', 'Termini', 'Cookie'].map((label) => (
              <a
                key={label}
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

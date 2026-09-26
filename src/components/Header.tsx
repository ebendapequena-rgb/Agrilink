import React from 'react';
import { ActiveInterface, UserRole } from '../types';
import { Sprout, ShoppingCart, Tractor } from 'lucide-react';

interface HeaderProps {
  activeInterface: ActiveInterface;
  setActiveInterface: (ui: ActiveInterface) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  ordersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeInterface,
  setActiveInterface,
  userRole,
  setUserRole,
  ordersCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Zone 1: Brand wordmark with subtle agricultural emblem */}
        <button
          onClick={() => setActiveInterface('accueil')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
            <Sprout className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-emerald-950 block leading-none">
              AgriLink
            </span>
            <span className="text-xs text-stone-500 font-medium hidden sm:inline-block">
              Direct Producteurs Locaux
            </span>
          </div>
        </button>

        {/* Zone 2: Clean 4 navigation links conforming to Top Bar Contract */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveInterface('accueil')}
            className={`cursor-pointer transition-colors hover:text-emerald-800 py-1 ${
              activeInterface === 'accueil' ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700' : ''
            }`}
          >
            Accueil & Marché
          </button>
          <button
            onClick={() => setActiveInterface('produit')}
            className={`cursor-pointer transition-colors hover:text-emerald-800 py-1 ${
              activeInterface === 'produit' ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700' : ''
            }`}
          >
            Commander un Produit
          </button>
          <button
            onClick={() => setActiveInterface('paiement')}
            className={`cursor-pointer transition-colors hover:text-emerald-800 py-1 flex items-center gap-1.5 ${
              activeInterface === 'paiement' ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700' : ''
            }`}
          >
            <span>Paiement & Suivi</span>
            {ordersCount > 0 && (
              <span className="text-xs text-emerald-800 font-bold tabular-nums">
                ({ordersCount})
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveInterface('espace')}
            className={`cursor-pointer transition-colors hover:text-emerald-800 py-1 ${
              activeInterface === 'espace' ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700' : ''
            }`}
          >
            {userRole === 'producer' ? 'Espace Producteur' : 'Espace Acheteur'}
          </button>
        </nav>

        {/* Zone 3: Quick Role Switcher (Acheteur vs Producteur) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200">
            <button
              onClick={() => {
                setUserRole('buyer');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                userRole === 'buyer'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Passer en mode acheteur"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-emerald-700" />
              <span>Acheteur</span>
            </button>
            <button
              onClick={() => {
                setUserRole('producer');
                setActiveInterface('espace');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                userRole === 'producer'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Passer en mode producteur agricole"
            >
              <Tractor className="w-3.5 h-3.5 text-emerald-200" />
              <span>Producteur</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

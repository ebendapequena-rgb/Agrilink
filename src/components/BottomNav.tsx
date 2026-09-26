import React from 'react';
import { ActiveInterface, UserRole } from '../types';
import { Home, Search, Package, User, Bot } from 'lucide-react';

interface BottomNavProps {
  activeInterface: ActiveInterface;
  setActiveInterface: (ui: ActiveInterface) => void;
  onOpenAssistant: () => void;
  ordersCount: number;
  userRole: UserRole;
  onFocusSearch: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeInterface,
  setActiveInterface,
  onOpenAssistant,
  ordersCount,
  userRole,
  onFocusSearch,
}) => {
  return (
    <>
      {/* Bouton Flottant « Besoin d'aide ? 🤖 » comme demandé explicitement */}
      <aside aria-label="Assistant IA AgriLink" className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40">
        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer border-2 border-emerald-600/40"
          title="Ouvrir l'assistant intelligent AgriLink"
        >
          <span className="text-lg">🤖</span>
          <span className="tracking-wide">Besoin d'aide ?</span>
        </button>
      </aside>

      {/* Barre de navigation inférieure : Accueil | Rechercher | Commandes | Profil */}
      <nav aria-label="Navigation principale" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-2">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {/* 1. Accueil */}
          <button
            onClick={() => setActiveInterface('accueil')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors cursor-pointer ${
              activeInterface === 'accueil'
                ? 'text-emerald-800 font-bold bg-emerald-50'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Accueil</span>
          </button>

          {/* 2. Rechercher */}
          <button
            onClick={() => {
              setActiveInterface('accueil');
              onFocusSearch();
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors cursor-pointer ${
              activeInterface === 'produit'
                ? 'text-emerald-800 font-bold bg-emerald-50'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Search className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Rechercher</span>
          </button>

          {/* 3. Commandes */}
          <button
            onClick={() => setActiveInterface('paiement')}
            className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors cursor-pointer ${
              activeInterface === 'paiement'
                ? 'text-emerald-800 font-bold bg-emerald-50'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Package className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Commandes</span>
            {ordersCount > 0 && (
              <span className="absolute top-1 right-3 w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] font-black flex items-center justify-center">
                {ordersCount}
              </span>
            )}
          </button>

          {/* 4. Profil / Espace */}
          <button
            onClick={() => setActiveInterface('espace')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors cursor-pointer ${
              activeInterface === 'espace'
                ? 'text-emerald-800 font-bold bg-emerald-50'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">
              {userRole === 'producer' ? 'Mon Champ' : 'Profil'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

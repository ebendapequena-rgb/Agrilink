import React, { useState } from 'react';
import { Product, CategoryId } from '../types';
import { CATEGORIES } from '../data/mockData';
import { Search, MapPin, Sparkles, ArrowRight, ShieldCheck, ShoppingBag, PlusCircle, CheckCircle2 } from 'lucide-react';

interface Interface1HomeProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenAssistant: (initialPrompt?: string) => void;
  onGoToProducerSpace: () => void;
  onScrollToCatalog: () => void;
}

export const Interface1Home: React.FC<Interface1HomeProps> = ({
  products,
  onSelectProduct,
  onOpenAssistant,
  onGoToProducerSpace,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');

  const popularSearches = ['Tomates', 'Plantain', 'Maïs', 'Manioc', 'Légumes', 'Fruits'];

  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.farmerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || prod.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-b from-emerald-50/70 via-white to-stone-50/50 border-b border-stone-200/80 pt-10 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Circuit court sans intermédiaire · Prix direct champ</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Les produits locaux, <br className="hidden sm:inline" />
            <span className="text-emerald-800">directement auprès des producteurs.</span>
          </h1>

          <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto font-normal">
            Achetez frais au juste prix, soutenez l'agriculture de nos régions et faites-vous livrer chez vous simplement.
          </p>

          {/* Deux boutons principaux - Exactement comme demandé au point 5 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="#catalogue"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-base transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-200" />
              <span>Je veux acheter</span>
            </a>

            <button
              onClick={onGoToProducerSpace}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border-2 border-emerald-700 font-bold text-base transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-5 h-5 text-emerald-700" />
              <span>Je suis producteur</span>
            </button>
          </div>

          {/* Grande barre de recherche simple - Que recherchez-vous ? */}
          <div className="pt-6 max-w-2xl mx-auto">
            <div className="relative bg-white rounded-2xl border-2 border-emerald-700/60 shadow-md p-2 flex items-center focus-within:border-emerald-800 focus-within:ring-2 focus-within:ring-emerald-200 transition-all">
              <Search className="w-6 h-6 text-emerald-700 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Que recherchez-vous ? (ex: Tomates, Plantain, Maïs...)"
                className="w-full px-3 py-2.5 text-base sm:text-lg text-stone-900 placeholder-stone-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2.5 py-1 text-xs text-stone-500 hover:text-stone-800 font-semibold cursor-pointer"
                >
                  Effacer
                </button>
              )}
              <button
                onClick={() => {
                  const el = document.getElementById('catalogue');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm cursor-pointer shrink-0 transition-colors"
              >
                Rechercher
              </button>
            </div>

            {/* Suggestions rapides en dessous de la recherche */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs sm:text-sm text-stone-600">
              <span className="font-semibold text-stone-500">Exemples rapides :</span>
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer font-medium ${
                    searchQuery.toLowerCase() === term.toLowerCase()
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-600'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Catégories Visuelles avec Icônes Simples */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-stone-900">
            Choisir par catégorie
          </h2>
          <p className="text-xs text-stone-500">
            Touchez une catégorie pour filtrer immédiatement les récoltes
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/50'
            }`}
          >
            <span className="text-2xl">🧺</span>
            <span className="text-sm font-bold">Tous</span>
            <span className={`text-[11px] ${selectedCategory === 'all' ? 'text-emerald-100' : 'text-stone-500'}`}>
              Tout le marché
            </span>
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                  : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/50'
              }`}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-sm font-bold">{cat.label}</span>
              <span className={`text-[11px] truncate max-w-full ${selectedCategory === cat.id ? 'text-emerald-100' : 'text-stone-500'}`}>
                {cat.desc}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Bannière Assistant IA - Besoin d'aide ? 🤖 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-emerald-900 rounded-2xl p-5 sm:p-7 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Assistant Intelligent AgriLink</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              Besoin d'aide pour trouver un produit ?
            </h3>
            <p className="text-emerald-100 text-sm max-w-xl">
              Dites par exemple : <span className="italic font-medium text-white">« Je cherche 50 kg de plantain à Yaoundé »</span> et notre IA trouve automatiquement les producteurs les plus proches.
            </p>
          </div>
          <button
            onClick={() => onOpenAssistant()}
            className="px-6 py-3.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-100 font-bold text-sm transition-colors shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Demander à l'IA 🤖</span>
            <ArrowRight className="w-4 h-4 text-emerald-800" />
          </button>
        </div>
      </section>

      {/* Section Produits Disponibles Près de Vous */}
      <section id="catalogue" className="max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
              Approvisionnement direct
            </div>
            <h2 className="text-2xl font-bold text-stone-900">
              Produits disponibles près de vous
            </h2>
            <p className="text-sm text-stone-500">
              Récoltes fraîches du jour prêtes à être commandées et livrées
            </p>
          </div>

          <div className="text-xs text-stone-500 font-medium">
            <span className="font-bold text-stone-800">{filteredProducts.length}</span> produit(s) trouvé(s)
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
            <p className="text-4xl">🌾</p>
            <h3 className="text-lg font-bold text-stone-800">
              Aucun produit ne correspond à cette recherche
            </h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              Essayez un autre mot-clé ou demandez à l'assistant IA de contacter les coopératives de votre région.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-semibold text-sm cursor-pointer"
            >
              Afficher tous les produits
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-900 shadow-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{product.harvestDate}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-stone-900 leading-snug">
                      {product.name}
                    </h3>

                    {/* Localisation du producteur - Libellé très clair pour débutant */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-600">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Où se trouve le producteur ?</span>
                      <strong className="text-stone-900 font-semibold">{product.location}</strong>
                      <span className="text-stone-400">({product.distance})</span>
                    </div>

                    <div className="text-xs text-stone-600">
                      Producteur : <span className="font-semibold text-stone-900">{product.farmerName}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
                    <div>
                      <div className="text-xs text-stone-500 font-medium">Prix direct</div>
                      <div className="text-xl font-extrabold text-emerald-900 tabular-nums">
                        {product.pricePerUnit.toLocaleString('fr-FR')} FCFA
                        <span className="text-xs font-semibold text-stone-500">/{product.unit}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-stone-500 font-medium">Quantité dispo</div>
                      <div className="text-sm font-bold text-stone-800 tabular-nums">
                        {product.availableQty} {product.unit}
                      </div>
                    </div>
                  </div>

                  {/* Bouton Voir - Démarre la fiche produit / commande */}
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Voir ce produit</span>
                    <ArrowRight className="w-4 h-4 text-emerald-200" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { Product } from '../types';
import {
  Sparkles,
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Send,
  X,
  Bot,
  Lightbulb,
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProductToOrder: (product: Product, suggestedQty?: number) => void;
  initialPrompt?: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProductToOrder,
  initialPrompt = '',
}) => {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<{
    matchedProductIds: string[];
    explanation: string;
    recommendedProductId?: string;
    detectedQuantity?: number;
    detectedCity?: string;
  } | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Je cherche 50 kg de plantain à Yaoundé',
    'Qui a des tomates fraîches aujourd\'hui ?',
    'Je cherche 100 kg de maïs à Yaoundé',
    'Quel producteur propose du manioc doux ?',
  ];

  const handleAskAI = async (queryText: string) => {
    const queryToUse = queryText.trim() || prompt.trim();
    if (!queryToUse) return;

    setPrompt(queryToUse);
    setIsLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToUse,
          products,
        }),
      });
      const data = await res.json();
      setAiResponse(data);
    } catch (err) {
      console.error(err);
      // Fallback matching
      const queryLower = queryToUse.toLowerCase();
      const matched = products.filter(
        (p) =>
          p.name.toLowerCase().includes(queryLower) ||
          p.category.toLowerCase().includes(queryLower) ||
          p.location.toLowerCase().includes(queryLower)
      );
      setAiResponse({
        matchedProductIds: matched.map((m) => m.id),
        explanation:
          matched.length > 0
            ? `J'ai trouvé ${matched.length} producteur(s) local(aux) correspondant à votre demande.`
            : `Voici les producteurs disponibles près de votre secteur.`,
        recommendedProductId: matched[0]?.id || products[0]?.id,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const matchedProducts = products.filter((p) =>
    (aiResponse?.matchedProductIds || []).includes(p.id)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 space-y-6 shadow-2xl my-6 border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center">
              <Bot className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-stone-900">
                Assistant IA AgriLink
              </h3>
              <p className="text-xs text-stone-500">
                Mise en relation intelligente directe producteur - acheteur
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input box */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-800">
            Que recherchez-vous ? Dites-le avec vos propres mots :
          </label>
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAskAI(prompt);
              }}
              placeholder="Ex: Je cherche 50 kg de plantain à Yaoundé..."
              className="w-full pl-4 pr-12 py-3.5 rounded-2xl border-2 border-emerald-700/60 text-stone-900 text-base focus:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <button
              onClick={() => handleAskAI(prompt)}
              disabled={isLoading || !prompt.trim()}
              className="absolute right-2 top-2 p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white disabled:opacity-40 cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 text-xs">
            <span className="text-stone-400 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Exemples :
            </span>
            {quickPrompts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleAskAI(q)}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200 text-xs font-medium cursor-pointer transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="p-8 text-center space-y-3 bg-stone-50 rounded-2xl border border-stone-200">
            <Sparkles className="w-8 h-8 text-emerald-700 animate-spin mx-auto" />
            <div className="text-sm font-bold text-stone-800">
              L'IA recherche les producteurs les plus proches...
            </div>
            <p className="text-xs text-stone-500">
              Analyse du produit, de la quantité voulue et de la localisation.
            </p>
          </div>
        )}

        {/* AI Results */}
        {aiResponse && !isLoading && (
          <div className="space-y-4 pt-1">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 text-sm leading-relaxed">
              <div className="font-bold flex items-center gap-1.5 mb-1 text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Réponse de l'assistant AgriLink</span>
              </div>
              <p>{aiResponse.explanation}</p>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Producteurs recommandés ({matchedProducts.length})
              </div>

              {matchedProducts.length === 0 ? (
                <div className="p-6 text-center text-stone-500 text-sm bg-stone-50 rounded-2xl border border-stone-200">
                  Aucun producteur exact trouvé pour ces critères précis. Essayez avec un mot plus général (ex: "tomate" ou "plantain").
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {matchedProducts.map((p) => {
                    const isTopPick = p.id === aiResponse.recommendedProductId;
                    return (
                      <div
                        key={p.id}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          isTopPick
                            ? 'bg-emerald-50/70 border-emerald-700 shadow-xs'
                            : 'bg-white border-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div>
                            {isTopPick && (
                              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-block mb-1">
                                ⭐ Meilleure correspondance
                              </span>
                            )}
                            <h4 className="font-bold text-stone-900 text-sm">
                              {p.name}
                            </h4>
                            <div className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                              <span>{p.farmerName} · {p.location} ({p.distance})</span>
                            </div>
                            <div className="text-xs text-stone-500 mt-0.5">
                              Disponible : <strong>{p.availableQty} {p.unit}</strong> à {p.pricePerUnit} FCFA/{p.unit}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onSelectProductToOrder(p, aiResponse.detectedQuantity || undefined);
                          }}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <span>Commander ce produit</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

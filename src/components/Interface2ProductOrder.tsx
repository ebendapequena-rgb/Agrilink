import React, { useState } from 'react';
import { Product, DeliveryMode } from '../types';
import {
  ArrowLeft,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Building,
  Store,
  CheckCircle,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';

interface Interface2ProductOrderProps {
  product: Product;
  onBackToHome: () => void;
  onProceedToPayment: (orderDetails: {
    product: Product;
    quantity: number;
    productTotal: number;
    deliveryMode: DeliveryMode;
    deliveryFee: number;
    totalAmount: number;
    deliveryAddress: string;
    buyerName: string;
    buyerPhone: string;
  }) => void;
}

export const Interface2ProductOrder: React.FC<Interface2ProductOrderProps> = ({
  product,
  onBackToHome,
  onProceedToPayment,
}) => {
  // Stepper state
  const [quantity, setQuantity] = useState<number>(product.minOrder || 5);
  const [showDeliveryStep, setShowDeliveryStep] = useState<boolean>(false);

  // Delivery options state
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('home');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('Quartier Bastos, Yaoundé');
  const [buyerName, setBuyerName] = useState<string>('Marie Dupont');
  const [buyerPhone, setBuyerPhone] = useState<string>('+237 6 90 12 34 56');

  // Calculation
  const productTotal = quantity * product.pricePerUnit;
  const deliveryFee =
    deliveryMode === 'pickup'
      ? 0
      : deliveryMode === 'collection_point'
      ? Math.round(product.deliveryFee * 0.6)
      : product.deliveryFee;

  const totalAmount = productTotal + deliveryFee;

  const handleIncrease = () => {
    if (quantity < product.availableQty) {
      setQuantity((prev) => prev + (product.unit === 'kg' ? 5 : 1));
    }
  };

  const handleDecrease = () => {
    const step = product.unit === 'kg' ? 5 : 1;
    if (quantity - step >= product.minOrder) {
      setQuantity((prev) => prev - step);
    } else if (quantity > 1) {
      setQuantity(1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Bouton retour très visible */}
      <button
        onClick={onBackToHome}
        className="inline-flex items-center gap-2 text-stone-600 hover:text-emerald-900 font-semibold text-sm cursor-pointer p-2 -ml-2 rounded-lg hover:bg-stone-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour aux produits disponibles</span>
      </button>

      {/* Fiche Produit Très Simple - Comme demandée */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Photo du produit */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-stone-100">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 bg-emerald-950/85 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Qualité certifiée par AgriLink</span>
          </div>
        </div>

        {/* Détails du produit */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {product.name}
            </h1>
            <p className="text-stone-600 text-sm mt-1.5">
              {product.description}
            </p>
          </div>

          {/* Informations claires sur le producteur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-stone-500 font-semibold block">Producteur</span>
              <span className="font-bold text-stone-900 text-base">{product.farmerName}</span>
              <span className="text-xs text-stone-500 block flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-700" />
                {product.farmerPhone}
              </span>
            </div>

            <div className="space-y-1 sm:border-l sm:border-emerald-200 sm:pl-4">
              <span className="text-xs text-stone-500 font-semibold block">Localisation</span>
              <span className="font-bold text-stone-900 text-base flex items-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-700" />
                {product.location}
              </span>
              <span className="text-xs text-stone-500 block">
                Distance estimée : <strong>{product.distance}</strong>
              </span>
            </div>
          </div>

          {/* Disponibilité et Prix */}
          <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <div>
              <div className="text-xs text-stone-500 font-semibold">Disponible</div>
              <div className="text-lg font-bold text-stone-900 tabular-nums">
                {product.availableQty} {product.unit}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-stone-500 font-semibold">Prix unitaire</div>
              <div className="text-2xl font-black text-emerald-900 tabular-nums">
                {product.pricePerUnit.toLocaleString('fr-FR')} FCFA
                <span className="text-xs font-semibold text-stone-500">/{product.unit}</span>
              </div>
            </div>
          </div>

          {/* Stepper de Quantité : [-] 10 kg [+] */}
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-bold text-stone-900">
              Choisissez votre quantité :
            </label>

            <div className="flex items-center justify-between p-3 bg-stone-100/80 rounded-2xl border border-stone-200">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={quantity <= (product.minOrder || 1)}
                className="w-14 h-14 rounded-xl bg-white border border-stone-300 text-stone-900 hover:bg-stone-50 flex items-center justify-center font-bold text-xl cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-xs transition-transform active:scale-95"
                title="Diminuer la quantité"
              >
                <Minus className="w-6 h-6 text-stone-700" />
              </button>

              <div className="text-center px-4">
                <div className="text-3xl font-black text-stone-900 tabular-nums">
                  {quantity} <span className="text-lg font-bold text-stone-600">{product.unit}</span>
                </div>
                <div className="text-xs text-stone-500 font-medium">
                  (Minimum de commande : {product.minOrder} {product.unit})
                </div>
              </div>

              <button
                type="button"
                onClick={handleIncrease}
                disabled={quantity >= product.availableQty}
                className="w-14 h-14 rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 flex items-center justify-center font-bold text-xl cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-xs transition-transform active:scale-95"
                title="Augmenter la quantité"
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Total Produits */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
            <span className="text-base font-bold text-stone-800">
              Total produits :
            </span>
            <span className="text-2xl font-black text-emerald-950 tabular-nums">
              {productTotal.toLocaleString('fr-FR')} FCFA
            </span>
          </div>

          {/* Bouton principal : « Commander » pour faire apparaître les modes de réception */}
          {!showDeliveryStep ? (
            <button
              onClick={() => setShowDeliveryStep(true)}
              className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-lg transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Commander ({productTotal.toLocaleString('fr-FR')} FCFA)</span>
            </button>
          ) : (
            <div className="space-y-6 pt-4 border-t-2 border-stone-200">
              {/* Mode de réception - 3 options exactes */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-stone-900">
                  Mode de réception
                </h3>

                <div className="space-y-2.5">
                  {/* Option 1: Retrait chez le producteur */}
                  <label
                    onClick={() => setDeliveryMode('pickup')}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      deliveryMode === 'pickup'
                        ? 'bg-emerald-50/70 border-emerald-700 shadow-xs'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMode"
                      checked={deliveryMode === 'pickup'}
                      onChange={() => setDeliveryMode('pickup')}
                      className="mt-1 w-4 h-4 text-emerald-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 flex items-center gap-1.5">
                          <Store className="w-4 h-4 text-emerald-700" />
                          Retrait chez le producteur
                        </span>
                        <span className="text-xs font-extrabold text-emerald-800">
                          Gratuit (0 FCFA)
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        Vous récupérez directement la marchandise chez {product.farmerName} à {product.location}.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Livraison à domicile */}
                  <label
                    onClick={() => setDeliveryMode('home')}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      deliveryMode === 'home'
                        ? 'bg-emerald-50/70 border-emerald-700 shadow-xs'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMode"
                      checked={deliveryMode === 'home'}
                      onChange={() => setDeliveryMode('home')}
                      className="mt-1 w-4 h-4 text-emerald-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-emerald-700" />
                          Livraison à domicile
                        </span>
                        <span className="text-xs font-extrabold text-stone-900 tabular-nums">
                          +{product.deliveryFee.toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        Un livreur AgriLink partenaire apporte la commande directement à votre porte.
                      </p>
                    </div>
                  </label>

                  {/* Option 3: Livraison à un point de collecte */}
                  <label
                    onClick={() => setDeliveryMode('collection_point')}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      deliveryMode === 'collection_point'
                        ? 'bg-emerald-50/70 border-emerald-700 shadow-xs'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMode"
                      checked={deliveryMode === 'collection_point'}
                      onChange={() => setDeliveryMode('collection_point')}
                      className="mt-1 w-4 h-4 text-emerald-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 flex items-center gap-1.5">
                          <Building className="w-4 h-4 text-emerald-700" />
                          Livraison à un point de collecte
                        </span>
                        <span className="text-xs font-extrabold text-stone-900 tabular-nums">
                          +{Math.round(product.deliveryFee * 0.6).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        Récupérez dans une boutique ou station relais partenaire sécurisée.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Si livraison : adresse de livraison, coût, délai estimé */}
              {deliveryMode !== 'pickup' && (
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between text-xs text-stone-600 pb-2 border-b border-stone-200">
                    <div>
                      Coût de livraison :{' '}
                      <strong className="text-stone-900">
                        {deliveryFee.toLocaleString('fr-FR')} FCFA
                      </strong>
                    </div>
                    <div>
                      Délai estimé :{' '}
                      <strong className="text-emerald-800 font-bold">
                        {product.deliveryEstTime}
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Adresse ou quartier de livraison :
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Ex: Quartier Bastos, face pharmacie du Soleil"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:border-emerald-700 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1">
                          Votre nom complet :
                        </label>
                        <input
                          type="text"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          placeholder="Votre nom"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:border-emerald-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1">
                          Numéro de téléphone :
                        </label>
                        <input
                          type="text"
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          placeholder="+237 6..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:border-emerald-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bouton : « Continuer vers le paiement » */}
              <div className="pt-2">
                <button
                  onClick={() =>
                    onProceedToPayment({
                      product,
                      quantity,
                      productTotal,
                      deliveryMode,
                      deliveryFee,
                      totalAmount,
                      deliveryAddress: deliveryMode === 'pickup' ? `Retrait chez le producteur (${product.location})` : deliveryAddress,
                      buyerName,
                      buyerPhone,
                    })
                  }
                  className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continuer vers le paiement ({totalAmount.toLocaleString('fr-FR')} FCFA)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

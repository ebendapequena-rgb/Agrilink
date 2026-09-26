import React, { useState } from 'react';
import { Product, DeliveryMode, PaymentMethod, Order } from '../types';
import {
  CheckCircle2,
  Smartphone,
  Banknote,
  CreditCard,
  ArrowLeft,
  Truck,
  PackageCheck,
  Clock,
  ArrowRight,
  ShieldCheck,
  Store,
  Sparkles,
  UserCheck,
} from 'lucide-react';

interface Interface3PaymentDeliveryProps {
  draftOrder: {
    product: Product;
    quantity: number;
    productTotal: number;
    deliveryMode: DeliveryMode;
    deliveryFee: number;
    totalAmount: number;
    deliveryAddress: string;
    buyerName: string;
    buyerPhone: string;
  } | null;
  activeOrder: Order | null;
  onConfirmOrder: (newOrder: Order) => void;
  onGoToOrderTracking: (orderId: string) => void;
  onBackToProduct: () => void;
  onAdvanceOrderStatus?: (orderId: string) => void;
}

export const Interface3PaymentDelivery: React.FC<Interface3PaymentDeliveryProps> = ({
  draftOrder,
  activeOrder,
  onConfirmOrder,
  onGoToOrderTracking,
  onBackToProduct,
  onAdvanceOrderStatus,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('mobile_money');
  const [mobileOperator, setMobileOperator] = useState<'orange' | 'mtn'>('orange');
  const [momoNumber, setMomoNumber] = useState(draftOrder?.buyerPhone || '+237 6 90 12 34 56');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(activeOrder || null);

  // If there's an active confirmed order or user just paid, display confirmation & tracker view
  const currentDisplayOrder = confirmedOrder || activeOrder;

  const handlePay = () => {
    if (!draftOrder) return;
    setIsProcessing(true);

    // Generate realistic order number #AG24xx
    const orderNumber = `#AG${Math.floor(2400 + Math.random() * 500)}`;

    const newOrder: Order = {
      id: orderNumber,
      createdAt: "Aujourd'hui à l'instant",
      productId: draftOrder.product.id,
      productName: draftOrder.product.name,
      productImage: draftOrder.product.image,
      farmerName: draftOrder.product.farmerName,
      farmerPhone: draftOrder.product.farmerPhone,
      farmerLocation: draftOrder.product.location,
      buyerName: draftOrder.buyerName,
      buyerPhone: draftOrder.buyerPhone,
      buyerAddress: draftOrder.deliveryAddress,
      quantity: draftOrder.quantity,
      unit: draftOrder.product.unit,
      pricePerUnit: draftOrder.product.pricePerUnit,
      productTotal: draftOrder.productTotal,
      deliveryMode: draftOrder.deliveryMode,
      deliveryFee: draftOrder.deliveryFee,
      totalAmount: draftOrder.totalAmount,
      paymentMethod: selectedPayment,
      paymentMethodLabel:
        selectedPayment === 'mobile_money'
          ? `Mobile Money (${mobileOperator.toUpperCase()})`
          : selectedPayment === 'cod'
          ? 'Paiement à la livraison (Espèces)'
          : 'Carte bancaire',
      paymentStatus: selectedPayment === 'cod' ? 'pending_cod' : 'paid',
      status: 'confirmed',
      statusStep: 2, // 1: Commande confirmée, 2: Producteur informé
    };

    setTimeout(() => {
      setIsProcessing(false);
      setConfirmedOrder(newOrder);
      onConfirmOrder(newOrder);
    }, 700);
  };

  // If we have a confirmed order, show the official post-payment confirmation screen
  if (currentDisplayOrder) {
    const steps = [
      { label: 'Commande confirmée', done: currentDisplayOrder.statusStep >= 1 },
      { label: 'Producteur informé', done: currentDisplayOrder.statusStep >= 2 },
      { label: 'En préparation', done: currentDisplayOrder.statusStep >= 3 },
      { label: 'En livraison', done: currentDisplayOrder.statusStep >= 4 },
      { label: 'Livrée', done: currentDisplayOrder.statusStep >= 5 },
    ];

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* En-tête Confirmation très claire */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-emerald-700" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Succès de la commande
            </span>
            <h1 className="text-3xl font-extrabold text-stone-900">
              ✓ Commande confirmée !
            </h1>
            <p className="text-stone-600 text-sm">
              Votre demande a été transmise en direct au producteur agricole.
            </p>
          </div>

          <div className="inline-block px-5 py-2 rounded-2xl bg-stone-100 border border-stone-200">
            <span className="text-xs text-stone-500 font-semibold block">Numéro de commande</span>
            <span className="text-xl font-black text-emerald-950 tracking-wider">
              {currentDisplayOrder.id}
            </span>
          </div>
        </div>

        {/* Suivi du Statut avec les 5 indicateurs clairs demandés */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Suivi de votre commande
              </h2>
              <p className="text-xs text-stone-500">
                Mise à jour en temps réel des étapes de préparation et de livraison
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800">
              En cours
            </span>
          </div>

          {/* Stepper Vertical / Horizontal accessible */}
          <div className="space-y-4 py-2">
            {steps.map((st, idx) => (
              <div key={st.label} className="flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                    st.done
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-200 text-stone-400'
                  }`}
                >
                  {st.done ? '✓' : idx + 1}
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span
                    className={`text-base font-semibold ${
                      st.done ? 'text-stone-900' : 'text-stone-400'
                    }`}
                  >
                    {st.done ? '🟢' : '⚪'} {st.label}
                  </span>
                  {st.done && (
                    <span className="text-xs font-semibold text-emerald-700">
                      Validé
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Simulation interactive pour tester le parcours complet */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                Simulateur de statut (pour démonstration)
              </span>
              {currentDisplayOrder.statusStep < 5 && (
                <button
                  onClick={() => {
                    const nextStep = currentDisplayOrder.statusStep + 1;
                    const updated = {
                      ...currentDisplayOrder,
                      statusStep: nextStep,
                      status:
                        nextStep === 3
                          ? ('in_prep' as const)
                          : nextStep === 4
                          ? ('out_for_delivery' as const)
                          : ('delivered' as const),
                    };
                    setConfirmedOrder(updated);
                    onConfirmOrder(updated);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer"
                >
                  Avancer à l'étape suivante →
                </button>
              )}
            </div>
            <p className="text-xs text-stone-600">
              Dans la réalité, le producteur valide chaque étape depuis son espace ou l'acheteur confirme la réception.
            </p>
          </div>

          {/* Récapitulatif de la commande confirmée */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-sm space-y-2">
            <div className="flex justify-between text-stone-600">
              <span>Produit :</span>
              <strong className="text-stone-900">{currentDisplayOrder.productName}</strong>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Quantité :</span>
              <strong className="text-stone-900">{currentDisplayOrder.quantity} {currentDisplayOrder.unit}</strong>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Mode de paiement :</span>
              <strong className="text-stone-900">{currentDisplayOrder.paymentMethodLabel}</strong>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Lieu de livraison / retrait :</span>
              <strong className="text-stone-900 text-right max-w-xs">{currentDisplayOrder.buyerAddress}</strong>
            </div>
            <div className="flex justify-between pt-2 border-t border-stone-200 text-base font-extrabold text-stone-900">
              <span>Total payé :</span>
              <span className="text-emerald-900 tabular-nums">
                {currentDisplayOrder.totalAmount.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>

          {/* Bouton : « Suivre ma commande » */}
          <button
            onClick={() => onGoToOrderTracking(currentDisplayOrder.id)}
            className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-base transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Suivre ma commande dans mon espace</span>
            <ArrowRight className="w-5 h-5 text-emerald-200" />
          </button>
        </div>
      </div>
    );
  }

  // If no draft order exists, prompt user to select a product
  if (!draftOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-3xl">
          🛒
        </div>
        <h2 className="text-2xl font-bold text-stone-900">
          Aucune commande en attente de paiement
        </h2>
        <p className="text-sm text-stone-600">
          Sélectionnez un produit sur l'accueil ou le catalogue pour passer votre commande.
        </p>
        <button
          onClick={onBackToProduct}
          className="px-6 py-3 rounded-xl bg-emerald-800 text-white font-bold text-sm cursor-pointer shadow-xs"
        >
          Parcourir les produits frais
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <button
        onClick={onBackToProduct}
        className="inline-flex items-center gap-2 text-stone-600 hover:text-emerald-900 font-semibold text-sm cursor-pointer p-2 -ml-2 rounded-lg hover:bg-stone-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Modifier la quantité ou l'adresse</span>
      </button>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-7">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Paiement de votre commande
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Vérifiez le montant ci-dessous et choisissez votre mode de règlement.
          </p>
        </div>

        {/* Résumé clair demandé :
            Produit : Tomates
            Quantité : 10 kg
            Prix produits : 8 000 FCFA
            Livraison : 1 500 FCFA
            Total : 9 500 FCFA
        */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-3">
          <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider pb-1 border-b border-stone-200">
            Résumé de la commande
          </h2>

          <div className="flex justify-between items-center text-sm">
            <span className="text-stone-600 font-medium">Produit :</span>
            <span className="font-bold text-stone-900">{draftOrder.product.name}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-stone-600 font-medium">Quantité :</span>
            <span className="font-bold text-stone-900 tabular-nums">
              {draftOrder.quantity} {draftOrder.product.unit}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-stone-600 font-medium">Prix produits :</span>
            <span className="font-bold text-stone-900 tabular-nums">
              {draftOrder.productTotal.toLocaleString('fr-FR')} FCFA
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-stone-600 font-medium">Livraison :</span>
            <span className="font-bold text-stone-900 tabular-nums">
              {draftOrder.deliveryFee === 0
                ? 'Gratuit (Retrait)'
                : `${draftOrder.deliveryFee.toLocaleString('fr-FR')} FCFA`}
            </span>
          </div>

          <div className="pt-3 border-t-2 border-stone-200 flex justify-between items-center">
            <span className="text-lg font-extrabold text-stone-900">
              Total à payer :
            </span>
            <span className="text-2xl font-black text-emerald-900 tabular-nums">
              {draftOrder.totalAmount.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
        </div>

        {/* Mode de paiement adapté au contexte local */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-stone-900">
            Choisir mon moyen de paiement
          </h3>

          <div className="space-y-3">
            {/* 1. Mobile Money (MTN / Orange) */}
            <label
              onClick={() => setSelectedPayment('mobile_money')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-3 ${
                selectedPayment === 'mobile_money'
                  ? 'bg-emerald-50/70 border-emerald-700 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={selectedPayment === 'mobile_money'}
                  onChange={() => setSelectedPayment('mobile_money')}
                  className="w-4 h-4 text-emerald-700"
                />
                <Smartphone className="w-5 h-5 text-emerald-800" />
                <div className="flex-1">
                  <div className="font-bold text-stone-900">
                    Mobile Money (Orange Money / MTN MoMo)
                  </div>
                  <div className="text-xs text-stone-500">
                    Paiement instantané et sécurisé par téléphone
                  </div>
                </div>
              </div>

              {selectedPayment === 'mobile_money' && (
                <div className="pl-7 pt-2 space-y-3 border-t border-emerald-200/60">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMobileOperator('orange')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        mobileOperator === 'orange'
                          ? 'bg-orange-500 text-white'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      Orange Money
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileOperator('mtn')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        mobileOperator === 'mtn'
                          ? 'bg-yellow-400 text-stone-900'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      MTN Mobile Money
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Numéro de téléphone débité :
                    </label>
                    <input
                      type="text"
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      placeholder="+237 6..."
                      className="w-full max-w-sm px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:border-emerald-700 focus:outline-none"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      Vous recevrez un prompt USSD sur votre écran pour confirmer votre code secret.
                    </p>
                  </div>
                </div>
              )}
            </label>

            {/* 2. Paiement à la livraison */}
            <label
              onClick={() => setSelectedPayment('cod')}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedPayment === 'cod'
                  ? 'bg-emerald-50/70 border-emerald-700 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === 'cod'}
                onChange={() => setSelectedPayment('cod')}
                className="w-4 h-4 text-emerald-700"
              />
              <Banknote className="w-5 h-5 text-emerald-800" />
              <div className="flex-1">
                <div className="font-bold text-stone-900">
                  Paiement en espèces à la livraison
                </div>
                <div className="text-xs text-stone-500">
                  Payez le livreur au moment de recevoir et vérifier vos produits
                </div>
              </div>
            </label>

            {/* 3. Carte bancaire */}
            <label
              onClick={() => setSelectedPayment('card')}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedPayment === 'card'
                  ? 'bg-emerald-50/70 border-emerald-700 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === 'card'}
                onChange={() => setSelectedPayment('card')}
                className="w-4 h-4 text-emerald-700"
              />
              <CreditCard className="w-5 h-5 text-emerald-800" />
              <div className="flex-1">
                <div className="font-bold text-stone-900">
                  Carte bancaire (Visa / Mastercard)
                </div>
                <div className="text-xs text-stone-500">
                  Paiement sécurisé en ligne
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Bouton : « Payer ma commande » */}
        <div className="pt-2">
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-lg transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Traitement sécurisé en cours...</span>
            ) : (
              <span>
                Payer ma commande ({draftOrder.totalAmount.toLocaleString('fr-FR')} FCFA)
              </span>
            )}
          </button>
          <div className="flex items-center justify-center gap-2 text-xs text-stone-500 mt-3">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Paiement protégé par le tiers de confiance AgriLink</span>
          </div>
        </div>
      </div>
    </div>
  );
};

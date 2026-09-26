import React, { useState } from 'react';
import { UserRole, Order, Product, CategoryId } from '../types';
import { CATEGORIES, PHOTO_PRESETS } from '../data/mockData';
import {
  Package,
  TrendingUp,
  Clock,
  PlusCircle,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  Sparkles,
  Phone,
  ShieldCheck,
  Check,
  X,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface Interface4UserSpaceProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  orders: Order[];
  products: Product[];
  onAddNewProduct: (newProd: Product) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status'], step: number) => void;
  onRateOrder: (orderId: string, rating: number, review: string) => void;
  onViewOrderInPayment: (order: Order) => void;
}

export const Interface4UserSpace: React.FC<Interface4UserSpaceProps> = ({
  userRole,
  setUserRole,
  orders,
  products,
  onAddNewProduct,
  onUpdateOrderStatus,
  onRateOrder,
  onViewOrderInPayment,
}) => {
  // Producer Add Product Form State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<CategoryId>('legumes');
  const [newProductQty, setNewProductQty] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductLocation, setNewProductLocation] = useState('Yaoundé - Obala');
  const [selectedPhotoPreset, setSelectedPhotoPreset] = useState(PHOTO_PRESETS[0].path);

  // Rating modal state for buyer
  const [ratingOrderId, setRatingOrderId] = useState<string | null>(null);
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  // AI Demand Forecast state
  const [aiForecastLoading, setAiForecastLoading] = useState(false);
  const [aiForecastData, setAiForecastData] = useState<{
    trendTitle: string;
    advice: string;
    highDemandProducts: string[];
    pricingInsight: string;
  }>({
    trendTitle: 'Forte demande identifiée sur les vivres frais',
    advice: 'Le maïs jaune, le manioc doux et le plantain sont actuellement très recherchés dans votre zone de Yaoundé (+35% de requêtes cette semaine).',
    highDemandProducts: ['Plantain mûr', 'Maïs doux', 'Tomates de plein champ'],
    pricingInsight: 'Les acheteurs privilégient les livraisons groupées sous 24h.',
  });

  const fetchAiForecast = async () => {
    setAiForecastLoading(true);
    try {
      const res = await fetch('/api/ai/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producerLocation: 'Yaoundé',
          currentProducts: products.map((p) => p.name),
        }),
      });
      const data = await res.json();
      if (data && data.advice) {
        setAiForecastData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiForecastLoading(false);
    }
  };

  const handlePublishProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !newProductQty || !newProductPrice) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProductName.trim(),
      category: newProductCategory,
      farmerName: 'Jean Agricole (Vous)',
      farmerPhone: '+237 6 99 12 34 56',
      location: newProductLocation.trim() || 'Yaoundé',
      distance: '3 km',
      pricePerUnit: parseInt(newProductPrice, 10) || 500,
      unit: newProductCategory === 'fruits' ? 'régime' : 'kg',
      availableQty: parseInt(newProductQty, 10) || 50,
      minOrder: 1,
      image: selectedPhotoPreset,
      description: 'Produit récolté fraîchement au champ sans additifs chimiques. Vente directe.',
      harvestDate: 'Récolte fraîche du jour',
      rating: 5.0,
      reviewCount: 0,
      deliveryAvailable: true,
      deliveryFee: 1500,
      deliveryEstTime: 'Livraison en 2h à 4h',
    };

    onAddNewProduct(newProd);
    setShowAddProductModal(false);
    // Reset form
    setNewProductName('');
    setNewProductQty('');
    setNewProductPrice('');
  };

  const handleSaveReview = () => {
    if (!ratingOrderId) return;
    onRateOrder(ratingOrderId, selectedStars, reviewComment);
    setRatingOrderId(null);
    setReviewComment('');
  };

  // Status badge helper
  const getStatusBadge = (status: Order['status'], step: number) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
            🟢 Commande confirmée
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
            🟢 Producteur informé
          </span>
        );
      case 'in_prep':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
            🟢 En préparation
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
            🟢 En livraison
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-900">
            🟢 Livrée
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900">
            🔴 Refusée par le producteur
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Switch de Rôle en haut de page avec explication simple */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            Espace Utilisateur
          </span>
          <h1 className="text-2xl font-extrabold text-stone-900">
            {userRole === 'buyer' ? 'Mon Espace Acheteur' : 'Mon Espace Producteur Agricole'}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {userRole === 'buyer'
              ? 'Consultez vos commandes en cours et notez la qualité après réception.'
              : 'Gérez vos récoltes, acceptez les commandes et suivez vos paiements reçus.'}
          </p>
        </div>

        <div className="flex items-center p-1.5 bg-stone-100 rounded-2xl border border-stone-200 shrink-0">
          <button
            onClick={() => setUserRole('buyer')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              userRole === 'buyer'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Vue Acheteur
          </button>
          <button
            onClick={() => setUserRole('producer')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              userRole === 'producer'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Vue Producteur
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ESPACE ACHETEUR : « Mes commandes »                           */}
      {/* ============================================================== */}
      {userRole === 'buyer' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                Mes commandes
              </h2>
              <p className="text-xs text-stone-500">
                Suivez en temps réel la préparation et l'arrivée de vos produits frais
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {orders.length} commande(s)
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-lg font-bold text-stone-800">
                Vous n'avez pas encore passé de commande
              </h3>
              <p className="text-sm text-stone-500 max-w-sm mx-auto">
                Explorez le marché local pour trouver des tomates, plantains et légumes directement chez les agriculteurs.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={order.productImage}
                      alt={order.productName}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-stone-500">
                          Commande {order.id}
                        </span>
                        <span className="text-xs text-stone-400">· {order.createdAt}</span>
                      </div>
                      <h4 className="text-base font-bold text-stone-900">
                        {order.quantity} {order.unit} de {order.productName}
                      </h4>
                      <div className="text-xs text-stone-600">
                        Producteur : <strong>{order.farmerName}</strong> ({order.farmerLocation})
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                    <div className="text-left sm:text-right">
                      <div className="text-sm font-black text-emerald-950 tabular-nums">
                        {order.totalAmount.toLocaleString('fr-FR')} FCFA
                      </div>
                      <div className="mt-1">
                        {getStatusBadge(order.status, order.statusStep)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewOrderInPayment(order)}
                        className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        Suivre
                      </button>

                      {order.status === 'delivered' && !order.rating && (
                        <button
                          onClick={() => {
                            setRatingOrderId(order.id);
                            setSelectedStars(5);
                          }}
                          className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>Noter</span>
                        </button>
                      )}

                      {order.rating && (
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{order.rating}/5</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal Notation & Avis post-réception (Section 10) */}
          {ratingOrderId && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Votre avis compte
                  </span>
                  <h3 className="text-xl font-bold text-stone-900">
                    Comment s'est passée votre commande ?
                  </h3>
                  <p className="text-xs text-stone-500">
                    Aidez les autres acheteurs et encouragez votre producteur local.
                  </p>
                </div>

                <div className="flex justify-center gap-2 py-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelectedStars(star)}
                      className="p-1 cursor-pointer transform hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-9 h-9 ${
                          star <= selectedStars
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Un petit mot sur la fraîcheur ou la livraison (optionnel) :
                  </label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Ex: Produits très frais et bien mûrs, livreur ponctuel !"
                    className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:border-emerald-700 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setRatingOrderId(null)}
                    className="flex-1 py-3 rounded-xl border border-stone-300 font-bold text-sm text-stone-700 hover:bg-stone-50 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveReview}
                    className="flex-1 py-3 rounded-xl bg-emerald-800 text-white font-bold text-sm hover:bg-emerald-900 cursor-pointer shadow-xs"
                  >
                    Envoyer ma note
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* ESPACE PRODUCTEUR : « Mon activité »                          */}
      {/* ============================================================== */}
      {userRole === 'producer' && (
        <div className="space-y-8">
          {/* En-tête « Mon activité » + Bouton « + Ajouter un produit » */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                Mon activité de producteur
              </h2>
              <p className="text-xs text-stone-500">
                Gérez vos récoltes et confirmez vos ventes directes
              </p>
            </div>

            {/* Bouton très visible : « + Ajouter un produit » */}
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-6 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-emerald-200" />
              <span>+ Ajouter un produit</span>
            </button>
          </div>

          {/* 4 Indicateurs Clés de l'Activité :
              - Produits publiés
              - Commandes reçues
              - Ventes
              - Paiements
          */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-1 shadow-xs">
              <span className="text-xs text-stone-500 font-semibold block">Produits publiés</span>
              <div className="text-2xl font-black text-stone-900 tabular-nums">
                {products.length}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">Actifs au marché</span>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-1 shadow-xs">
              <span className="text-xs text-stone-500 font-semibold block">Commandes reçues</span>
              <div className="text-2xl font-black text-stone-900 tabular-nums">
                {orders.length}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">En cours de traitement</span>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-1 shadow-xs">
              <span className="text-xs text-stone-500 font-semibold block">Ventes totales</span>
              <div className="text-2xl font-black text-emerald-950 tabular-nums">
                {orders
                  .filter((o) => o.status !== 'rejected')
                  .reduce((sum, o) => sum + o.productTotal, 0)
                  .toLocaleString('fr-FR')} FCFA
              </div>
              <span className="text-[11px] text-stone-500 font-medium">Chiffre d'affaires direct</span>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-1 shadow-xs">
              <span className="text-xs text-stone-500 font-semibold block">Paiements encaissés</span>
              <div className="text-2xl font-black text-emerald-800 tabular-nums">
                {orders
                  .filter((o) => o.paymentStatus === 'paid')
                  .reduce((sum, o) => sum + o.productTotal, 0)
                  .toLocaleString('fr-FR')} FCFA
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">Direct Mobile Money</span>
            </div>
          </div>

          {/* Module IA Prévision de la Demande (Section 6) */}
          <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 rounded-3xl p-6 text-white space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-lg text-white">
                  Aide IA : Prévision de la demande locale
                </h3>
              </div>
              <button
                onClick={fetchAiForecast}
                disabled={aiForecastLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-xs font-semibold text-emerald-100 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${aiForecastLoading ? 'animate-spin' : ''}`} />
                <span>{aiForecastLoading ? 'Analyse...' : 'Actualiser'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-bold text-emerald-200">
                {aiForecastData.trendTitle}
              </h4>
              <p className="text-sm text-emerald-50 leading-relaxed">
                « {aiForecastData.advice} »
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-emerald-200">
              <span className="font-semibold text-white">Forte demande actuelle :</span>
              {aiForecastData.highDemandProducts.map((p) => (
                <span
                  key={p}
                  className="px-2.5 py-1 rounded-md bg-emerald-800/80 text-white font-medium border border-emerald-700"
                >
                  {p}
                </span>
              ))}
            </div>

            <p className="text-[11px] text-emerald-400 italic">
              * Note AgriLink : Cette information est une aide à la décision économique basée sur les recherches des acheteurs et non une garantie de vente.
            </p>
          </div>

          {/* Gestion des Commandes Reçues (Section 7) : Accepter ou Refuser */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-stone-900">
              Commandes reçues à traiter
            </h3>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-sm">
                Aucune nouvelle commande pour le moment.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <div className="text-xs text-stone-500">
                          Commande <strong>{order.id}</strong> · {order.createdAt}
                        </div>
                        <h4 className="text-base font-bold text-stone-900">
                          {order.quantity} {order.unit} de {order.productName}
                        </h4>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-base font-black text-emerald-950 tabular-nums">
                          {order.productTotal.toLocaleString('fr-FR')} FCFA
                        </div>
                        <div className="text-xs text-stone-500">
                          Acheteur : <strong>{order.buyerName}</strong> ({order.buyerPhone})
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
                      <div>
                        Destination : <strong>{order.buyerAddress}</strong>
                      </div>
                      <div>
                        Mode : <strong>{order.deliveryMode === 'pickup' ? 'Retrait chez vous' : 'Livraison demandée'}</strong>
                      </div>
                    </div>

                    {/* Actions Producteur : Accepter, Refuser, Changer statut */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        {getStatusBadge(order.status, order.statusStep)}
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'accepted', 2)}
                              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Check className="w-4 h-4" />
                              <span>✓ Accepter la commande</span>
                            </button>
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'rejected', 0)}
                              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-stone-200"
                            >
                              <X className="w-4 h-4" />
                              <span>✕ Refuser</span>
                            </button>
                          </>
                        )}

                        {order.status === 'accepted' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'in_prep', 3)}
                            className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Marquer « En préparation »</span>
                          </button>
                        )}

                        {order.status === 'in_prep' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'out_for_delivery', 4)}
                            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <Truck className="w-4 h-4" />
                            <span>Remis au livreur (En route)</span>
                          </button>
                        )}

                        {order.status === 'out_for_delivery' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'delivered', 5)}
                            className="px-4 py-2 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Confirmer la livraison acheteur</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Liste des Produits Publiés */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <h3 className="text-lg font-bold text-stone-900">
              Mes produits en ligne ({products.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 flex flex-col justify-between shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm leading-tight">
                        {prod.name}
                      </h4>
                      <div className="text-xs text-stone-500 mt-1">
                        Stock : <strong>{prod.availableQty} {prod.unit}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                    <span className="font-bold text-emerald-900 text-sm tabular-nums">
                      {prod.pricePerUnit.toLocaleString('fr-FR')} FCFA/{prod.unit}
                    </span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                      En ligne
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FORMULAIRE ULTRA SIMPLE : « + Ajouter un produit »             */}
      {/* ============================================================== */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-xl font-bold text-stone-900">
                  + Ajouter un produit agricole
                </h3>
                <p className="text-xs text-stone-500">
                  Remplissez ce formulaire très simple pour publier votre récolte.
                </p>
              </div>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishProduct} className="space-y-4">
              {/* Nom du produit */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Nom du produit :
                </label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="Ex: Tomates fraîches, Plantain vert, Maïs sec..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-700 focus:outline-none"
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Catégorie :
                </label>
                <select
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value as CategoryId)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-700 focus:outline-none bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.emoji} {cat.label} ({cat.desc})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Quantité disponible */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Quantité disponible :
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newProductQty}
                    onChange={(e) => setNewProductQty(e.target.value)}
                    placeholder="Ex: 50"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-700 focus:outline-none"
                  />
                  <span className="text-[11px] text-stone-500 mt-0.5 block">
                    (en kg ou régimes)
                  </span>
                </div>

                {/* Prix unitaire en FCFA */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Prix (en FCFA) :
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    step={50}
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    placeholder="Ex: 800"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-700 focus:outline-none"
                  />
                  <span className="text-[11px] text-stone-500 mt-0.5 block">
                    Prix par unité
                  </span>
                </div>
              </div>

              {/* Localisation */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Localisation de la plantation / champ :
                </label>
                <input
                  type="text"
                  required
                  value={newProductLocation}
                  onChange={(e) => setNewProductLocation(e.target.value)}
                  placeholder="Ex: Yaoundé - Obala"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-700 focus:outline-none"
                />
              </div>

              {/* Photo du produit */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Photo du produit :
                </label>
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {PHOTO_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setSelectedPhotoPreset(preset.path)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        selectedPhotoPreset === preset.path
                          ? 'border-emerald-800 ring-2 ring-emerald-300'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.path} alt={preset.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Bouton : « Publier mon produit » */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-base transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-5 h-5 text-emerald-200" />
                  <span>Publier mon produit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

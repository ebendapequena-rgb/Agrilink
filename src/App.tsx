/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveInterface, UserRole, Product, Order, DeliveryMode } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/mockData';
import { Header } from './components/Header';
import { Interface1Home } from './components/Interface1Home';
import { Interface2ProductOrder } from './components/Interface2ProductOrder';
import { Interface3PaymentDelivery } from './components/Interface3PaymentDelivery';
import { Interface4UserSpace } from './components/Interface4UserSpace';
import { AIAssistantModal } from './components/AIAssistantModal';
import { BottomNav } from './components/BottomNav';
import { Sprout, Heart, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeInterface, setActiveInterface] = useState<ActiveInterface>('accueil');
  const [userRole, setUserRole] = useState<UserRole>('buyer');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Selected product for Interface 2 (Produit / Commande)
  const [selectedProduct, setSelectedProduct] = useState<Product>(INITIAL_PRODUCTS[0]);

  // Draft order prepared in Interface 2 and passed to Interface 3 (Paiement & Livraison)
  const [draftOrder, setDraftOrder] = useState<{
    product: Product;
    quantity: number;
    productTotal: number;
    deliveryMode: DeliveryMode;
    deliveryFee: number;
    totalAmount: number;
    deliveryAddress: string;
    buyerName: string;
    buyerPhone: string;
  } | null>({
    product: INITIAL_PRODUCTS[0],
    quantity: 10,
    productTotal: 8000,
    deliveryMode: 'home',
    deliveryFee: 1500,
    totalAmount: 9500,
    deliveryAddress: 'Quartier Bastos, Yaoundé',
    buyerName: 'Marie Dupont',
    buyerPhone: '+237 6 90 12 34 56',
  });

  // Currently focused order in Interface 3
  const [activeOrderForTracking, setActiveOrderForTracking] = useState<Order | null>(null);

  // AI Modal state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');

  // Handle selecting a product from Interface 1 (Home)
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setDraftOrder({
      product,
      quantity: product.minOrder || 5,
      productTotal: (product.minOrder || 5) * product.pricePerUnit,
      deliveryMode: 'home',
      deliveryFee: product.deliveryFee,
      totalAmount: (product.minOrder || 5) * product.pricePerUnit + product.deliveryFee,
      deliveryAddress: 'Quartier Bastos, Yaoundé',
      buyerName: 'Marie Dupont',
      buyerPhone: '+237 6 90 12 34 56',
    });
    setActiveOrderForTracking(null);
    setActiveInterface('produit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle proceeding from Interface 2 to Interface 3
  const handleProceedToPayment = (orderData: {
    product: Product;
    quantity: number;
    productTotal: number;
    deliveryMode: DeliveryMode;
    deliveryFee: number;
    totalAmount: number;
    deliveryAddress: string;
    buyerName: string;
    buyerPhone: string;
  }) => {
    setDraftOrder(orderData);
    setActiveOrderForTracking(null);
    setActiveInterface('paiement');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle new confirmed order in Interface 3
  const handleConfirmOrder = (newOrder: Order) => {
    setOrders((prev) => {
      const exists = prev.find((o) => o.id === newOrder.id);
      if (exists) {
        return prev.map((o) => (o.id === newOrder.id ? newOrder : o));
      }
      return [newOrder, ...prev];
    });
    setActiveOrderForTracking(newOrder);
  };

  // Producer updates order status (accepted, in_prep, out_for_delivery, delivered, rejected)
  const handleUpdateOrderStatus = (orderId: string, status: Order['status'], step: number) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, statusStep: step } : o))
    );
    if (activeOrderForTracking && activeOrderForTracking.id === orderId) {
      setActiveOrderForTracking((prev) =>
        prev ? { ...prev, status, statusStep: step } : null
      );
    }
  };

  // Buyer rates order
  const handleRateOrder = (orderId: string, rating: number, review: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, rating, review } : o))
    );
  };

  // Producer adds new harvest product
  const handleAddNewProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    setSelectedProduct(newProd);
  };

  // Open AI Assistant with optional pre-filled prompt
  const handleOpenAssistant = (promptText?: string) => {
    setAiInitialPrompt(promptText || '');
    setIsAiModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF7] text-[#1E2922]">
      {/* Top Header */}
      <Header
        activeInterface={activeInterface}
        setActiveInterface={setActiveInterface}
        userRole={userRole}
        setUserRole={setUserRole}
        ordersCount={orders.length}
      />

      {/* Main Content Area: Renders 1 of the 4 strict interfaces */}
      <main className="flex-1 pb-20">
        {/* INTERFACE 1 — ACCUEIL / RECHERCHE */}
        {activeInterface === 'accueil' && (
          <Interface1Home
            products={products}
            onSelectProduct={handleSelectProduct}
            onOpenAssistant={handleOpenAssistant}
            onGoToProducerSpace={() => {
              setUserRole('producer');
              setActiveInterface('espace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onScrollToCatalog={() => {
              const el = document.getElementById('catalogue');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {/* INTERFACE 2 — PRODUIT / COMMANDE */}
        {activeInterface === 'produit' && (
          <Interface2ProductOrder
            product={selectedProduct}
            onBackToHome={() => {
              setActiveInterface('accueil');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onProceedToPayment={handleProceedToPayment}
          />
        )}

        {/* INTERFACE 3 — PAIEMENT & LIVRAISON */}
        {activeInterface === 'paiement' && (
          <Interface3PaymentDelivery
            draftOrder={draftOrder}
            activeOrder={activeOrderForTracking}
            onConfirmOrder={handleConfirmOrder}
            onGoToOrderTracking={(orderId) => {
              setActiveInterface('espace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToProduct={() => {
              setActiveInterface('produit');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* INTERFACE 4 — ESPACE UTILISATEUR / PRODUCTEUR */}
        {activeInterface === 'espace' && (
          <Interface4UserSpace
            userRole={userRole}
            setUserRole={setUserRole}
            orders={orders}
            products={products}
            onAddNewProduct={handleAddNewProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onRateOrder={handleRateOrder}
            onViewOrderInPayment={(order) => {
              setActiveOrderForTracking(order);
              setActiveInterface('paiement');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Reassuring Footer */}
      <footer className="bg-stone-900 text-stone-300 py-10 px-4 sm:px-6 border-t border-stone-800 text-xs hidden md:block">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
              <Sprout className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm block">AgriLink</span>
              <span className="text-stone-400 text-[11px]">
                Transformation structurelle de l'économie agricole locale
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-stone-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Paiements sécurisés Mobile Money
            </span>
            <span>·</span>
            <span>Mise en relation sans commission intermédiaire</span>
            <span>·</span>
            <span>Livraison directe du champ à la maison</span>
          </div>

          <div className="text-stone-500">
            © {new Date().getFullYear()} AgriLink · Fait pour le développement local
          </div>
        </div>
      </footer>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        products={products}
        initialPrompt={aiInitialPrompt}
        onSelectProductToOrder={(prod, qty) => {
          setSelectedProduct(prod);
          const chosenQty = qty || prod.minOrder || 5;
          setDraftOrder({
            product: prod,
            quantity: chosenQty,
            productTotal: chosenQty * prod.pricePerUnit,
            deliveryMode: 'home',
            deliveryFee: prod.deliveryFee,
            totalAmount: chosenQty * prod.pricePerUnit + prod.deliveryFee,
            deliveryAddress: 'Quartier Bastos, Yaoundé',
            buyerName: 'Marie Dupont',
            buyerPhone: '+237 6 90 12 34 56',
          });
          setActiveOrderForTracking(null);
          setActiveInterface('produit');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Bottom Navigation */}
      <BottomNav
        activeInterface={activeInterface}
        setActiveInterface={(ui) => {
          setActiveInterface(ui);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAssistant={() => handleOpenAssistant()}
        ordersCount={orders.length}
        userRole={userRole}
        onFocusSearch={() => {
          const el = document.getElementById('catalogue');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </div>
  );
}

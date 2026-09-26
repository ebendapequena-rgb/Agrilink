export type CategoryId = 'cereales' | 'legumes' | 'fruits' | 'tubercules' | 'autres';

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  desc: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  farmerName: string;
  farmerPhone: string;
  farmerPhoto?: string;
  location: string;
  distance: string;
  pricePerUnit: number; // in FCFA
  unit: string; // e.g. "kg", "régime", "sac"
  availableQty: number;
  minOrder: number;
  image: string;
  description: string;
  harvestDate: string;
  rating: number;
  reviewCount: number;
  deliveryAvailable: boolean;
  deliveryFee: number;
  deliveryEstTime: string;
}

export type DeliveryMode = 'pickup' | 'home' | 'collection_point';
export type PaymentMethod = 'mobile_money' | 'cod' | 'card';

export type OrderStatus =
  | 'confirmed' // 1. Commande confirmée (Producteur informé)
  | 'accepted'  // 2. Acceptée par le producteur
  | 'in_prep'   // 3. En préparation
  | 'out_for_delivery' // 4. En livraison / Livreur en route
  | 'delivered' // 5. Livrée
  | 'rejected'; // Refusée

export interface Order {
  id: string; // e.g. "#AG2458"
  createdAt: string;
  productId: string;
  productName: string;
  productImage: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  productTotal: number;
  deliveryMode: DeliveryMode;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentMethodLabel: string;
  paymentStatus: 'paid' | 'pending_cod';
  status: OrderStatus;
  statusStep: number; // 1 to 5
  rating?: number;
  review?: string;
}

export type ActiveInterface = 
  | 'accueil'      // Interface 1: Accueil / Recherche
  | 'produit'      // Interface 2: Produit / Commande
  | 'paiement'     // Interface 3: Paiement & Livraison (Confirmation & Suivi)
  | 'espace';      // Interface 4: Espace Utilisateur (Acheteur / Producteur)

export type UserRole = 'buyer' | 'producer';

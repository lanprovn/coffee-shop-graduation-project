export interface LatLng {
  lat: number;
  lng: number;
}

export interface UserAddress {
  fullAddress: string;
  coordinates: LatLng;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface UserWithAddress extends AuthUser {
  address?: UserAddress;
}

export enum ProductCategory {
  Coffee = 'coffee',
  Tea = 'tea',
  Freeze = 'freeze',
  Cake = 'cake',
}

export enum ProductSize {
  Small = 'S',
  Medium = 'M',
  Large = 'L',
}

export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface ProductSizeOption {
  name: string;
  price: number;
  volume: string;
}

export interface ProductCustomization {
  name: string;
  options: string[];
}

export interface ProductNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface CoffeeProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: ProductCategory;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  isAvailable: boolean;
  sizes: ProductSizeOption[];
  customizations: ProductCustomization[];
  nutrition: ProductNutrition;
  allergens: string[];
  preparationTime: number; // in minutes
  tags: string[];
}

export interface CartItem {
  id: string;
  product: CoffeeProduct;
  quantity: number;
  size: string;
  customizations?: Record<string, string>;
}

export enum DeliOption {
  DELIVER = 'delivery',
  PICK_UP = 'pick-up',
}

export enum PaymentMethod {
  CASH = 'cash',
  KBZ_PAY = 'kbz-pay',
  WAVE_MONEY = 'wave-money',
}

export enum CoffeeSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  coordinates: LatLng;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  size: ProductSize;
  toppings: Topping[];
  unitPrice: number;
  totalPrice: number;
}

export interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  isActive: boolean;
  expiryDate?: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  deliOption: DeliOption;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  voucherDiscount: number;
  totalPayment: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  voucherCode?: string;
}

export enum OrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Preparing = 'preparing',
  Ready = 'ready',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export interface DeliveryOrder {
  id: string;
  userId: string;
  items: {
    product: CoffeeProduct;
    quantity: number;
    size: string;
    customizations?: Record<string, string>;
  }[];
  total: number;
  deliveryFee: number;
  discount: number;
  finalTotal: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentMethod: string;
  deliveryAddress: UserAddress;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  rating?: number;
  review?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5 stars
  comment: string;
  images?: string[];
  createdAt: string;
  helpful: number;
  verified: boolean; // Đã mua sản phẩm
}

export interface ProductRating {
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'membership' | 'general';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface Membership {
  level: string;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
  color: string;
  icon: string;
}

export interface UserAddress {
  id: string;
  name: string;
  address: string;
  phone: string;
  isDefault: boolean;
  coordinates: LatLng;
}

export interface UserPreferences {
  favoriteCategories: string[];
  favoriteProducts: string[];
  dietaryRestrictions: string[];
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface UserProfile extends AuthUser {
  phone?: string;
  points: number;
  totalSpent: number;
  joinDate: string;
  membership: Membership;
  preferences: UserPreferences;
  addresses: UserAddress[];
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  coordinates: LatLng;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  rating: number;
  reviewCount: number;
  images: string[];
  isOpen: boolean;
  deliveryRadius: number;
  deliveryFee: number;
  minOrderAmount: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  image: string;
  category: 'news' | 'promotion' | 'event';
  tags: string[];
  isFeatured: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  revenueByMonth: { month: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
  topProducts: { productId: string; productName: string; sales: number }[];
}

export type HeroIcon = React.ComponentType<
  React.PropsWithoutRef<React.ComponentProps<'svg'>> & {
    title?: string | undefined;
    titleId?: string | undefined;
  }
>;
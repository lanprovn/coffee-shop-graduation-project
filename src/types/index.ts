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
  size: ProductSize;
  price: number;
}

export interface CoffeeProduct {
  id: string;
  displayName: string;
  category: ProductCategory;
  basePrice: number;
  description: string;
  image: string;
  sizes: ProductSizeOption[];
  toppings: Topping[];
  isAvailable: boolean;
}

export interface CartItem {
  product: CoffeeProduct;
  quantity: number;
  selectedSize: ProductSize;
  selectedToppings: Topping[];
  unitPrice: number;
  totalPrice: number;
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
  customer: Customer;
  items: OrderItem[];
  deliOption: DeliOption;
  paymentMethod: PaymentMethod;
  totalPayment: number;
  date: string;
  image: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: string;
  isVerified: boolean; // Đã mua sản phẩm
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
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface Membership {
  id: string;
  name: string;
  level: 'Silver' | 'Gold' | 'Diamond';
  benefits: string[];
  discountPercentage: number;
  pointsMultiplier: number;
  minSpent: number;
  color: string;
  icon: string;
}

export interface UserProfile extends AuthUser {
  membership?: Membership;
  points: number;
  totalSpent: number;
  joinDate: string;
  phone?: string;
  address?: UserAddress;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  coordinates: LatLng;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  image: string;
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
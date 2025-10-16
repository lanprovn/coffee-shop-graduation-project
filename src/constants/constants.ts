import { CoffeeSize, DeliOption, LatLng, PaymentMethod } from '@/types';

export const APP_NAME = 'Highland Coffee';

export const GOOGLE_OAUTH_CLIENT_ID = 'mock-google-client-id';

export const MAPBOX_ACCESS_TOKEN = 'mock-mapbox-token';

export const defaultCoordinate: LatLng = {
  lng: 96.17045650343823,
  lat: 16.785692464382592,
};

export const defaultDeliFee = 2000;

export const coffeeSizeOptions = [
  {
    value: CoffeeSize.SMALL,
    label: 'Small',
  },
  {
    value: CoffeeSize.MEDIUM,
    label: 'Medium',
  },
  {
    value: CoffeeSize.LARGE,
    label: 'Large',
  },
];

export const deliOptions = [
  {
    value: DeliOption.DELIVER,
    label: 'Deliver',
  },
  {
    value: DeliOption.PICK_UP,
    label: 'Pick Up',
  },
];

export const paymentMethodOptions = [
  {
    value: PaymentMethod.CASH,
    label: 'Cash on Delivery',
    icon: '/images/cash-payment-icon.png',
  },
  {
    value: PaymentMethod.KBZ_PAY,
    label: 'KBZ Pay',
    icon: '/images/kbz-pay-icon.png',
  },
  {
    value: PaymentMethod.WAVE_MONEY,
    label: 'Wave Money',
    icon: '/images/wave-money-icon.png',
  },
];

// POS Kiosk Constants
export const KIOSK_DEFAULT_SETTINGS = {
  storeName: 'Highland Coffee',
  storeAddress: '123 Main Street, Yangon, Myanmar',
  taxRate: 0.05, // 5%
  currency: 'MMK',
  receiptFooter: 'Thank you for your visit!',
  autoLogoutMinutes: 30,
  printerSettings: {
    enabled: true,
    printerName: 'POS Printer',
    paperSize: '80mm'
  },
  cashDrawerSettings: {
    enabled: true,
    openCommand: 'ESC/POS'
  }
};

export const KIOSK_TOUCH_TARGET_SIZE = {
  min: 44, // Minimum touch target size in pixels
  recommended: 48,
  large: 56
};

export const KIOSK_LAYOUT_BREAKPOINTS = {
  small: 768,
  medium: 1024,
  large: 1440,
  xlarge: 1920
};

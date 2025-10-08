# Coffee Shop - Premium Coffee & Beverages Web App

A modern, high-performance React web application for a premium coffee shop experience. Built with React 18, TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

### Core Features
- **Responsive Design**: Mobile-first design with seamless desktop experience
- **Product Catalog**: Browse coffee, tea, freeze drinks, and desserts
- **Shopping Cart**: Add, remove, and manage items with real-time updates
- **Checkout Process**: Complete order flow with multiple payment options
- **User Authentication**: Google OAuth integration
- **Order Management**: Track order history and status
- **Reviews & Ratings**: Product reviews and rating system

### Advanced Features
- **Wishlist**: Save favorite products
- **Product Comparison**: Compare multiple products
- **Recommendations**: AI-powered product recommendations
- **Bulk Orders**: Special bulk ordering system
- **Analytics Dashboard**: Advanced analytics and insights
- **Loyalty Program**: Membership tiers and points system
- **Social Sharing**: Share products and orders
- **Support Chat**: Integrated customer support

### Performance Features
- **Lazy Loading**: All pages and components are lazy-loaded
- **Code Splitting**: Optimized bundle splitting
- **Image Optimization**: WebP support and lazy loading
- **Service Worker**: Offline caching and PWA capabilities
- **Performance Monitoring**: Real-time performance tracking
- **SEO Optimization**: Complete SEO with meta tags and structured data

## 🛠️ Tech Stack

### Frontend
- **React 18** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Helmet Async** - SEO and meta tag management

### Testing
- **Vitest** - Fast unit testing framework
- **Testing Library** - React component testing
- **Jest DOM** - DOM testing utilities

### Performance & Analytics
- **Google Analytics 4** - User behavior tracking
- **Performance API** - Core Web Vitals monitoring
- **Service Worker** - Offline support and caching
- **Web Vitals** - Performance metrics

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coffee-shop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

### Test Structure
```
src/test/
├── setup.ts              # Test configuration
├── App.test.tsx          # App component tests
├── components/           # Component tests
│   └── BaseButton.test.tsx
└── utils/                # Utility function tests
    └── helper.test.ts
```

## 🚀 Build & Deployment

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Build Optimizations
- **Terser Minification**: Removes console logs and debugger statements
- **Code Splitting**: Separate chunks for vendor libraries
- **Tree Shaking**: Removes unused code
- **Asset Optimization**: Optimized images and fonts

## 📱 PWA Features

### Service Worker
- **Offline Support**: Cache static resources for offline use
- **Background Sync**: Sync offline actions when back online
- **Push Notifications**: Order updates and promotions
- **Cache Strategy**: Intelligent caching with network fallback

### PWA Manifest
- **App Shortcuts**: Quick access to menu and cart
- **Install Prompt**: Add to home screen functionality
- **Theme Colors**: Consistent branding
- **Icons**: High-quality app icons

## 🔍 SEO & Analytics

### SEO Features
- **Meta Tags**: Complete Open Graph and Twitter Card support
- **Structured Data**: Schema.org markup for search engines
- **Sitemap**: Automatic sitemap generation
- **Canonical URLs**: Proper URL canonicalization
- **Performance**: Core Web Vitals optimization

### Analytics Integration
- **Google Analytics 4**: User behavior tracking
- **E-commerce Tracking**: Purchase and cart events
- **Performance Monitoring**: Page load and interaction metrics
- **Error Tracking**: Automatic error reporting

## 🎨 Design System

### Color Palette
- **Primary**: Coffee-inspired green (#006241)
- **Neutral**: Warm grays and browns
- **Accent**: Complementary colors for CTAs

### Typography
- **Font**: System fonts with Inter fallback
- **Scale**: Responsive typography scale
- **Weights**: 400, 500, 600, 700

### Components
- **Buttons**: Multiple variants (filled, outline, ghost)
- **Cards**: Product and content cards
- **Forms**: Optimized form components
- **Modals**: Accessible modal system
- **Navigation**: Responsive navigation

## 📊 Performance Metrics

### Core Web Vitals
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Bundle Size
- **Initial Bundle**: < 200KB gzipped
- **Vendor Chunks**: Optimized splitting
- **Lazy Routes**: On-demand loading

## 🔧 Configuration

### Environment Variables
```bash
# Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-client-id

# Mapbox
VITE_MAPBOX_ACCESS_TOKEN=your-token
```

### Build Configuration
- **Target**: ESNext for modern browsers
- **Minification**: Terser with production optimizations
- **Source Maps**: Disabled in production
- **Asset Optimization**: Automatic image optimization

## 📁 Project Structure

```
src/
├── components/           # Reusable components
│   ├── layout/          # Layout components
│   └── shared/         # Shared components
├── hooks/              # Custom React hooks
│   ├── context/        # React contexts
│   ├── provider/       # Context providers
│   └── *.ts           # Custom hooks
├── pages/              # Page components
├── data/               # Static data
├── types/              # TypeScript types
├── utils/              # Utility functions
├── styles/             # CSS files
└── test/               # Test files
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for coffee lovers everywhere**
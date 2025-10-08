import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  structuredData?: any;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  locale?: string;
  alternateLocales?: { hreflang: string; href: string }[];
}

const SEO: React.FC<SEOProps> = ({
  title = 'Highland Coffee - Premium Coffee & Beverages',
  description = 'Khám phá thế giới cà phê cao cấp tại Highland Coffee. Từ cà phê truyền thống đến các thức uống hiện đại, chúng tôi mang đến trải nghiệm tuyệt vời nhất.',
  keywords = 'highland coffee, cà phê, coffee, thức uống, beverage, coffee shop, cà phê cao cấp, espresso, latte, cappuccino, đặt hàng online, giao hàng tận nơi',
  image = '/images/home-open-graph.png',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  author = 'Highland Coffee',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  structuredData,
  canonical,
  noindex = false,
  nofollow = false,
  locale = 'vi_VN',
  alternateLocales = []
}) => {
  const siteName = 'Highland Coffee';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
  const canonicalUrl = canonical || fullUrl;

  // Generate structured data
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/images/app-logo.png`,
    description: description,
    sameAs: [
      'https://www.facebook.com/highlandcoffee',
      'https://www.instagram.com/highlandcoffee',
      'https://www.youtube.com/highlandcoffee'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-28-3822-1234',
      contactType: 'customer service',
      availableLanguage: ['Vietnamese', 'English']
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Nguyễn Huệ',
      addressLocality: 'Quận 1',
      addressRegion: 'TP.HCM',
      addressCountry: 'VN'
    },
    openingHours: 'Mo-Su 06:00-23:00',
    priceRange: '$$'
  };

  const mergedStructuredData = structuredData ? 
    { ...defaultStructuredData, ...structuredData } : 
    defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} />
      <meta name="language" content={locale} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate Locales */}
      {alternateLocales.map((locale, index) => (
        <link key={index} rel="alternate" hrefLang={locale.hreflang} href={locale.href} />
      ))}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Article specific Open Graph tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@highlandcoffee" />
      <meta name="twitter:creator" content="@highlandcoffee" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#C41E3A" />
      <meta name="msapplication-TileColor" content="#C41E3A" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(mergedStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;

// Product-specific SEO component
interface ProductSEOProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating: number;
    reviewCount: number;
    category: string;
    availability: boolean;
    brand?: string;
  };
  url?: string;
}

export const ProductSEO: React.FC<ProductSEOProps> = ({ product, url }) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const productUrl = url || `${siteUrl}/products/${product.id}`;
  const productImage = product.image.startsWith('http') ? product.image : `${siteUrl}${product.image}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: productImage,
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Highland Coffee'
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'VND',
      availability: product.availability ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Highland Coffee'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1
    }
  };

  const title = `${product.name} - Highland Coffee`;
  const description = `${product.description} | Giá: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)} | Đánh giá: ${product.rating}/5 (${product.reviewCount} đánh giá)`;
  const keywords = `${product.name}, ${product.category}, cà phê, highland coffee, ${product.brand || 'highland'}`;

  return (
    <SEO
      title={title}
      description={description}
      keywords={keywords}
      image={productImage}
      url={productUrl}
      type="product"
      structuredData={structuredData}
    />
  );
};

// Article-specific SEO component
interface ArticleSEOProps {
  article: {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    author: string;
    publishedAt: string;
    modifiedAt?: string;
    image: string;
    category: string;
    tags: string[];
  };
  url?: string;
}

export const ArticleSEO: React.FC<ArticleSEOProps> = ({ article, url }) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const articleUrl = url || `${siteUrl}/news/${article.id}`;
  const articleImage = article.image.startsWith('http') ? article.image : `${siteUrl}${article.image}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: articleImage,
    url: articleUrl,
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Highland Coffee',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/app-logo.png`
      }
    },
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt || article.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl
    }
  };

  return (
    <SEO
      title={`${article.title} - Highland Coffee`}
      description={article.excerpt}
      keywords={`${article.title}, ${article.category}, tin tức, highland coffee, ${article.tags.join(', ')}`}
      image={articleImage}
      url={articleUrl}
      type="article"
      author={article.author}
      publishedTime={article.publishedAt}
      modifiedTime={article.modifiedAt}
      section={article.category}
      tags={article.tags}
      structuredData={structuredData}
    />
  );
};

// Store-specific SEO component
interface StoreSEOProps {
  store: {
    id: string;
    name: string;
    address: string;
    phone: string;
    coordinates: { lat: number; lng: number };
    hours: Record<string, string>;
    rating: number;
    reviewCount: number;
  };
  url?: string;
}

export const StoreSEO: React.FC<StoreSEOProps> = ({ store, url }) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const storeUrl = url || `${siteUrl}/stores/${store.id}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: store.name,
    description: `Cửa hàng Highland Coffee tại ${store.address}`,
    url: storeUrl,
    telephone: store.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.address,
      addressCountry: 'VN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: store.coordinates.lat,
      longitude: store.coordinates.lng
    },
    openingHours: Object.entries(store.hours).map(([day, hours]) => 
      `${day.substring(0, 2)} ${hours}`
    ),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: store.rating,
      reviewCount: store.reviewCount,
      bestRating: 5,
      worstRating: 1
    }
  };

  return (
    <SEO
      title={`${store.name} - Highland Coffee`}
      description={`Cửa hàng Highland Coffee tại ${store.address}. Đánh giá: ${store.rating}/5 (${store.reviewCount} đánh giá). Liên hệ: ${store.phone}`}
      keywords={`${store.name}, cửa hàng, highland coffee, ${store.address}, cà phê`}
      url={storeUrl}
      type="website"
      structuredData={structuredData}
    />
  );
};

// Breadcrumb structured data
export const BreadcrumbStructuredData: React.FC<{
  items: { name: string; url: string }[];
}> = ({ items }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
};

// FAQ structured data
export const FAQStructuredData: React.FC<{
  faqs: { question: string; answer: string }[];
}> = ({ faqs }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
};
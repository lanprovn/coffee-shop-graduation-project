import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'product';
    structuredData?: any;
}

const SEO: React.FC<SEOProps> = ({
    title = 'Coffee Shop - Premium Coffee & Beverages',
    description = 'Khám phá thế giới cà phê cao cấp tại Coffee Shop. Từ cà phê truyền thống đến các thức uống hiện đại, chúng tôi mang đến trải nghiệm tuyệt vời nhất.',
    keywords = 'cà phê, coffee, thức uống, beverage, coffee shop, cà phê cao cấp, espresso, latte, cappuccino',
    image = '/images/home-open-graph.png',
    url,
    type = 'website',
    structuredData
}) => {
    const location = useLocation();
    const currentUrl = url || `${window.location.origin}${location.pathname}`;
    const fullImageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;

    const defaultStructuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Coffee Shop",
        "description": description,
        "url": window.location.origin,
        "logo": `${window.location.origin}/images/app-logo.png`,
        "image": fullImageUrl,
        "sameAs": [
            "https://facebook.com/coffeeshop",
            "https://instagram.com/coffeeshop",
            "https://twitter.com/coffeeshop"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+84-xxx-xxx-xxx",
            "contactType": "customer service",
            "availableLanguage": ["Vietnamese", "English"]
        },
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Coffee Street",
            "addressLocality": "Ho Chi Minh City",
            "addressCountry": "VN"
        },
        "openingHours": "Mo-Su 07:00-22:00"
    };

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="Coffee Shop" />
            <meta name="robots" content="index, follow" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImageUrl} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="Coffee Shop" />
            <meta property="og:locale" content="vi_VN" />

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImageUrl} />
            <meta name="twitter:site" content="@coffeeshop" />
            <meta name="twitter:creator" content="@coffeeshop" />

            {/* Additional Meta Tags */}
            <meta name="theme-color" content="#006241" />
            <meta name="msapplication-TileColor" content="#006241" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="Coffee Shop" />

            {/* Canonical URL */}
            <link rel="canonical" href={currentUrl} />

            {/* Favicon */}
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/images/app-logo.png" />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData || defaultStructuredData)}
            </script>
        </Helmet>
    );
};

export default SEO;

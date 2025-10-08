// Service Worker for Coffee Shop Web App
const CACHE_NAME = 'coffee-shop-v1';
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/images/app-logo.svg',
    '/images/app-logo.png',
    '/images/home-open-graph.png',
    '/images/male-avatar.png',
    '/images/empty-cart.png',
    '/images/success.png',
    '/images/cash-payment-icon.png',
    '/images/kbz-pay-icon.png',
    '/images/wave-money-icon.png',
    '/images/self-pickup.png',
    '/images/google-maps-vecotr.png',
    '/images/empty-folder.png',
    '/images/home-promote-card.png',
    '/images/my-cv-link-qr-code.png'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching static resources...');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('Static resources cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Failed to cache static resources:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip external requests
    if (url.origin !== location.origin) {
        return;
    }

    // Skip API requests (they should always go to network)
    if (url.pathname.startsWith('/api/')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('Serving from cache:', request.url);
                    return cachedResponse;
                }

                console.log('Fetching from network:', request.url);
                return fetch(request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response for caching
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });

                        return response;
                    })
                    .catch((error) => {
                        console.error('Network fetch failed:', error);

                        // Return offline page for navigation requests
                        if (request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }

                        throw error;
                    });
            })
    );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('Background sync triggered:', event.tag);

    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Handle offline actions when back online
            handleBackgroundSync()
        );
    }
});

// Push notifications
self.addEventListener('push', (event) => {
    console.log('Push notification received');

    const options = {
        body: event.data ? event.data.text() : 'New notification from Coffee Shop',
        icon: '/images/app-logo.png',
        badge: '/images/app-logo.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Order',
                icon: '/images/app-logo.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/images/app-logo.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Coffee Shop', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event.action);

    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/orders')
        );
    }
});

// Helper function for background sync
async function handleBackgroundSync() {
    try {
        // Handle offline cart items, orders, etc.
        console.log('Handling background sync...');

        // Example: Sync offline cart items
        const offlineCart = await getOfflineCart();
        if (offlineCart && offlineCart.length > 0) {
            await syncOfflineCart(offlineCart);
        }

        console.log('Background sync completed');
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Helper functions for offline data
async function getOfflineCart() {
    try {
        const response = await fetch('/api/offline-cart');
        return await response.json();
    } catch (error) {
        console.error('Failed to get offline cart:', error);
        return [];
    }
}

async function syncOfflineCart(cartItems) {
    try {
        await fetch('/api/sync-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: cartItems }),
        });

        // Clear offline cart after successful sync
        await fetch('/api/clear-offline-cart', { method: 'POST' });
    } catch (error) {
        console.error('Failed to sync offline cart:', error);
    }
}

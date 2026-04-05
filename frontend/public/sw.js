const CACHE_NAME = 'healthcare-platform-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
];

const API_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/user/profile',
  '/api/appointments',
  '/api/prescriptions',
  '/api/medical-records'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API routes
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets and navigation
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // For navigation requests, try to serve index.html (SPA support)
        if (request.mode === 'navigate') {
          return caches.match('/index.html')
            .then((response) => response || fetch(request));
        }

        // Fetch from network and cache
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response for caching
            const responseToCache = response.clone();
            
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Offline fallback for images
            if (request.destination === 'image') {
              return new Response(
                '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280" font-size="18">Image unavailable offline</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }

            // Offline fallback for pages
            if (request.mode === 'navigate') {
              return caches.match('/offline.html');
            }

            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Handle API requests with offline support
async function handleApiRequest(request) {
  try {
    // Try network first for API requests
    const response = await fetch(request);
    
    // Cache successful GET requests
    if (request.method === 'GET' && response.ok) {
      const responseToCache = response.clone();
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          cache.put(request, responseToCache);
        });
    }
    
    return response;
  } catch (error) {
    console.log('Service Worker: API request failed, trying cache:', request.url);
    
    // Try to serve from cache for GET requests
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // Return offline response for API failures
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'No internet connection. Please check your network and try again.',
        offline: true
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-appointments') {
    event.waitUntil(syncAppointments());
  }
  
  if (event.tag === 'background-sync-prescriptions') {
    event.waitUntil(syncPrescriptions());
  }
  
  if (event.tag === 'background-sync-health-data') {
    event.waitUntil(syncHealthData());
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from Healthcare Platform',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Healthcare Platform', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app to relevant page
    event.waitUntil(
      clients.openWindow('/appointments')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll().then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  console.log('Service Worker: Periodic sync triggered:', event.tag);
  
  if (event.tag === 'periodic-sync-health-data') {
    event.waitUntil(syncHealthData());
  }
});

// Sync functions
async function syncAppointments() {
  console.log('Service Worker: Syncing appointments...');
  try {
    // Get offline appointments from IndexedDB
    const offlineAppointments = await getOfflineData('appointments');
    
    for (const appointment of offlineAppointments) {
      try {
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(appointment)
        });
        
        if (response.ok) {
          // Remove from offline storage
          await removeOfflineData('appointments', appointment.id);
        }
      } catch (error) {
        console.error('Failed to sync appointment:', error);
      }
    }
  } catch (error) {
    console.error('Appointment sync failed:', error);
  }
}

async function syncPrescriptions() {
  console.log('Service Worker: Syncing prescriptions...');
  // Similar implementation for prescriptions
}

async function syncHealthData() {
  console.log('Service Worker: Syncing health data...');
  // Similar implementation for health data
}

// IndexedDB helpers for offline storage
async function getOfflineData(store) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('HealthcareOfflineDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const getRequest = objectStore.getAll();
      
      getRequest.onerror = () => reject(getRequest.error);
      getRequest.onsuccess = () => resolve(getRequest.result);
    };
  });
}

async function removeOfflineData(store, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('HealthcareOfflineDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const deleteRequest = objectStore.delete(id);
      
      deleteRequest.onerror = () => reject(deleteRequest.error);
      deleteRequest.onsuccess = () => resolve();
    };
  });
}

// Message handler for communication with main app
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATED') {
    // Notify clients about cache update
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'CACHE_UPDATED',
          payload: event.data.payload
        });
      });
    });
  }
});

// Cleanup old dynamic cache entries
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEANUP_CACHE') {
    caches.open(DYNAMIC_CACHE)
      .then((cache) => {
        return cache.keys();
      })
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            // Keep only recent entries (last 7 days)
            const cacheAge = Date.now() - new Date(key.url).getTime();
            if (cacheAge > 7 * 24 * 60 * 60 * 1000) {
              return caches.delete(key);
            }
          })
        );
      });
  }
});

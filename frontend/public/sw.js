/**
 * Bridge AI+BCI Platform - Service Worker
 * PWA functionality with intelligent caching, offline support, and push notifications
 */

const CACHE_NAME = 'bridge-v1.2.0';
const API_CACHE_NAME = 'bridge-api-v1.0.0';
const NEURAL_DATA_CACHE = 'bridge-neural-v1.0.0';

// Resources to cache immediately on install
const STATIC_CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/demo.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
];

// API endpoints that should be cached
const API_CACHE_PATTERNS = [
  /\/api\/auth\/profile/,
  /\/api\/users\/dashboard-stats/,
  /\/api\/subscription\/plans/,
  /\/api\/bci\/baseline/
];

// Neural data that should be cached longer
const NEURAL_DATA_PATTERNS = [
  /\/api\/bci\/scenarios/,
  /\/api\/training\/templates/,
  /\/api\/neural\/models/
];

/**
 * Service Worker Installation
 */
self.addEventListener('install', (event) => {
  console.log('🔧 Bridge Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(CACHE_NAME).then((cache) => {
        console.log('📦 Caching static resources');
        return cache.addAll(STATIC_CACHE_URLS);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

/**
 * Service Worker Activation
 */
self.addEventListener('activate', (event) => {
  console.log('✅ Bridge Service Worker: Activated');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      cleanupOldCaches(),
      
      // Claim all clients immediately
      self.clients.claim(),
      
      // Set up background sync
      setupBackgroundSync()
    ])
  );
});

/**
 * Fetch Event Handler - Intelligent Caching Strategy
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle different types of requests with appropriate strategies
  if (isStaticResource(request)) {
    event.respondWith(handleStaticResource(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isNeuralDataRequest(request)) {
    event.respondWith(handleNeuralDataRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleGenericRequest(request));
  }
});

/**
 * Background Sync for Neural Data
 */
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'neural-data-sync') {
    event.waitUntil(syncNeuralData());
  } else if (event.tag === 'training-results-sync') {
    event.waitUntil(syncTrainingResults());
  } else if (event.tag === 'user-preferences-sync') {
    event.waitUntil(syncUserPreferences());
  }
});

/**
 * Push Notification Handler
 */
self.addEventListener('push', (event) => {
  console.log('🔔 Push notification received');
  
  if (!event.data) {
    return;
  }
  
  let notificationData;
  try {
    notificationData = event.data.json();
  } catch (error) {
    notificationData = {
      title: 'Bridge Notification',
      body: event.data.text() || 'You have a new notification',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png'
    };
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon || '/icons/icon-192x192.png',
      badge: notificationData.badge || '/icons/badge-72x72.png',
      data: notificationData.data || {},
      actions: notificationData.actions || [],
      requireInteraction: notificationData.requireInteraction || false,
      silent: notificationData.silent || false,
      vibrate: notificationData.vibrate || [200, 100, 200],
      tag: notificationData.tag || 'bridge-notification'
    })
  );
});

/**
 * Notification Click Handler
 */
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  // Handle notification actions
  if (event.action) {
    handleNotificationAction(event.action, event.notification.data);
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise, open a new window
        if (clients.openWindow) {
          const targetUrl = event.notification.data?.url || '/dashboard';
          return clients.openWindow(targetUrl);
        }
      })
    );
  }
});

/**
 * Message Handler - Communication with main app
 */
self.addEventListener('message', (event) => {
  console.log('💬 Message received:', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
        
      case 'CACHE_NEURAL_DATA':
        cacheNeuralData(event.data.data);
        break;
        
      case 'CLEAR_CACHE':
        clearAllCaches();
        break;
        
      case 'GET_CACHE_STATUS':
        getCacheStatus().then(status => {
          event.ports[0].postMessage(status);
        });
        break;
    }
  }
});

// ====== HELPER FUNCTIONS ======

/**
 * Check if request is for static resources
 */
function isStaticResource(request) {
  const url = new URL(request.url);
  return (
    url.pathname.startsWith('/static/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico')
  );
}

/**
 * Check if request is for API
 */
function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') && 
         API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

/**
 * Check if request is for neural data
 */
function isNeuralDataRequest(request) {
  const url = new URL(request.url);
  return NEURAL_DATA_PATTERNS.some(pattern => pattern.test(url.pathname));
}

/**
 * Check if request is navigation
 */
function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

/**
 * Handle static resources with cache-first strategy
 */
async function handleStaticResource(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Return cached version and update in background
      updateCacheInBackground(request, cache);
      return cachedResponse;
    }
    
    // If not cached, fetch and cache
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Static resource fetch failed:', error);
    return new Response('Resource unavailable offline', { status: 503 });
  }
}

/**
 * Handle API requests with network-first strategy
 */
async function handleAPIRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);
    
    if (response.status === 200) {
      // Cache successful responses
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Fallback to cache
    console.log('API network failed, trying cache:', request.url);
    const cache = await caches.open(API_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Network unavailable',
        offline: true
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Handle neural data with cache-first strategy (longer TTL)
 */
async function handleNeuralDataRequest(request) {
  try {
    const cache = await caches.open(NEURAL_DATA_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Check if cached response is still fresh (24 hours)
    if (cachedResponse) {
      const cacheDate = new Date(cachedResponse.headers.get('sw-cache-date') || 0);
      const isStale = Date.now() - cacheDate.getTime() > 24 * 60 * 60 * 1000;
      
      if (!isStale) {
        return cachedResponse;
      }
    }
    
    // Fetch fresh data
    const response = await fetch(request);
    if (response.status === 200) {
      const responseToCache = response.clone();
      responseToCache.headers.append('sw-cache-date', new Date().toISOString());
      cache.put(request, responseToCache);
    }
    
    return response;
  } catch (error) {
    console.error('Neural data fetch failed:', error);
    
    // Try to return stale cache if available
    const cache = await caches.open(NEURAL_DATA_CACHE);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Neural data unavailable offline', { status: 503 });
  }
}

/**
 * Handle navigation requests
 */
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    // Return cached index.html for offline navigation
    const cache = await caches.open(CACHE_NAME);
    const cachedIndex = await cache.match('/');
    return cachedIndex || await cache.match('/offline.html');
  }
}

/**
 * Handle generic requests
 */
async function handleGenericRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return new Response('Resource unavailable offline', { status: 503 });
  }
}

/**
 * Update cache in background
 */
async function updateCacheInBackground(request, cache) {
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response);
    }
  } catch (error) {
    console.log('Background cache update failed:', error);
  }
}

/**
 * Clean up old caches
 */
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const validCaches = [CACHE_NAME, API_CACHE_NAME, NEURAL_DATA_CACHE];
  
  return Promise.all(
    cacheNames
      .filter(cacheName => !validCaches.includes(cacheName))
      .map(cacheName => {
        console.log('🗑️ Deleting old cache:', cacheName);
        return caches.delete(cacheName);
      })
  );
}

/**
 * Setup background sync
 */
async function setupBackgroundSync() {
  // Register background sync for neural data
  if ('sync' in self.registration) {
    console.log('🔄 Background sync supported');
  }
}

/**
 * Sync neural data in background
 */
async function syncNeuralData() {
  console.log('🧠 Syncing neural data...');
  
  try {
    // Get pending neural data from IndexedDB
    const pendingData = await getPendingNeuralData();
    
    for (const data of pendingData) {
      try {
        const response = await fetch('/api/neural/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          await removePendingNeuralData(data.id);
        }
      } catch (error) {
        console.error('Failed to sync neural data:', error);
      }
    }
  } catch (error) {
    console.error('Neural data sync failed:', error);
  }
}

/**
 * Sync training results
 */
async function syncTrainingResults() {
  console.log('📊 Syncing training results...');
  // Implementation for syncing training results
}

/**
 * Sync user preferences
 */
async function syncUserPreferences() {
  console.log('⚙️ Syncing user preferences...');
  // Implementation for syncing user preferences
}

/**
 * Handle notification actions
 */
function handleNotificationAction(action, data) {
  switch (action) {
    case 'start-training':
      clients.openWindow('/training');
      break;
    case 'view-progress':
      clients.openWindow('/dashboard');
      break;
    case 'dismiss':
      // Just close the notification
      break;
    default:
      clients.openWindow('/');
  }
}

/**
 * Cache neural data
 */
async function cacheNeuralData(data) {
  try {
    const cache = await caches.open(NEURAL_DATA_CACHE);
    const response = new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'sw-cache-date': new Date().toISOString()
      }
    });
    
    await cache.put(`/neural-data/${data.id}`, response);
  } catch (error) {
    console.error('Failed to cache neural data:', error);
  }
}

/**
 * Clear all caches
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(cacheNames.map(name => caches.delete(name)));
}

/**
 * Get cache status
 */
async function getCacheStatus() {
  try {
    const cacheNames = await caches.keys();
    const status = {};
    
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      status[name] = keys.length;
    }
    
    return {
      caches: status,
      totalCaches: cacheNames.length,
      serviceWorkerVersion: CACHE_NAME
    };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * IndexedDB helpers for offline data storage
 */
async function getPendingNeuralData() {
  // Implementation would use IndexedDB to store/retrieve pending data
  return [];
}

async function removePendingNeuralData(id) {
  // Implementation would remove data from IndexedDB
}

// Global error handler
self.addEventListener('error', (event) => {
  console.error('🚨 Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Service Worker unhandled rejection:', event.reason);
});

console.log('🧠 Bridge Service Worker loaded successfully');

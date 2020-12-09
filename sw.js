// use a cacheName for cache versioning
var cacheName = 'v1';

// during the install phase you usually want to cache static assets
self.addEventListener('install', function(e) { 
    console.log("install");
    // once the SW is installed, go ahead and fetch the resources to make this work offline
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll([
                './',
                './img/icon-192x192.jpg',
                './img/icon-512x512.jpg',
                './pwa.js'
            ]).then(function() {
                self.skipWaiting();
            });
        })
    );
});

// when the browser fetches a url
self.addEventListener('fetch', function(event) {
    console.log("fetch");
    // either respond with the cached object or go ahead and fetch the actual url
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                // retrieve from cache
                return response;
            }
            // fetch as normal
            return fetch(event.request);
        })
    );
});
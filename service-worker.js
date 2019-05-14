const cacheName = "C1";

this.addEventListener('install', async function() {
    const cache = await caches.open(cacheName);
    cache.addAll([
        '/index.html',
        '/manifest.json',
        '/scripts.js',
        '/styles.css',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        '/icons/baseline_credit_card_black_48dp.png',
        'icons/baseline_credit_card_black_48.png',
        'icons/baseline_credit_card_black_96.png',
        'icons/baseline_credit_card_black_192.png',
        'icons/baseline_credit_card_black_256.png',
        'icons/baseline_credit_card_black_512.png',
        'https://code.jquery.com/jquery-3.3.1.slim.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js'
    ]);
});

self.addEventListener('fetch', function(event) { 
    event.respondWith(
    	caches.match(event.request).then(function(response) {
        	return response || fetch(event.request);
      	})
    );
});
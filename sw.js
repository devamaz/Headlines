importScripts('public/js/idb.js');
importScripts('public/js/util.js');

let CACHE_STATIC_NAME = 'static-v8';
let CACHE_DYNAMIC_NAME = 'dynamic-v2';
let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API}`;; 



self.addEventListener('install', (event) => {
    console.log('[Service worker] Installing service install', event);
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
        .then((cache) => {
            console.log('[Service worker] Precacheing Add file');
            cache.addAll([
                '/',
                '/index.html',
                '/offline.html',
                'public/style/main.css',
                'public/js/fetch.js',
                'public/js/promise.js',
                'public/js/app.js',
                'public/js/idb.js',
                'public/js/util.js',
                'public/js/main.js',
                'public/js/app.js',
            ]);


        })
    )
})

self.addEventListener('activate', (event) => {
    console.log('[Service worker] Activating service install', event);
    event.waitUntil(
        caches.keys()
        .then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                    return caches.delete(key)
                }
            }));
        })
    )
    return self.clients.claim();
})

self.addEventListener('fetch', (event) => {


    if (event.request.url.indexOf(url) > -1) {

        // cache, then network strategy
        event.respondWith(
            fetch(event.request)
            .then((res) => {
                let cloneRes = res.clone();
                clearData('news')
                    .then(function () {
                        return cloneRes.json();
                    })
                    .then((data) => {
                        data.articles.forEach(element => {
                            const {
                                author,
                                title,
                                description,
                                source: {
                                    name
                                },
                                url,
                                urlToImage,
                                publishedAt
                            } = element;

                            storeData('news', element)
                        })
                    });
                return res;
            })
        );
    } else {
        //cache, falling back to network strategy
        event.respondWith(
            caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                } else {
                    return fetch(event.request)
                        .then((res) => {
                            return caches.open(CACHE_DYNAMIC_NAME)
                                .then((cache) => {
                                    cache.put(event.request.url, res.clone());
                                    return res;
                                })
                        })
                        .catch((err) => {
                            return caches.open(CACHE_STATIC_NAME)
                                .then(function (cache) {
                                    if (event.request.headers.get('accept').includes('text/html')) {
                                        return cache.match('/offline.html');
                                    }
                                });
                        })
                }
            })
        );
    }

})
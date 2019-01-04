importScripts('js/libs/sw-utils.js');

const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    '/index.html',
    '/index.html',
    '/img/avatars/hulk.jpg',
    '/img/avatars/ironman.jpg',
    '/img/avatars/spiderman.jpg',
    '/img/avatars/thor.jpg',
    '/img/avatars/wolverine.jpg',
    '/css/style.css',
    '/js/libs/sw-utils.js',
    '/js/app.js'
]

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
]


self.addEventListener('install', evento => {
    const cacheStatic = caches.open( DYNAMIC_CACHE )
                        .then( cache => {
                            cache.addAll( APP_SHELL );
                        });
    const cacheInmutable = caches.open( INMUTABLE_CACHE )
                        .then( cache => {
                            cache.addAll( APP_SHELL_INMUTABLE );
                        });
    
    evento.waitUntil( Promise.all( [cacheStatic, cacheInmutable] ) );
});

self.addEventListener('activate', evento => {
    caches.keys()
        .then( keys => {
            keys.forEach( key => {
                if ( 
                    ( key !== STATIC_CACHE && key.includes('static-') ) ||
                    ( key !== DYNAMIC_CACHE && key.includes('dynamic-') ) ||
                    ( key !== INMUTABLE_CACHE && key.includes('inmutable-') ) ){
                    caches.delete( key )
                        .then( res => console.log('Cache ', key, ' eliminada con exito.') )
                }
            });
        });
});

self.addEventListener('fetch', evento => {
    const respuesta = caches.match( evento.request )
        .then( resp => {
            if( resp ){
                return resp;
            } else {
                return fetch( evento.request )
                            .then( newResp => {
                                return actualizaCacheDinamico( DYNAMIC_CACHE, evento.request, newResp );
                            });
            }
        });

    evento.respondWith( respuesta );
});
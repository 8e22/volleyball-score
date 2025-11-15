// Service Worker (sw.js)

// キャッシュの名前（v1, v2... と変更することで、アプリの更新を制御できます）
const CACHE_NAME = 'volleyball-scorer-v1';

// キャッシュするファイル（アプリ本体のHTMLファイル）
// もし index.html ではなく scorer.html などの名前にしている場合は、
// 以下の '/' を 'scorer.html' などに変更してください。
const URLS_TO_CACHE = [
  '/' 
];

// 1. インストール（初回起動時）の処理
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        // URLS_TO_CACHE に指定されたファイルをキャッシュする
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// 2. アクティベート（古いキャッシュの削除）の処理
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // CACHE_NAME と名前が違うキャッシュ (古いv1, v2など) を削除する
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// 3. フェッチ（通信）の処理
self.addEventListener('fetch', event => {
  event.respondWith(
    // まずネットワーク（インターネット）に接続しにいく
    fetch(event.request)
      .catch(() => {
        // ★もしネットワークが失敗（オフライン）したら、キャッシュから探して返す
        return caches.match(event.request);
      })
  );
});
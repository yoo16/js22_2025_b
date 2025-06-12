const defaultLat = 35.6812;
const defaultLng = 139.7671;
const zoom = 13;
// TODO: 初期位置を設定：例（東京駅）
let place = '東京駅';

// 地図初期化
const map = L.map('map').setView([defaultLat, defaultLng], zoom);

// OSMタイル読み込み
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

// 初期マーカー
let marker = L.marker([defaultLat, defaultLng]).addTo(map)
    .bindPopup(place)
    .openPopup();

// 🔍 地名検索ボタン処理
document.getElementById('searchBtn').addEventListener('click', async () => {
    // 検索ボックスのテキストを取得
    const query = document.getElementById('placeInput').value.trim();
    if (!query) return;

    // TODO: OSM Nominatim APIのURL
    // https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    try {
        // APIリクエスト
        // Accept-Languageヘッダーを設定して日本語での応答を要求
        const res = await fetch(url, {
            headers: { 'Accept-Language': 'ja' }
        });
        // JSON形式でレスポンスを取得
        const data = await res.json();

        if (data.length === 0) {
            alert('見つかりませんでした');
            return;
        }

        // TODO: 緯度・経度・表示名を取得
        console.log(data)
        const { lat, lon, display_name } = data[0];
        // const lat = data[0]['lat'];
        // const lon = data[0]['lon'];
        // const display_name = data[0]['display_name'];

        // 地図移動
        map.setView([lat, lon], zoom);
        // 既存マーカー削除
        if (marker) map.removeLayer(marker);
        // 新マーカー追加
        marker = L.marker([lat, lon]).addTo(map).bindPopup(display_name).openPopup();

    } catch (err) {
        console.error(err);
        alert('エラーが発生しました');
    }
});

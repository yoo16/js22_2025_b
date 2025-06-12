// TODO: 緯度・経度の設定
const lat = 35.6812; // 東京駅の緯度: 35.6812
const lng = 139.7671; // 東京駅の経度: 139.7671
// Leafletの地図を初期化: id="map" の要素を使用
// setView() で初期表示位置とズームレベルを設定
const map = L.map("map").setView([lat, lng], 12);

// Leafletのタイルレイヤーを追加
L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", {
    attribution: "地理院タイル",
    maxZoom: 18,
    minZoom: 5,
}).addTo(map);

let allMarkers = [];

// カテゴリ
const categories = {
    sushi: { label: "寿司", color: "blue" },
    ramen: { label: "ラーメン", color: "red" },
    cafe: { label: "カフェ", color: "green" },
    yakiniku: { label: "焼肉", color: "orange" }
};

// アイコンを取得
function getIcon(categoryId) {
    const color = categories[categoryId]?.color || "gray";
    const iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`;

    // Leafletのアイコンオブジェクトを作成
    return L.icon({
        iconUrl: iconUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
}

// カテゴリ選択肢を追加
function populateCategoryOptions() {
    const select = document.getElementById("categorySelect");
    Object.entries(categories).forEach(([id, info]) => {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = info.label;
        select.appendChild(opt);
    });
}

// ロケーションデータを読み込み、マーカーを表示
async function loadLocations() {
    const uri = "./api/locations.json";
    const res = await fetch(uri);
    const locations = await res.json();
    renderMarkers(locations);
    populateCategoryOptions();

    document.getElementById("categorySelect").addEventListener("change", (e) => {
        const selected = e.target.value;
        const filtered = selected === "all"
            ? locations
            : locations.filter(loc => loc.category === selected);
        renderMarkers(filtered);
    });
}

// マーカーを表示
function renderMarkers(locations) {
    allMarkers.forEach(marker => marker.remove());
    allMarkers = [];

    locations.forEach(loc => {
        const icon = getIcon(loc.category);
        const categoryLabel = categories[loc.category]?.label || loc.category;
        const name = loc.name || "未設定";
        const review = loc.review || "レビューはありません";
        const link = loc.link || "#";
        // TODO: データバインディング
        const popupContent = `
            <div class="text-center">
                <strong>${name}</strong>
                <span class="text-xs text-gray-700">${categoryLabel}</span>
            </div>
            <p class="text-sm mt-1">${review}</p>
            <a href="${link}" target="_blank" class="text-blue-500 underline text-sm mt-2 inline-block">詳細</a>
        `;

        // TODO: マーカー追加
        const marker = L.marker([loc.lat, loc.lng], { icon })
            .addTo(map)
            .bindPopup(popupContent);
        allMarkers.push(marker);
    });
}

loadLocations();

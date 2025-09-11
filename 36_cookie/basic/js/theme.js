// Cookie名
const THEME_KEY = "theme";
// テーマ状態: light/dark
let theme = null;
// html要素
const root = document.documentElement;
// ラベル要素
const label = document.getElementById("themeLabel");
const icon = document.getElementById("themeIcon");

// テーマ適用
function applyTheme(value) {
    // theme 設定
    theme = value;
    console.log("テーマ:", theme);

    // TODO: html要素(rootオブジェクト）に dark クラスをトグル設定

    // ラベル、アイコン更新
    if (label) label.textContent = theme === "dark" ? "ダーク" : "ライト";
    if (icon) icon.textContent = theme === "dark" ? "🌙" : "🌞";

    // TODO: Cookieに保存: THEME_KEY, theme

    // ボタンを更新: UI上だけでなくアクセシビリティ的にも明示するための属性
    document.getElementById("themeBtn")?.setAttribute("aria-pressed", String(theme === "dark"));

    // Cookie一覧表示
    showCookies();
}

// テーマ切り替え
function toggleTheme() {
    // TODO: 現在の状態を反転: theme = dark / light
    const next = "";
    // Themeを適用
    applyTheme(next);
}

// テーマ読み込み
function loadTheme() {
    // Cookieの値を取得
    const saved = getCookie(THEME_KEY);
    // light/dark ならそのまま返す
    if (saved === "light" || saved === "dark") return saved;
    // OSの設定に合わせる
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// 初期化
window.addEventListener("DOMContentLoaded", () => {
    // テーマ読み込み
    const init = loadTheme();
    // テーマ適用
    applyTheme(init);
    // テーマ切り替えイベント
    document.getElementById("themeBtn")?.addEventListener("click", toggleTheme);

    // TODO: OS やブラウザのダークモード設定が切り替わった時に、サイトのテーマも自動で切り替える処理
    if (window.matchMedia) {
        const media = matchMedia("(prefers-color-scheme: dark)");
        media.addEventListener("change", (e) => {
            // Cookieに保存されていない場合のみ反映
            console.log("OSのテーマ変更:", e.matches);
            if (!getCookie(THEME_KEY)) {
                // TODO: e.matches の値に応じて applyTheme を呼び出し
                
            }
        });
    }
});
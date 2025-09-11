// Cookieのキー: ユーザー名
const KEY = "account_name";

// 初期表示
showCookies();

document.getElementById("testBtn").addEventListener("click", () => {
    // TODO: cookie 保存: document.cookie = "キー=値"
});

// Cookie一覧表示
function showCookies() {
    // Cookie全体表示
    document.getElementById("cookies").textContent = document.cookie || "(なし)";
    // account_name表示
    document.getElementById("account_name").value = getCookie(KEY);
}

// UI切り替え
document.getElementById("mode").addEventListener("change", (e) => {
    const mode = e.target.value;
    // 有効期限
    document.getElementById("expiresField").classList.toggle("hidden", mode !== "expires");
    // 最大有効期間
    document.getElementById("maxAgeField").classList.toggle("hidden", mode !== "max-age");
});


// 保存ボタン
document.getElementById("saveBtn").addEventListener("click", () => {
    const mode = document.getElementById("mode").value;
    // 有効期限、最大有効期間 取得
    const expires = document.getElementById("expires").value;
    const maxAge = document.getElementById("maxAge").value;

    // account_name 取得
    const value = document.getElementById("account_name").value;
    // Cookie保存
    setCookie(KEY, value, mode, expires, maxAge);
    // 表示更新
    showCookies();
});

// 削除ボタン
document.getElementById("deleteBtn").addEventListener("click", () => {
    // Cookie削除
    deleteCookie(KEY);
    // 表示更新
    showCookies();
});

// 全削除
document.getElementById("deleteAllBtn").addEventListener("click", () => {
    if (!confirm("すべてのCookieを削除しますか？")) {
        return;
    }
    // Cookie削除
    deleteAllCookies();
    // 表示更新
    showCookies();
});
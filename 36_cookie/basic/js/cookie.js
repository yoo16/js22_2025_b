function showCookies(id="cookies") {
    // Cookie全体表示
    document.getElementById(id).textContent = document.cookie || "(なし)";
}

// Cookieを保存
function setCookie(key, value, mode, expires, maxAge) {
    // 基本情報の設定
    let cookieStr = `${key}=${value}; path=/; SameSite=Lax`;

    // 有効期限の設定
    if (mode === "expires" && expires) {
        const date = new Date(expires);
        const dateString = date.toUTCString();
        // TODO: expires を cookieStr に連結 ※「;」で区切る
        datateString += `; expires=${dateString}`;
    }
    // max-ageの設定
    if (mode === "max-age" && maxAge) {
        // TODO: max-age  を cookieStr に連結 ※「;」で区切る
        dateString += `; max-age=${maxAge}`;
    }

    // TODO: Cookieの設定: document.cookie 
    document.cookie = cookieStr;
    // コンソールに表示
    console.log(document.cookie);
}

// Cookieを取得
function getCookie(key) {
    // Cookie全体を分割して検索
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        // "name=value" の形式に分割
        const [_key, value] = cookie.split("=");
        if (_key === key) {
            // 見つかった場合はデコードして返す
            return decodeURIComponent(value);
        }
    }
    return null;
}

// Cookieを削除
function deleteCookie(key) {
    // TODO: 有効期限を過去に設定して削除（path=/ を必ず指定）
    // document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// Cookieを削除
function deleteAllCookies() {
    // Cookieをすべて取得：「;」で分割
    const cookies = document.cookie.split("; ");

    // 繰り返し処理
    for (const cookie of cookies) {
        const equalIndex = cookie.indexOf("=");
        // Cookie名を取得
        const key = equalIndex > -1 ? cookie.substring(0, equalIndex) : cookie;
        // 各Cookieを削除
        deleteCookie(key);
    }
}
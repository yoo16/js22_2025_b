(() => {
    let csrfToken = null;
    const $ = (sel) => document.querySelector(sel);
    const out = (v) => { $("#out").textContent = JSON.stringify(v, null, 2); };

    // 初期化
    initCsrf();

    async function initCsrf() {
        // api/csrf.php からCSRFトークンを取得
        const res = await fetch("./api/csrf.php", {
            // TODO: セッションCookie必須
            // credentials: "include"
        });
        const data = await res.json();
        // CSRFトークンを保存
        csrfToken = data.csrf_token;
    }

    async function postJSON(url, body) {
        const res = await fetch(url, {
            method: "POST",
            // CSRFトークンをヘッダーにセット
            headers: {
                "Content-Type": "application/json",
                ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {})
            },
            credentials: "include",
            body: JSON.stringify(body),
        });
        let data = await res.json();
        if (!res.ok) throw { status: res.status, data };
        return data;
    }

    async function getJSON(url) {
        const res = await fetch(url, {
            // CSRFトークンをヘッダーにセット
            credentials: "include",
            headers: csrfToken ? { "X-CSRF-Token": csrfToken } : {}
        });
        const data = await res.json();
        return data;
    }

    window.addEventListener("DOMContentLoaded", () => {
        $("#login").addEventListener("click", async () => {
            const email = $("#email").value;
            const password = $("#password").value;
            // api/login.php へPOST
            const data = await postJSON("./api/login.php", { email, password });
            // CSRFトークンを更新
            csrfToken = data.csrf_token || null;
            out(data);
        });

        $("#me").addEventListener("click", async () => {
            const data = await getJSON("./api/me.php");
            out(data);
        });

        $("#logout").addEventListener("click", async () => {
            const data = await postJSON("./api/logout.php", {});
            out(data);
        });
    });
})();
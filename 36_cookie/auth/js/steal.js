(() => {
    const $ = (sel) => document.querySelector(sel);

    window.addEventListener("DOMContentLoaded", () => {
        // XSS攻撃の例
        $("#draftBtn").addEventListener("click", () => {
            const content = $("#content").value;
            // 危険!!!HTMLとして挿入
            $("#out").innerHTML = content;
        });

        $("#rewrite").addEventListener("click", () => {
            document.cookie = "sid=xxxxxx; path=/";
            // Cookieを書き換え
            $("#out").innerHTML = document.cookie;
        });
    });
})();
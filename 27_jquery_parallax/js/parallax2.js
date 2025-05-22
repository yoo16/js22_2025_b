
$(document).ready(function () {
    // エフェクト対象
    const targets = [
        { selector: "#section1 h2", callback: fadeIn },
        { selector: "#section2 img", callback: slideIn },
        { selector: "#section2 h2", callback: fadeIn },
        { selector: "#section3 h2", callback: fadeIn },
        { selector: "#section4", callback: slideLeft },
    ];

    // エフェクト対象の繰り返し
    $(window).on("scroll", function () {
        targets.forEach(({ selector, callback }) => {
            scrollAnimation(selector, callback);
        });
    });

    // スクロールアニメーション
    function scrollAnimation(selector, callback) {
        // ウィンドウ高さ
        const windowHeight = $(window).height();
        // スクロールオフセット
        const offset = windowHeight / 3;
        // TODO: スクロール位置取得: scrollTop()
        const scrollTop = 0
        // TODO: コンテンツ位置取得: offset().top
        const top = 0
        if (scrollTop + windowHeight > top + offset && $(selector).hasClass('invisible')) {
            // TODO: 表示処理：invisible クラス削除
            // TODO: エフェクト処理： targets で設定した callback関数の実行
        }
    }

    // フェードイン
    function fadeIn(selector) {
        // TODO: アニメーション
        // css: opacity: 0
        // animate: opacity: 1
    }

    // スライドイン
    function slideIn(selector) {
        // TODO: アニメーション
        // css: opacity: 0, width:  0
        // animate: opacity: 1, width: 100%
    }

    // スライド（レフト）
    function slideLeft(selector) {
        // 開始位置
        const start = $(window).width() * 0.5;
        // 終了位置
        const end = $(selector).position().left || 0;

        // TODO: アニメーション
        // css: position: relative, opacity: 0, left: start px
        // animate: opacity: 1, left: end px
    }

});
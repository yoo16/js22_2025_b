$(function () {
    //TODO: class=menu の a リンクでアンカーを含むもの
    // .menu a[href^="#"]
    const $menuLink = $('');

    // メニュー取得: class=menu
    const $navMenus = $(".menu");

    // ホバーでサブメニュー表示・非表示
    $navMenus.hover(
        function () {
            // TODO: 親メニューの子要素 ul を slideDown() アニメーション
            // TODO: アニメーションは一旦停止
        },
        function () {
            // TODO: 親メニューの子要素 ul を slideUp() アニメーション
            // TODO: アニメーションは一旦停止
        }
    );
    $navMenus.on('click', function () {
        // TODO: 親メニューの子要素 ul を slideUp() アニメーション
        // TODO: アニメーションは一旦停止
    });

    // スムーススクロール
    $menuLink.on('click', function (e) {
        // 今後の操作を止める
        e.preventDefault();

        // アンカーに設定された値を取得
        const anchor = this.getAttribute('href');
        if (anchor) {
            // TODO: アンカーのY座標取得: offset().top
            const targetOffset = 0;
            // TODO: アンカーにアニメーションでスクロール: scrollTop: targetOffset
            $('html, body').stop().animate({

            }, 500);
        }
    });
});
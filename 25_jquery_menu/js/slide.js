$(function () {
    const $menuButton = $('#menu-button');
    const $menuLink = $('#slide-menu a[href^="#"]');
    const $slideMenu = $('#slide-menu');
    const headerHeight = $('#header-menu').outerHeight() + 10;

    // クリックイベント
    $menuButton.on('click', function () {
        slideMenu();
    });

    // 初期化処理
    function initMenu() {
        // TODO: css指定：transform: 'translateX(-100%)'
        $slideMenu.css({ transform: 'translateX(-100%)' });
    }

    // スライド処理
    function slideMenu() {
        var x = '0px';
        // TODO: スライドメニューの class=on をトグル
        $slideMenu.toggleClass('on');
        if ($slideMenu.hasClass('on')) {
            // TODO: x をスライドメニューの幅で設定
            x = $slideMenu.width() + 'px';
        }
        // TODO: marginLeft に xを設定してアニメーション
        $slideMenu.animate({ marginLeft: x }, 300);
    }

    // スムーススクロール
    $menuLink.on('click', function (e) {
        e.preventDefault();
        slideMenu();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            const targetOffset = target.offset().top - headerHeight;
            $('html, body').stop().animate({
                scrollTop: targetOffset
            }, 500);
        }
    });

    initMenu();
});
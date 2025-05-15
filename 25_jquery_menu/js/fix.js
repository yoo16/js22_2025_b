$(function () {
    // スムーススクロール
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();

        const target = $($(this).attr('href'));

        if (target.length) {
            // nav の現在の position を取得
            const nav = $("#nav");
            const navHeight = nav.outerHeight();
            const isFixed = nav.css('position') === 'fixed';

            // fixed なら nav の高さを引く、static なら 96px 引く
            const offset = isFixed ? navHeight : 96;

            const position = target.offset().top - offset;

            $('html, body').animate({ scrollTop: position }, 500);
        }
    });


    // スクロール固定
    const nav = $("#nav");
    // TODO: nav の現在の top を取得
    const navPos = nav.offset().top;

    $(window).scroll(function () {
        // スクロール位置が nav の位置を超えたら
        if ($(window).scrollTop() > navPos) {
            // TODO: 固定 css設定：position: fixed
            $('#nav').css({ position: 'fixed'});
        } else {
            // TODO: 固定解除 css設定：position: static
            $('#nav').css({ position: 'static'});
        }
    });
});
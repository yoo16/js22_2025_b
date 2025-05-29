$(document).ready(function () {
    // オフセット調整値
    const slideOffset = 700;
    const scrollOffset = 800;

    //  catchコピー
    const $copy = $('#copy');
    let copyText = 'Welcome to Parallax World';
    const typingSpeed = 100;
    let typingIndex = 0;

    // 各種Element
    const fadeElements = $('.fade-in');
    const slideElements = $('.slide-in-y');
    const animationElements = $('.css-animation');
    const $menuLink = $('#nav a[href^="#"]');
    const headerHeight = $('#nav').outerHeight();

    // スクロール量とターゲットコンテンツの進行割合計算
    function getProgress(target, scrollY) {
        const elementTop = target.offset().top;
        const progress = Math.min(1, Math.max(0, (scrollY - elementTop + scrollOffset) / $(window).height()));
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;
        return progress;
    }

    function cssAnimation(target, scrollY) {
        const progress = getProgress(target, scrollY)
        if (progress > 0) {
            // TODO: target に class=is-active を追加
            // keyframes.css のアニメーションを有効化するために必要
            $(target).addClass('is-active');
        } else {
            // TODO: target に class=is-active を削除
            // keyframes.css のアニメーションを無効化するために必要
            $(target).removeClass('is-active');
        }
    }

    // フェードイン
    function fadeIn(target, scrollY) {
        // 0.2を引いて、少し遅らせる
        const progress = getProgress(target, scrollY) - 0.2;
        if (progress > 0 && progress <= 1) {
            // TODO: target に css{ opacity: progress } を追加
            $(target).css({ opacity: progress });
        }
    }

    // スライドイン
    function slideInX(target, scrollY) {
        var progress = getProgress(target, scrollY)
        progress *= 2;
        if (progress > 0) {
            var translateX = (1 - progress);
            if (translateX < 0) translateX = 0;
            target.css({
                opacity: progress,
                transform: `translateX(${translateX}px)`,
            });
        }
    }

    function slideInY(target, scrollY) {
        var progress = getProgress(target, scrollY + slideOffset);
        if (progress > 0) {
            var translateY = (1 - progress);
            if (translateY < 0) translateY = 0;
            target.css({
                opacity: progress,
                transform: `translateY(${translateY}px)`,
            });
        }
    }

    // タイプライター
    function typeWriter() {
        if (typingIndex < copyText.length) {
            const currentText = $copy.text();
            $copy.text(currentText + copyText[typingIndex]);
            typingIndex++;
            // TODO: setTimeout() で、typewriter() を呼び出す
            setTimeout(typeWriter, typingSpeed);
        }
    }


    // スクロールイベントハンドラ
    const handleScroll = () => {
        const scrollY = $(window).scrollTop();

        fadeElements.each(function () {
            fadeIn($(this), scrollY);
        });

        slideElements.each(function () {
            slideInY($(this), scrollY);
        });

        animationElements.each(function () {
            cssAnimation($(this), scrollY);
        });
    };

    // スムーススクロール
    $menuLink.on('click', function (e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            const targetOffset = target.offset().top - headerHeight;
            $('html, body').stop().animate({
                scrollTop: targetOffset
            }, 500);
        }
    });

    // スクロールイベントリスナー
    $(window).on('scroll', handleScroll);

    // 初期実行
    handleScroll();
    $copy.text('');
    $copy.addClass('invisible');
    setTimeout(() => {
        $copy.removeClass('invisible');
        typeWriter();
    }, 600);
});
// js/garally.js
$(function () {
    const base = 'images/character_';
    const size = 120;
    let $current = $();

    // ギャラリー作成
    createGallery(6);

    // 画像サイズ変更
    $('#resize-width').on('click', () => {
        if (!ensure()) return;
        // TODO: 選択の画像を find() で検索し、幅（width) を変更
        updateInfo($current.find('img'));   // 最新サイズを反映
    });

    // リセット
    $('#reset').on('click', () => {
        $('#gallery figure').removeClass('active')
            .find('img').each(function (i) {
                $(this).attr({
                    src: `${base}${i + 1}.png`,
                    alt: `character_${i + 1}`,
                    'data-index': i + 1
                }).width('');
            });

        $('#gallery figcaption').each((i, el) =>
            $(el).text(`character_${i + 1}`));

        $current = $();
        clearInfo();
    });

    /**
     * 画像ギャラリー生成
     * @param {number} number 画像枚数
     */
    function createGallery(number) {
        const $wrap = $('#gallery');
        const tpl = $('#img-item').html();
        const nums = [...Array(number).keys()].map(i => i + 1); // 1..number

        $.each(nums, (_, i) => {
            const $el = $(tpl);

            // 画像ファイル「character_x.png」
            // alt に画像名
            // data-index に連番
            const props = {
                src: `${base}${i}.png`,
                alt: `character_${i}`,
                'data-index': i
            };

            // ブラウザキャッシュクリア
            // Win：Ctrl + Shift + R
            // Mac: Cmd + Shift + R
            // TODO: img タグを取得し、attr() で propsを設定
            $el.find('img').attr(props);

            $el.find('figcaption').text(`character_${i}`);
            $wrap.append($el);
        });

        // クリックで選択
        $wrap.on('click', 'figure', function () {
            $current.removeClass('active');   // 旧選択を解除
            $current = $(this).addClass('active');
            updateInfo($current.find('img'));
        });
    }

    /**
     * 画像サイズ & 位置情報をテーブルへ表示
     * @param {jQuery} $img 選択画像
     */
    function updateInfo($img) {
        // TODO: 幅を取得 width()
        const w = $img.width();
        // TODO: 高さを取得
        const h = $img.height();
        // TODO: imgタグから最初に見つかった <figure> を closest() で取得し、ドキュメント左上 (0, 0) からの座標 offset() を計算
        const { top, left } = $img.closest('figure').offset();

        $('#info-width').text(w);
        $('#info-height').text(h);
        $('#info-top').text(Math.round(top));
        $('#info-left').text(Math.round(left));
    }

    /** 
     * 情報テーブルをクリア 
     */
    function clearInfo() {
        $('#info-table tbody td:last-child').text('–');
    }

    /** 
     * 選択チェック 
     */
    function ensure() {
        if (!$current.length) alert('まず画像をクリックして選択してください');
        return $current.length;
    }
});

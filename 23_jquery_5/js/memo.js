$(function () {
    var selected = $();

    const defaultClass = "bg-gray-100 rounded border border-gray-300 p-2 mb-2";
    const selectedClass = "selected bg-orange-200";
    const unselectedClass = "bg-gray-100";

    function newItem() {
        const value = getInputValue();
        //TODO: liタグを作成し、テキスト表示
        const li = $("<li>");
        li.text(value);
        //TODO: addClass() で defaultClass を追加
        li.addClass(defaultClass);
        return li;
    }

    function getInputValue() {
        return $('#input-text').val().trim() || 'New Item';
    }

    // 最後に追加ボタン
    $('#btn-append').on('click', function () {
        const element = newItem();
        // TODO: 親要素(id=item-list)の最後に追加(append)
        $('#item-list').append(element);

        $('#input-text').val('');
    });

    $('#btn-prepend').on('click', function () {
        const element = newItem();
        // TODO: 親要素(id=item-list)の最初に追加(prepend)
        $('#item-list').prepend(element);

        // TODO: テキストボックス(id=input-text)を空にする
        $('#input-text').val('');
    });

    $('#btn-before').on('click', function () {
        if (selected.length) {
            const element = newItem();
            // TODO: 選択中の要素の前に追加(before)
            selected.before(element);

            $('#input-text').val('');
        } else {
            alert('選択中の要素がありません。');
        }
    });

    $('#btn-after').on('click', function () {
        if (selected.length) {
            const element = newItem();
            // TODO: 選択中の要素の後に追加(after)
            selected.after(element);

            $('#input-text').val('');
        } else {
            alert('選択中の要素がありません。');
        }
    });

    $('#btn-remove').on('click', function () {
        if (selected.length) {
            // TODO: 選択中の要素を削除(remove)
            selected.remove();

            // 選択解除
            selected = $();
        } else {
            alert('選択中の要素がありません。');
        }
    });

    $('#item-list').on('click', 'li', function () {
        // li要素のクラスを初期化
        $('#item-list li').removeClass(selectedClass).addClass(unselectedClass);
        // 選択中の要素のクラスを変更
        $(this).addClass(selectedClass).removeClass(unselectedClass);
        // TODO: 選択
        selected = $(this);
        console.log(selected);
    });
});
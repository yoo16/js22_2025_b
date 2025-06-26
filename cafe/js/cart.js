// カート用の配列
var cartItems = [];
// オーダー履歴用の配列
var orderHistory = [];

/**
 * updateCartCount
 * カートのアイテム数を更新
 */
function updateCartCount() {
    // id=cartCount のDOMを取得し、カートアイテムの個数をテキスト挿入
    document.getElementById('cartCount').innerText = cartItems.length;
}

/**
 * updateCartTotal
 * カートの合計金額を更新
 */
function updateCartTotal() {
    // カート商品を繰り返し、価格を足して合計金額を計算
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    // id=cartTotal のDOMを取得し、合計金額を挿入（小数点以下2桁にフォーマット）
    document.getElementById('cartTotal').innerText = total.toFixed(2);
}

/**
 * updateCheckoutButtonState
 * チェックアウトボタンの状態を更新
 */
const updateCheckoutButtonState = () => {
    // id=checkoutButton のDOMを取得
    const checkoutButton = document.getElementById('checkoutButton');
    if (cartItems.length > 0) {
        checkoutButton.disabled = false;  // アイテムがある場合はボタンを有効化
        checkoutButton.classList.remove('opacity-50');  // ボタンを通常の見た目に戻す
    } else {
        checkoutButton.disabled = true;  // アイテムがない場合はボタンを無効化
        checkoutButton.classList.add('opacity-50');  // ボタンを半透明にする
    }
};

/**
 * renderCartItems
 * カートアイテムの表示を更新
 */
function renderCartItems() {
    // id=cartItemsList のDOMを取得
    const cartItemsList = document.getElementById('cartItemsList');

    // リスト表示クリア
    cartItemsList.innerHTML = '';

    // カート商品の繰り返し処理
    cartItems.forEach((item, index) => {
        // liタグ作成
        const li = document.createElement('li');

        // class追加: mb-2 flex justify-between items-center
        li.classList.add('mb-2', 'flex', 'justify-between', 'items-center');

        // 商品名 - 価格（単位つき）
        li.innerHTML = `${item.name} - $${item.price.toFixed(2)}`;

        // 削除 buttonタグ作成
        const removeButton = document.createElement('button');

        // class追加: bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600
        removeButton.classList.add('bg-red-500', 'text-white', 'px-4', 'py-2', 'rounded', 'hover:bg-red-600');
        // ボタンラベル設定
        removeButton.innerText = 'Remove';
        // クリックイベント追加: addEventListner コールバック関数: removeItemFromCart
        removeButton.addEventListener('click', () => removeItemFromCart(index));

        // liタグに削除ボタン追加
        li.appendChild(removeButton);

        // cartItemsListに liタグ追加
        cartItemsList.appendChild(li);
    });
}

/**
 * renderCartItems
 * カートからアイテムを削除
 */
function removeItemFromCart(index) {
    // 指定したインデックスアイテムを１つ削除
    cartItems.splice(index, 1);
    // カート個数更新
    updateCartCount();
    // ボタン有効処理
    updateCheckoutButtonState();
    // カート表示
    renderCartItems();
    // カート金額更新
    updateCartTotal();
}

/**
 * addCart
 * カートアイテム追加
 */
const addCart = (index) => {
    // メニューアイテムデータからアイテムを取得
    const item = items[index];

    // アイテムをカートに追加
    cartItems.push(item);

    // カートを更新
    updateCartCount();
    // ボタン有効処理
    updateCheckoutButtonState();

    // メッセージ表示
    const message = `${item.name} has been added to the cart!`;
    showFlashMessage(message);
}

/**
 * showCart
 * カートモーダルウィンドウ表示
 */
const showCart = () => {
    // カート商品表示
    renderCartItems();
    // カート個数更新
    updateCartTotal();
    // buttonタグのclassから、hiddenを削除（表示状態）
    document.getElementById('cartModal').classList.remove('hidden');
}

/**
 * closeCart
 * カートモーダルウィンドウ非表示
 */
const closeCart = () => {
    // buttonタグのclassから、hiddenを追加（非表示状態）
    document.getElementById('cartModal').classList.add('hidden');
}

/**
 * checkout
 * チェックアウト
 */
const checkout = () => {
    if (cartItems.length > 0) {
        // カートの個数があれば
        // カートのコピーを作成して、order変数に代入
        const order = [...cartItems];
        // オーダー履歴に現在のカートの内容を追加
        orderHistory.push(order);

        // カートをクリア
        cartItems = [];

        // カートの個数更新
        updateCartCount();
        // ボタン有効処理
        updateCheckoutButtonState();

        // オーダーしましたメッセージ
        showFlashMessage('Thank you for your order!');

        // カートウィンドウを閉じる
        closeCart();
    } else {
        // カートがない時のメッセージ
        showFlashMessage('Your cart is empty!');
    }
}

/**
 * showOrderHistory
 * オーダー履歴表示
 */
const showOrderHistory = () => {
    const orderHistoryList = document.getElementById('orderHistoryList');
    orderHistoryList.innerHTML = '';

    // オーダー履歴があれば
    if (orderHistory.length > 0) {
        // オーダー履歴を繰り返し表示
        orderHistory.forEach((order, orderIndex) => {
            const orderList = document.createElement('div');
            orderList.classList.add('mb-4', 'p-4', 'border', 'rounded-lg', 'bg-gray-50');

            // オーダー商品リストを表示
            order.forEach(item => {
                const orderItem = document.createElement('div');
                orderItem.classList.add('mb-1');
                orderItem.innerText = `${item.name} - $${item.price.toFixed(2)}`;
                orderList.appendChild(orderItem);
            });

            // orderHistoryListにオーダーアイテムを追加
            orderHistoryList.appendChild(orderList);
        });
    } else {
        //オーダー履歴がなければ
        // メッセージ表示
        orderHistoryList.innerHTML = '<div>No orders placed yet.</div>';
    }

    // id=orderHistoryModal のDOMを取得し、class=hiddenを削除（表示）
    document.getElementById('orderHistoryModal').classList.remove('hidden');
};

/**
 * closeOrderHistory
 * オーダー履歴モーダルを閉じる
 */
const closeOrderHistory = () => {
    // id=orderHistoryModal のDOMを取得し、class=hiddenを追加（非表示）
    document.getElementById('orderHistoryModal').classList.add('hidden');
};

/**
 * showFlashMessage
 * フラッシュメッセージを表示
 * @param {*} message 
 */
const showFlashMessage = (message) => {
    // alert(message);

    // id=flashMessage のDOMを取得
    const flashMessageDiv = document.getElementById('flashMessage');
    // テキストを挿入
    flashMessageDiv.innerText = message;
    // メッセージを表示
    flashMessageDiv.classList.remove('hidden');
    // 3秒後にメッセージを隠す
    setTimeout(() => {
        flashMessageDiv.classList.add('hidden');
    }, 3000);
};
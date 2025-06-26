// メニューの商品データを配列として定義
const items = [
    {
        name: 'Cappuccino',
        price: 4.50,
        image: 'images/cappuccino.webp',
        description: 'A classic Italian coffee drink made with espresso and steamed milk.'
    },
    {
        name: 'Croissant',
        price: 3.00,
        image: 'images/croissant.webp',
        description: 'Flaky, buttery pastry that melts in your mouth.'
    },
    {
        name: 'Green Tea',
        price: 2.50,
        image: 'images/green-tea.webp',
        description: 'A calming and refreshing beverage with health benefits.'
    }
];

/**
 * createMenuList
 * 商品メニュー作成&表示
 */
function createMenuList() {
    // id=menuItems のDOMを取得
    const menuContainer = document.getElementById('menuItems');

    // メニューアイテムを動的に生成
    items.forEach((item, index) => {
        // divタグ作成
        const menuItem = document.createElement('div');
        // class追加
        menuItem.classList.add('bg-white', 'rounded-lg', 'shadow-lg', 'overflow-hidden');
        // divに、商品情報のHTML追加
        menuItem.innerHTML = createItemTemplate(item, index);
        // メニューコンテナにアイテムを追加
        menuContainer.appendChild(menuItem);
    });
}

/**
 * createItemTemplate
 * 商品情報HTML
 * @param {*} item 
 * @param number index 
 * @return string
 */
function createItemTemplate(item, index) {
    const template = `
    <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
    <div class="p-6">
        <h3 class="text-2xl font-bold text-gray-800 mb-2">${item.name}</h3>
        <p class="text-gray-600">${item.description}</p>
        <div class="mt-4 flex justify-between items-center">
            <span class="text-xl font-semibold text-gray-800">$${item.price.toFixed(2)}</span>
            <button class="addToCartButton bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                onclick="addCart(${index})">Add to Cart</button>
        </div>
    </div>
    `;
    return template;
}

// ページがロードされたときにメニューを表示
window.onload = createMenuList;
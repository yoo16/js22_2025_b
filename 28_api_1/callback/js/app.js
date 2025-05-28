document.addEventListener("DOMContentLoaded", function () {
    // データの配列
    const users = [
        { name: "Alice", age: 25, city: "LA" },
        { name: "Bob", age: 28, city: "CA" },
        { name: "John", age: 30, city: "NY" }
    ];

    const resultDiv = document.getElementById("result");

    // データを取得して結果を表示する関数
    function fetchDataWithDelay(data, delay, callback) {
        setTimeout(() => {
            // TODO: callback 関数実行（データも渡す）
        }, delay);
    }

    // レンダリング関数
    function renderItem(user) {
        const userCard = document.createElement('div');
        userCard.classList.add('p-4', 'bg-white', 'space-y-2', 'rounded', 'shadow', 'border');
        userCard.innerHTML = `
            <h3 class="text-lg font-bold">${user.name}</h3>
            <div class="text-gray-600">
                <label class="bg-teal-500 text-sm text-white py-1 px-2 rounded">Age</label>
                <span>${user.age}</span>
            </div>
            <div class="text-gray-600">
                <label class="bg-teal-500 text-sm text-white py-1 px-2 rounded">City</label>
                <span>${user.city}</span>
            </div>
        `;
        resultDiv.appendChild(userCard);
    }

    // データを非同期に追加表示
    users.forEach((item, index) => {
        fetchDataWithDelay(item, index * 1000, renderItem);
    });
});
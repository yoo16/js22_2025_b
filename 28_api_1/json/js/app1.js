// JSONデータ読み込み
var jsonString = document.getElementById('data').textContent;

// TODO: JSON（テキスト） -> JavaScriptデータ（オブジェクト）
var user = JSON.parse(jsonString);
console.log(user)
displayUser(user);

/**
 * ユーザ情報表示
 * @param {*} user 
 */
function displayUser(user) {
    document.getElementById('user-name').value = user.name || '';
    document.getElementById('user-email').value = user.email || '';
    document.getElementById('user-city').value = user.city || '';
}

function update() {
    user.name = document.getElementById('user-name').value;
    user.email = document.getElementById('user-email').value;
    user.city = document.getElementById('user-city').value;

    // TODO: オブジェクト -> JSON
    jsonString = JSON.stringify(user);
    console.log(jsonString)
    document.getElementById('json-user').textContent = jsonString;
}
const output = document.getElementById('output');
const text = 'こんにちは';
const todos = [
    { id: 1, text: '牛乳を買う', done: false },
    { id: 2, text: 'メール返信', done: true },
];

document.getElementById('save').addEventListener('click', () => {
    // TODO: Local Storage にキーを指定して保存
    localStorage.setItem('message', text);
    output.textContent = `保存:\n ${text}`;
});

document.getElementById('load').addEventListener('click', () => {
    // TODO: Local Storage からキーを指定して読み込み
    const text = "";
    output.textContent = `読み込み:\n ${text ? text : ''}`;
});

document.getElementById('remove').addEventListener('click', () => {
    // TODO: Local Storage からキーを指定して削除

    output.textContent = '削除しました。';
});

document.getElementById('saveList').addEventListener('click', () => {
    // JSONに変換
    const json = JSON.stringify(todos);

    // TODO: Local Storage にキーを指定して保存

    // オブジェクトをテキストに変換
    const text = todos.map(todo => `${todo.id}: ${todo.text} (${todo.done})`).join('\n');
    output.textContent = `保存:\n ${text}`;
});

document.getElementById('loadList').addEventListener('click', () => {
    // TODO: Local Storage からーを指定して取得

    // JSONをオブジェクトに変換
    const data = json ? JSON.parse(json) : [];

    // オブジェクトをテキストに変換
    const text = data.map(value => `${value.id}: ${value.text} (${value.done})`).join('\n');
    output.textContent = `読み込み:\n ${text}`;
});

document.getElementById('removeList').addEventListener('click', () => {
    // TODO: Local Storage からキーを指定して削除

    output.textContent = '削除しました。';
});
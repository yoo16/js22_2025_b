const result = document.getElementById('result');
const searchBtn = document.getElementById('searchBtn');
const pokemonNameInput = document.getElementById('pokemonName');
const listBtn = document.getElementById('listBtn');
const maxPokemonCount = 1010; // 最大ポケモン数
const displayPokemonCount = 6;  // 表示するポケモンの数

async function loadPokemon() {
    result.innerHTML = '読み込み中...';

    let html = '<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">';
    const usedIds = new Set();

    while (usedIds.size < displayPokemonCount) {
        const id = Math.floor(Math.random() * maxPokemonCount) + 1;
        if (usedIds.has(id)) continue;
        usedIds.add(id);

        try {
            // TODO: API URL: https://pokeapi.co/api/v2/pokemon/{id}
            const uri = ``;
            const res = await fetch(uri);
            if (!res.ok) continue;

            const data = await res.json();
            html += createPokemonCard(data, id);
        } catch (e) {
            html += `<p>ID ${id} の取得に失敗しました。</p>`;
        }
    }

    html += '</div>';
    result.innerHTML = html;
}

async function loadPokemonByName(name) {
    result.innerHTML = '検索中...';
    try {
        // TODO: API URL: https://pokeapi.co/api/v2/pokemon/{name}
        const uri = ``;
        const res = await fetch(uri);
        if (!res.ok) throw new Error('ポケモンが見つかりませんでした');

        const data = await res.json();
        result.innerHTML = `
            <div class="grid grid-cols-1 gap-4">
                ${createPokemonCard(data, data.id)}
            </div>
        `;
    } catch (e) {
        result.innerHTML = `<p class="text-red-500 text-center">ポケモンが見つかりませんでした。</p>`;
        console.error(e);
    }
}

function createPokemonCard(data, id) {
    const name = data.name;
    const types = data.types.map(t => t.type.name).join(', ');
    const height = data.height / 10;
    const weight = data.weight / 10;
    const image = data.sprites.front_default;
    const number = String(id).padStart(3, '0');

    return `
        <div class="bg-white rounded-lg shadow-md p-4 text-center">
            <p class="text-sm text-gray-500">No.</p>
            <img src="" alt="" class="mx-auto w-24 h-24 mb-2" />
            <p class="text-lg font-bold capitalize"></p>
            <p class="text-gray-600">タイプ: </p>
            <p class="text-gray-600 text-sm">
                高さ:  m 
                / 
                重さ:  kg
            </p>
        </div>
    `;
}

// 検索ボタンイベント
searchBtn.addEventListener('click', () => {
    const name = pokemonNameInput.value.trim().toLowerCase();
    if (name) {
        loadPokemonByName(name);
    } else {
        loadPokemon(); // 空欄ならランダム6匹を再表示
    }
});

listBtn.addEventListener('click', () => {
    pokemonNameInput.value = ''; // 入力欄をクリア
    loadPokemon(); // 一覧（ランダム6匹）表示
});

// 初期表示
loadPokemon();

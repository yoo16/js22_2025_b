const canvas = document.getElementById("faceCanvas");
const message = document.getElementById("message");

// 2Dコンテイスト作成
const ctx = canvas.getContext("2d");

// Canvasをウィンドウサイズに合わせる
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 顔文字の配列
let faces = [];

/**
 * 絵文字出現
 * 
 * @param {*} event 
 */
function spawnFace(event) {
    message.classList.add('hidden');

    // クリックした座標
    let x = event.clientX;
    let y = event.clientY;

    // TODO: ランダムスピード: (Math.random() - 0.5) * 8
    let speedX = (Math.random() - 0.5) * 8;
    let speedY = (Math.random() - 0.5) * 8;

    // 新しい顔文字作成
    faces.push(new Face(x, y, speedX, speedY));
}

/**
 * フレームアニメーション
 */
function animate() {
    // TODO: 現在のコンテキストの描画クリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 顔文字の移動（複数同時）
    faces.forEach(face => {
        face.move();
        face.draw();
    });
    // 衝突チェック
    checkCollisions();

    // フレームアニメーション
    requestAnimationFrame(animate);
}


/**
 * 衝突処理
 */
function checkCollisions() {
    for (let i in faces) {
        for (let j in faces) {
            // 数値に変換して、i が j より小さい場合のみ処理
            if (Number(i) >= Number(j)) continue;

            // 衝突対象の顔文字
            let face = faces[i];
            // その他の顔文字
            let otherFace = faces[j];
            // それぞれのベクトル＆距離計算
            let dx = face.x - otherFace.x;
            let dy = face.y - otherFace.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // 距離が40未満だったら
            if (distance < 40) {
                // Bounce effect: 速度を入れ替える
                let tempX = face.speedX;
                let tempY = face.speedY;
                // 対象のスピードを入れ替える
                face.speedX = otherFace.speedX;
                face.speedY = otherFace.speedY;
                // その他のスピードを入れ替える
                otherFace.speedX = tempX;
                otherFace.speedY = tempY;
            }
        }
    }
}

// クリックイベント
document.addEventListener("click", spawnFace);

// アニメーション
animate();
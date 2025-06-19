// Canvas とコンテキストの取得
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// キャンバスサイズ
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

// 複数のドットを格納する配列
const dots = [];
// ドットの数（必要に応じて調整可能）
const numDots = 200;
// 距離制限
const distanceLimit = 100;

/**
 * ドットの生成
 * @description
 *  numDots 個のドットを作成し、dots 配列に格納する
 */
function createDots() {
    for (let i = 0; i < numDots; i++) {
        const dot = new Dot();
        dots.push(dot);
    }
}

/**
 * アニメーションフレームの更新処理
 * @description
 *  - トレイル効果のための透明な黒塗り
 *  - 各ドットの更新
 *  - 各ドットの描画
 *  - ドット同士の線を描画
 *  - 次のフレームをリクエスト
 */
function animate() {
    // トレイル効果
    // TODO: (2) 各フレームで、完全に消去せずに半透明の黒で上書きする
    // fillStyle : rgba(0, 0, 0, 0.1)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, w, h);

    for (const dot of dots) {
        // TODO: (3) ドット座標更新 update() を実行
        dot.update();

        // TODO: (4) ドット描画 draw() を実行
        dot.draw();
    }

    // 各ドットの間の線を描画
    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            // 座標計算
            const deltaX = dots[i].x - dots[j].x;
            const deltaY = dots[i].y - dots[j].y;
            // 距離を計算
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // 距離がdistanceLimit未満なら線を描画
            if (distance < distanceLimit) {
                // 透明度を動的に設定
                // TODO: (1) ストロークを白色に変更: strokeStyle: rgba(255, 255, 255, 1 - distance / 100)
                const alpha = 1 - distance / 100;
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;

                // 太さを設定
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                // 線を描画
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.stroke();
            }
        }
    }

    // 次のフレームをリクエスト
    requestAnimationFrame(animate);
}

// リサイズイベント
window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});

// ドットの生成
createDots();
// アニメーション開始
animate();
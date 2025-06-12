// Canvas 要素を取得し、2D コンテキストを取得
const canvas = document.getElementById('myCanvas');
// 2D コンテキスト
const ctx = canvas.getContext('2d');
console.log(ctx)

/**
 * drawSquare()
 */
function drawSquare() {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'black';

    // 矩形を塗り  
    // x, y, width, height = 0, 0, 100, 50
    ctx.fillRect(0, 0, 100, 50);

    // 矩形をストローク 
    // x, y, width, height = 0, 0, 100, 100
    ctx.strokeRect(0, 0, 100, 100);
}


/**
 * drawTriangle()
 */
function drawTriangle() {
    // パス開始
    ctx.beginPath();
    // 三角形を描画
    // 座標移動: x, y = 150, 0
    ctx.moveTo(150, 0);
    // 線を引く: x, y = 250, 0
    ctx.lineTo(250, 0);
    // 線を引く: x, y = 200, 100
    ctx.lineTo(200, 100);
    // パス終了
    ctx.closePath();
    // 線を描画
    ctx.stroke();
}

/**
 * drawCircle()
 */
function drawCircle() {
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'green';
    ctx.beginPath();
    // 円を描画
    // arc(x, y, radius, startAngle, endAngle)
    ctx.arc(200, 200, 50, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

/**
 * drawTextOnCanvas();
 * @param {*} text
 * @param {*} x 
 * @param {*} y 
 * @param {*} font 
 * @param {*} color 
 */
function drawTextOnCanvas(text, x, y, font, color) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    // TODO: 文字を描画
    ctx.fillText(text, x, y)
}

// 描画
drawTriangle();
drawSquare();
drawCircle();

drawTextOnCanvas('この文字はCanvasを使って描画しています', 50, 300, '20px Arial', 'blue');
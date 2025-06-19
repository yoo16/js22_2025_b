
class Face {
    /**
     * コンストラクタ
     * @param {*} x 
     * @param {*} y 
     * @param {*} speedX 
     * @param {*} speedY 
     */
    constructor(x, y, speedX, speedY) {
        this.faceEmoji = ["😀", "😂", "😜", "😎", "🤪", "🥴", "🤯", "😵"];
        // 座標
        this.x = x;
        this.y = y;
        // スピード
        this.speedX = speedX;
        this.speedY = speedY;
        // ランダムな絵文字選択
        this.emoji = this.faceEmoji[Math.floor(Math.random() * this.faceEmoji.length)];
        this.radius = 20;
    }

    /**
     * 移動
     */
    move() {
        // 現在の位置
        this.x += this.speedX;
        this.y += this.speedY;
        // 枠外の場合は、ベクトルを反転
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    /**
     * 描画
     */
    draw() {
        ctx.font = "40px Arial";
        // 絵文字の描画
        ctx.fillText(this.emoji, this.x, this.y);
    }
}
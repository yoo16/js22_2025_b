// ドット（パーティクル）を表現するクラス
class Dot {

    /**
     * constructor
     * 
     * ドットの初期化
     * ランダムな初期位置、半径、速度、色を設定する。
     */
    constructor() {
        // キャンバス内のランダムな初期位置
        this.x = Math.random() * w;
        this.y = Math.random() * h;

        // 半径は 1～4px 程度
        this.radius = Math.random() * 3 + 1;

        // X, Y 方向の速度（-1～1）
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;

        // ランダムな色設定
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    /**
     * update
     * 
     * ドットの状態を更新
     * x, y を速度 vx, vy で更新し、キャンバスの端で跳ね返るようにする。
     */
    update() {
        this.x += this.vx;
        this.y += this.vy;

        // キャンバスの端で跳ね返る処理
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
    }

    /**
     * draw
     * 
     * ドットを描画
     * x, y を中心とした半径 radius の円を描画し、色を設定する。
     */
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
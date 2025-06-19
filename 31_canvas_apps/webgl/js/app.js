// canvas と WebGL コンテキストの取得
const canvas = document.getElementById('glcanvas');
const gl = canvas.getContext('webgl');
if (!gl) {
    alert("WebGL がサポートされていません。");
    throw new Error("WebGL not supported");
}

// 頂点シェーダー (変換行列 uModelViewMatrix を使用)
const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec4 aVertexColor;
      uniform mat4 uModelViewMatrix;
      varying lowp vec4 vColor;
      void main(void) {
        gl_Position = uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
      }
    `;

// フラグメントシェーダー
const fsSource = `
      varying lowp vec4 vColor;
      void main(void) {
        gl_FragColor = vColor;
      }
    `;

// シェーダーをコンパイルする関数
function loadShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error('シェーダーのコンパイルに失敗しました: ' + info);
    }
    return shader;
}

const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);

// シェーダープログラムの作成とリンク
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(shaderProgram);
    throw new Error('シェーダープログラムのリンクに失敗しました: ' + info);
}
gl.useProgram(shaderProgram);

// 属性のロケーションを取得して有効化
const vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
gl.enableVertexAttribArray(vertexPositionAttribute);
const vertexColorAttribute = gl.getAttribLocation(shaderProgram, 'aVertexColor');
gl.enableVertexAttribArray(vertexColorAttribute);

// 変換用の uniform ロケーションを取得
const uModelViewMatrixLocation = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');

// 頂点データ（位置と色）【各頂点: [x, y, z, r, g, b, a]】
const vertices = new Float32Array([
    // 位置          // 色 (RGBA)
    0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, // 上（赤）
    -1.0, -1.0, 0.0, 0.0, 1.0, 0.0, 1.0, // 左下（緑）
    1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 1.0  // 右下（青）
]);

// バッファの生成とデータ転送
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const FSIZE = vertices.BYTES_PER_ELEMENT;
// 位置属性（3要素、ストライドは7要素）
gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, FSIZE * 7, 0);
// 色属性（4要素、オフセットは3要素分）
gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, FSIZE * 7, FSIZE * 3);

// 画面クリアの色
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// アニメーション用のレンダリング関数
let startTime = null;
function render(now) {
    if (!startTime) startTime = now;
    const elapsed = now - startTime;
    // 経過時間に応じた回転角（ラジアン）
    const angle = elapsed * 0.001;

    // Z 軸回りの回転行列を作成
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const rotationMatrix = new Float32Array([
        cosA, sinA, 0.0, 0.0,
        -sinA, cosA, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0,
    ]);

    // uniform 変換行列をシェーダーに送る
    gl.uniformMatrix4fv(uModelViewMatrixLocation, false, rotationMatrix);

    // キャンバスをクリアしてから描画
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // 次のフレームをリクエスト
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
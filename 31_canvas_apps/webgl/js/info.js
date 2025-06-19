const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

// GPUインフォ
gpuInfo(gl);

// WebGL コンテキストを取得
function gpuInfo(gl) {
    if (gl) {
        // WebGL のバージョン情報を表示
        document.getElementById('webgl-version').textContent = gl.getParameter(gl.VERSION);
        // GPU のレンダラ情報を取得（ブラウザによっては制限される場合もあります）
        document.getElementById('gpu-renderer').textContent = gl.getParameter(gl.RENDERER);
        // GPU のベンド情報を取得
        document.getElementById('gpu-vendor').textContent = gl.getParameter(gl.VENDOR);
    } else {
        // WebGL がサポートされていない場合
        document.getElementById('error-message').textContent = 'WebGL がサポートされていません。';
    }
}
// リザルト画面の描画
function drawResult() {
    // リザルト画面の描画ロジック
    ctx2d.fillStyle="rgba(255,0,0,1)";
    ctx2d.font = 'bold 120px Arial';
    ctx2d.fillText(gameData.score, 20, 20);
}
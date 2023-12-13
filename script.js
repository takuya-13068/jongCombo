let mode = 0; // モード管理用 0：タイトル画面 1：ゲーム画面 2：リザルト画面
let ctx2d;
let canvas; // キャンバス要素のグローバル参照
let t = 0; // 時間の管理用
let initialPfnw = performance.now(); // ロード時の起動時間をセット
let gameStartTime = 0; // ゲーム開始時間
let fieldCreated = false; // createFieldが実行されたかを追跡
let imageLoaded = false; // 画像が読み込まれたかを追跡するための変数
let inin = new Image(); // グローバルスコープで画像を定義




window.addEventListener('load', init); //ロード完了後にinitが実行されるように、ロードイベントを登録
window.addEventListener('DOMContentLoaded', function(){ ///キー入力イベントを登録
    window.addEventListener("keydown", function(e){
        if (e.key=="ArrowUp" || e.key=="ArrowDown" || e.key=="ArrowLeft" || e.key=="ArrowRight"){ //押されたのが方向キーだったら
            e.preventDefault();//スクロールを防ぐ
            if(mode==1){ //ゲーム画面なら
                moveCharacter(e.key);
            } 
        }
    });
});


function drawTitle(){//タイトル画面の描画
    ctx2d.fillStyle = 'blue';
    ctx2d.fillRect(WIDTH / 2 - 50, HEIGHT / 2, 100, 50);
    ctx2d.fillStyle = 'white';
    ctx2d.font = '20px Arial';
    ctx2d.fillText('Start Game', WIDTH / 2 - 40, HEIGHT / 2 + 30);
}

function startGame() {
    if (!fieldCreated) {
        CreateField();
        fieldCreated = true;
        gameStartTime = performance.now(); // ゲーム開始時間を記録
    }

    // 画像の読み込みが完了するのを待つ

    if (performance.now() - gameStartTime > 3000) {
        //ctx2d.clearRect(0, 0, WIDTH, HEIGHT);
        mode = 1; // リザルト画面へ
    }
}


// リザルト画面の描画
function drawResult() {
    // リザルト画面の描画ロジック
}


function init() {
    canvas = document.getElementById("myCanvas");
    ctx2d = document.getElementById("myCanvas").getContext("2d");
    gameStartTime = performance.now(); // ゲーム開始時間を記録

    canvas.addEventListener('click', function(event) {
        // クリックされた座標を取得
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // 「ゲーム開始」ボタンの範囲内かチェック
        if (x > WIDTH / 2 - 50 && x < WIDTH / 2 + 50 && y > HEIGHT / 2 && y < HEIGHT / 2 + 50) {
            mode = 1; // ゲームモードをゲーム画面に切り替え
            gameStartTime = performance.now(); // ゲーム開始時間をリセット
            ctx2d.clearRect(0, 0, WIDTH, HEIGHT);

        }
    });

    tick();
}

function tick() {
    t = performance.now() - initialPfnw;
    //ctx2d.clearRect(0, 0, WIDTH, HEIGHT);


    if (mode === 0) {
        drawTitle();
    } else if (mode === 1) {
        startGame();
    } else if (mode === 2) {
        drawResult();
    }

    requestAnimationFrame(tick);
}



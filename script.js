let mode = -1; // モード管理用 -1:ロード中　0：タイトル画面 1：ゲーム画面 2：リザルト画面
let ctx2d;
let canvas; // キャンバス要素のグローバル参照
let t = 0; // 時間の管理用
let initialPfnw = performance.now(); // ロード時の起動時間をセット
let gameStartTime = 0; // ゲーム開始時間
let fieldCreated = false; // createFieldが実行されたかを追跡
let imageLoaded = false; // 画像が読み込まれたかを追跡するための変数
let loadedImgCnt = 0; // 画像が読み込まれた数
let inin = new Image(); // グローバルスコープで画像を定義
let selectedTile = null; // 選択されたタイルを追跡する変数
let firstSelectedTile = null; // 最初に選択されたタイルを追跡する変数
let secondSelectedTile = null; // 2番目に選択されたタイルを追跡する変数
let thirdSelectedTile = null; // 3番目に選択されたタイルを追跡する変数
let removedTiles = []; // 消されたタイルを記録するための配列
let gameData = {score:0}; // ゲームデータ score:スコア
let imageFiles = {button:{}, tile:{}}; // 画像ファイルをここに読み込んでおく（毎回newしない）
let titleObjList = []; // タイトル画面に描画するオブジェクトをリスト形式で保存
let resultObjList = []; // リザルト画面に描画するオブジェクトをリスト形式で保存 

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
    ctx2d.clearRect(0, 0, WIDTH, HEIGHT);
    for(i = 0; i < titleObjList.length; i++){
        titleObjList[i].draw();
    }
}

function drawResult(){//リザルト画面の描画
    ctx2d.clearRect(0, 0, WIDTH, HEIGHT);
    for(i = 0; i < resultObjList.length; i++){
        resultObjList[i].draw();
    }
}

function startGame() {
    if (!fieldCreated) {
        createField();
        fieldCreated = true;
        gameStartTime = performance.now(); // ゲーム開始時間を記録
    }

    // 画像の読み込みが完了するのを待つ

    if (performance.now() - gameStartTime > 10000) {
        //ctx2d.clearRect(0, 0, WIDTH, HEIGHT);
        setMode(2); // リザルト画面へ
    }
}

function init() {
    canvas = document.getElementById("myCanvas");
    ctx2d = document.getElementById("myCanvas").getContext("2d");
    gameStartTime = performance.now(); // ゲーム開始時間を記録

    loadButtons();
    canvas.addEventListener('click', function(event) {
        if (mode === 0){
            // クリックされた座標を取得
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // 「ゲーム開始」ボタンの範囲内かチェック
            // 一旦どこでもOK
            setMode(1); // ゲームモードをゲーム画面に切り替え
            gameStartTime = performance.now(); // ゲーム開始時間をリセット
            ctx2d.clearRect(0, 0, WIDTH, HEIGHT);
        }

        if (mode === 1) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            let clickedTile = null;
            let canSelect = true; // タイルが選択可能かどうかのフラグ

        
            for (let tile of tiles) { //選択されたタイルの情報をとる
                let i = tiles.indexOf(tile) % (GameArea.width / TILES_SIZE.width);
                let j = Math.floor(tiles.indexOf(tile) / (GameArea.width / TILES_SIZE.width));
                let tileX = parseInt(GameArea.x + TILES_SIZE.width * i);
                let tileY = parseInt(GameArea.y + TILES_SIZE.height * j);
        
                if (x >= tileX && x < tileX + TILES_SIZE.width && y >= tileY && y < tileY + TILES_SIZE.height) {
                    clickedTile = tile;
                    break; // タイルがクリックされたらループを抜ける
                }
            }
        
            if (clickedTile) { // 選択できるか条件
                if (!firstSelectedTile) {
                    firstSelectedTile = clickedTile;
                } else if (!secondSelectedTile && ValidateSecondTile(firstSelectedTile, clickedTile)) {
                    secondSelectedTile = clickedTile;
                } else if (secondSelectedTile && ValidateThirdTile(firstSelectedTile, secondSelectedTile, clickedTile)) {
                    // 3番目のタイルを選択
                    console.log("Third Tile selected");
                    thirdSelectedTile = clickedTile;
                } else {
                    canSelect = false; // タイルが選択できない場合
                }
        
                //selectedTile = clickedTile; // 選択したタイルを設定
                console.log("Selected Tile:", clickedTile); // 選択したタイルの情報を出力
                drawTiles(); // タイルを再描画

                if (!canSelect) {
                    ctx2d.fillStyle = 'red';
                    ctx2d.font = 'bold 20px Arial';
                    ctx2d.fillText('You can not choose the tile!', 10, 30);
                }
            }
        }
    });

    setMode(-1);
    tick();
}

function setMode(nextMode){
    // モードの切り替え　モードの切替時には必ずこれを呼ぶ（直接変数modeを書き換えない）
    if(nextMode == 0){
        // ゲーム開始画面へ遷移するとき
        titleObjList = [];
        titleObjList.push(new Button('start', WIDTH/2 - (menuButtonHeight / 120 * 450 / 2), (HEIGHT - menuButtonHeight)/2, menuButtonHeight));
    } else if (nextMode == 2){
        // リザルト画面に遷移するとき
        resultObjList.push(new Button('retry', WIDTH/2 - (menuButtonHeight / 120 * 450 / 2), (HEIGHT - menuButtonHeight)/2 - menuButtonHeight * 1.2, menuButtonHeight));
        resultObjList.push(new Button('entry', WIDTH/2 - (menuButtonHeight / 120 * 450 / 2), (HEIGHT - menuButtonHeight)/2, menuButtonHeight));
    }
    mode = nextMode;
}

function tick() {
    t = performance.now() - initialPfnw;
    //ctx2d.clearRect(0, 0, WIDTH, HEIGHT);

    if (mode === -1){
        if(loadedImgCnt >= Object.keys(imageFiles.button).length + Object.keys(imageFiles.tile).length) {
            setMode(0);
        }
    } else if (mode === 0) {
        drawTitle();
    } else if (mode === 1) {
        startGame();

        if (thirdSelectedTile != null) {
            let firstTileIndex = tiles.indexOf(firstSelectedTile);
            let secondTileIndex = tiles.indexOf(secondSelectedTile);
            let thirdTileIndex = tiles.indexOf(thirdSelectedTile);

            removeSelectedTiles();
            displayRemovedTiles();
            //dropTiles(); // dropTiles関数の呼び出し
            addNewTiles();
            resetSelection();
            console.log("oisu");
        }
    } else if (mode === 2) {
        drawResult();
    }

    requestAnimationFrame(tick);
}



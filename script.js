let mode = -1; // モード管理用 -1:ロード中　0：タイトル画面 1：ゲーム画面 2：リザルト画面
let ctx2d;
let canvas; // キャンバス要素のグローバル参照
let t = 0; // 時間の管理用
let initialPfnw = performance.now(); // ロード時の起動時間をセット
let fieldCreated = false; // createFieldが実行されたかを追跡
let imageLoaded = false; // 画像が読み込まれたかを追跡するための変数
let loadedImgCnt = 0; // 画像が読み込まれた数
let selectedTile = null; // 選択されたタイルを追跡する変数
let firstSelectedTile = null; // 最初に選択されたタイルを追跡する変数
let secondSelectedTile = null; // 2番目に選択されたタイルを追跡する変数
let thirdSelectedTile = null; // 3番目に選択されたタイルを追跡する変数
let removedTiles = []; // 消されたタイルを記録するための配列
let gameData = {score:0, gameStartTime:0}; // ゲームデータ score:スコア
let imageFiles = {
    tiles: {},
}; // 画像ファイルをここに読み込んでおく（毎回newしない）
let titleObjList = []; // タイトル画面に描画するオブジェクトをリスト形式で保存
let resultObjList = []; // リザルト画面に描画するオブジェクトをリスト形式で保存 
let gameObjList = []; // ゲーム画面で描画するオブジェクトをリスト形式で保存
let tiles = []; // ここにタイルの情報を格納する
let imagesLoaded = 0; // 読み込まれた画像の数
let totalTiles; //title total
let combo = 0;
let comboLimitTime = 0; // comboが持続するタイマー
let combostart;
let reachMode = false;

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
    ctx2d.fillStyle = COLSET['green'];
    ctx2d.fillRect(0, 0, WIDTH, HEIGHT);
    for(var i = 0; i < titleObjList.length; i++){
        titleObjList[i].draw();
    }
}

function drawResult(){//リザルト画面の描画
    ctx2d.clearRect(0, 0, WIDTH, HEIGHT);
    for(i = 0; i < resultObjList.length; i++){
        resultObjList[i].draw();
    }
}

function drawGame(){//ゲーム画面の描画
    ctx2d.clearRect(0, 0, WIDTH, HEIGHT);
    ctx2d.fillStyle = COLSET['green'];
    ctx2d.fillRect(0, 0, WIDTH, HEIGHT);
    drawTiles();
    for(var i = 0; i < gameObjList.length; i++){
        gameObjList[i].draw();
    }
}

function checkClickOfTitleObj(x, y){
    for(var i = 0; i < titleObjList.length; i++){
        if(titleObjList[i].constructor.name == 'Button'){
            if(titleObjList[i].checkClicked(x, y)){
                titleObjList[i].clicked();
            }
        }
    }
}
function checkClickOfResultObj(x, y){
    for(i = 0; i < resultObjList.length; i++){
        if(resultObjList[i].constructor.name == 'Button'){
            if(resultObjList[i].checkClicked(x, y)){
                resultObjList[i].clicked();
            }
        }
    }
}

function startGame() {
    createField();
    fieldCreated = true;
    ctx2d.clearRect(0, 0, WIDTH, HEIGHT);
    gameData.gameStartTime = performance.now(); // ゲーム開始時間を記録
    gameData.score = 0;
    gameObjList = [];
    gameObjList.push(new Timer(WIDTH*0.85, 30, HEIGHT*0.05));
    gameObjList.push(new ScoreBoard('center', 100, HEIGHT*0.1));
}

function init() {
    canvas = document.getElementById("myCanvas");
    ctx2d = document.getElementById("myCanvas").getContext("2d");

    loadButtons();
    loadOtherImages();
    loadText();
    loadAnimation();
    canvas.addEventListener('click', function(event) {
        // クリックされた座標を取得
        const rect = canvas.getBoundingClientRect();
        const   viewX = event.clientX - rect.left,
                viewY = event.clientY - rect.top;
        const   scaleWidth =  canvas.clientWidth / canvas.width,
                scaleHeight =  canvas.clientHeight / canvas.height;
        const   x = Math.floor( viewX / scaleWidth),
                y = Math.floor( viewY / scaleHeight);
        if (mode === 0){
            checkClickOfTitleObj(x, y);
        } else if(mode === 2){
            checkClickOfResultObj(x, y);
        } else if (mode === 1) {
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

                if (clickedTile === firstSelectedTile) {
                    firstSelectedTile = null;
                } else if (clickedTile === secondSelectedTile) {
                    secondSelectedTile = null;
                } else if (clickedTile === thirdSelectedTile) {
                    thirdSelectedTile = null;
                } 
                else if (!firstSelectedTile) {
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

            if (clickedTile) {
                // タイル選択処理...
                let selectedIndex = tiles.indexOf(clickedTile);
                console.log("Selected Tile Index:", selectedIndex); // インデックスを出力
            }
        }
    });

    setMode(-1);
    tick();
}

function setMode(nextMode){ 
    if(nextMode === -1){
        loadTileImages();
    }else if(nextMode == 0){
        // ゲーム開始画面へ遷移するとき
        titleObjList = [];
        titleObjList.push(new MyImage('logo', 'center', HEIGHT*0.2, titleLogoHeight));
        titleObjList.push(new Button('start', WIDTH/2 - (menuButtonHeight / 120 * 450 / 2), HEIGHT*0.5, menuButtonHeight));
        titleObjList.push(new MyImage('howto', 'center', HEIGHT*0.7, titleLogoHeight));
    } else if(nextMode == 1){
        startGame();
    } else if (nextMode == 2){
        // リザルト画面に遷移するとき
        resultObjList.push(new Button('retry', WIDTH/2 - (menuButtonHeight / 120 * 450 / 2), (HEIGHT - menuButtonHeight)/2 - menuButtonHeight * 1.2, menuButtonHeight));
        resultObjList.push(new Button('entry', WIDTH/2 - (menuButtonHeight / 120 * 450 / 2), (HEIGHT - menuButtonHeight)/2, menuButtonHeight));
    }
    mode = nextMode;
}

function tick() {
    t = performance.now() - initialPfnw;

    if (mode === -1){
        if(loadedImgCnt >= Object.keys(imageFiles).length) {
            setMode(0);
        }
    } else if (mode === 0) {
        drawTitle();
    } else if (mode === 1) {
        if(comboLimitTime > 0){ //combo 残り時間の更新
            comboLimitTime = Math.max(5.0 - (t - combostart) /1000, 0);
            if(comboLimitTime <= 0){//combo終了
                combo = 0;
                removedTiles = []; // Reset removedtile
            }
        }
        if (combo === 4){ //雀頭選択立直モード
            
        }
        if (thirdSelectedTile != null) {
            removeSelectedTiles();
            displayRemovedTiles();
            resetSelection();
        }
        drawGame();
        displayRemovedTiles();
        if (performance.now() - gameData.gameStartTime > TIME_MAX * 1000) {
            setMode(2); // リザルト画面へ
        }
    } else if (mode === 2) {
        drawResult();
    }

    requestAnimationFrame(tick);
}



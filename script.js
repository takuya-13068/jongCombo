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

// スワイプ操作の座標を保存
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

let lastTouchX = 0;
let lastTouchY = 0;
let deleteTileCnt = 0;
let deleteflg = false;

function adjustViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', adjustViewportHeight);
adjustViewportHeight();

window.addEventListener('load', init); //ロード完了後にinitが実行されるように、ロードイベントを登録
window.addEventListener('DOMContentLoaded', function(e){ ///キー入力イベントを登録
    window.addEventListener("keydown", function(e){
        if (e.key=="ArrowUp" || e.key=="ArrowDown" || e.key=="ArrowLeft" || e.key=="ArrowRight"){ //押されたのが方向キーだったら
            e.preventDefault();//スクロールを防ぐ
        }
    });
    e.preventDefault();
});


function drawTitle(){//タイトル画面の描画
    ctx2d.clearRect(0, 0, WIDTH, HEIGHT);
    var drawX = (t/24 % WIDTH);
    ctx2d.drawImage(imageFiles['top_back'], drawX, 0, WIDTH, HEIGHT);
    ctx2d.drawImage(imageFiles['top_back'], drawX+1 - WIDTH, 0, WIDTH, HEIGHT);
    ctx2d.fillStyle="#C6C6C6BB";
    ctx2d.fillRect(0, HEIGHT*0.2, WIDTH,HEIGHT*0.28);
    for(var i = 0; i < titleObjList.length; i++){
        titleObjList[i].draw();
    }
}

function drawGame(){//ゲーム画面の描画
    ctx2d.clearRect(0, 0, WIDTH, HEIGHT);
    var drawX = (t/24 % WIDTH);
    ctx2d.drawImage(imageFiles['role_bar'], drawX, HEIGHT*0.325, WIDTH, WIDTH/5);
    ctx2d.drawImage(imageFiles['role_bar'], drawX+1-WIDTH, HEIGHT*0.325, WIDTH, WIDTH/5);
    drawTiles();
    for(var i = 0; i < gameObjList.length; i++){
        gameObjList[i].draw();
    }
}

function drawResult(){//リザルト画面の描画
    ctx2d.clearRect(0, 0, WIDTH, HEIGHT);
    var drawX = (t/24 % WIDTH);
    ctx2d.drawImage(imageFiles['result_back'], drawX, 0, WIDTH, HEIGHT);
    ctx2d.drawImage(imageFiles['result_back'], drawX+1 - WIDTH, 0, WIDTH, HEIGHT);
    for(i = 0; i < resultObjList.length; i++){
        resultObjList[i].draw();
    }
}
function checkClickOfGameObj(x, y){
    for(i = 0; i < gameObjList.length; i++){
        if(gameObjList[i].constructor.name == 'Button'){
            if(gameObjList[i].checkClicked(x, y)){
                gameObjList[i].clicked();
            }
        }
    }
}
function startGame() {
    createField();
    fieldCreated = true;
    ctx2d.clearRect(0, 0, WIDTH, HEIGHT);

    resetGameStatus();
    
    gameObjList.push(new MyImage('game_back', 0, -HEIGHT * 0.123, HEIGHT*0.45));
    gameObjList.push(new Button('backToHome', 30, 30, 70));
    gameObjList.push(new Timer(WIDTH*0.86, 30, HEIGHT*0.06));
    gameObjList.push(new ScoreBoard('center', 140, HEIGHT*0.12));
    gameObjList.push(new ComboGauge('center', 280, HEIGHT*0.1));

}

function resetGameStatus(){
    gameData.gameStartTime = performance.now(); // ゲーム開始時間を記録
    gameData.score = 0;
    gameObjList = [];
    combo = 0;
    comboLimitTime = 0;
    reachMode = false;
    deleteTileCnt = 0;

    selectedTile = null;
    firstSelectedTile = null; // 最初に選択されたタイルを追跡する変数
    secondSelectedTile = null; // 2番目に選択されたタイルを追跡する変数
    thirdSelectedTile = null;
    removedTiles = [];
}


function init() {
    canvas = document.getElementById("myCanvas");
    ctx2d = document.getElementById("myCanvas").getContext("2d");

    loadButtons();
    loadOtherImages();
    loadText();
    loadAnimation();

    touchStartEvent();
    touchMoveEvent();
    touchEndEvent();
    clickEvent();

    setMode(-1);
    tick();
}

function setMode(nextMode){ 
    if(nextMode === -1){
        loadTileImages();
    }else if(nextMode == 0){
        // ゲーム開始画面へ遷移するとき
        titleObjList = [];
        titleObjList.push(new MyRichImage('top_back_2', 200, HEIGHT-498, 500, 4, Infinity, 0));
        titleObjList.push(new MyRichImage('top_back_1', 0, HEIGHT-398, 400, 3, Infinity, 0));
        titleObjList.push(new MyRichImage('top_back_3', 0, 0, 300, 5, Infinity, 0));
        titleObjList.push(new MyRichImage('top_back_4', WIDTH*0.7, 0, 200, 5, Infinity, 0));
        titleObjList.push(new MyRichImage('logo', 'center', HEIGHT*0.24, titleLogoHeight, 7, Infinity, 0));
        titleObjList.push(new Button('start', WIDTH/2 - (menuButtonHeight / 120 * 450 / 2), HEIGHT*0.55, menuButtonHeight));
        titleObjList.push(new MyImage('howto', 'center', HEIGHT*0.72, titleLogoHeight));
    } else if(nextMode == 1){
        startGame();
        
    } else if (nextMode == 2){
        // リザルト画面に遷移するとき
        for(var i = 0; i < 4; i++){
            resultObjList.push(new MyRichImage('result_' + (i+1), WIDTH/2 + (i-2) * 90, 160, 100, 7, Infinity, i * 200));
        }
        resultObjList.push(new Button('retry', WIDTH/2 - (menuButtonHeight / 120 * 450 / 2), HEIGHT*0.6, menuButtonHeight));
        resultObjList.push(new Button('backToTopForResult', WIDTH/2 - (menuButtonHeight / 120 * 450 / 2), HEIGHT*0.63 + menuButtonHeight * 1.2, menuButtonHeight));
        resultObjList.push(new ScoreBoard('center', 360, 200));
        mainBGM.stop();
        gameStop.play();
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
            comboLimitTime = Math.max(COMBO_MAX_TIME - (t - combostart) /1000, 0);
            if(comboLimitTime <= 0){//combo終了
                combo = 0;
                removedTiles = []; // Reset removedtile
                gameObjList = gameObjList.filter(function(v){
                    return v.constructor.name != 'GroupTile';
                })
                reachMode = false;
                deleteflg = false;
            }
        }
        if (reachMode){ //雀頭選択立直モード
            if(secondSelectedTile != null){
                getRole.play();
                removeSelectedTiles();
            }
        } else if (thirdSelectedTile != null) {
            getSet.play();
            removeSelectedTiles();
            resetSelection();
        }
        drawGame();
        if (performance.now() - gameData.gameStartTime > TIME_MAX * 1000) {
            //gameStop.play();
            fadeInBlackout(function() {
                setMode(2);
                fadeOutBlackout();
            });
        }
    } else if (mode === 2) {
        drawResult();
    }

    requestAnimationFrame(tick);
}

let mode = 0; //モード管理用　0：タイトル画面　1：ゲーム画面　２：リザルト画面
let resultText=""; //ゲームの結果　MissかClear
let ctx2d;
let t = 0; //時間の管理用
let initialPfnw = performance.now();//ロード時の起動時間をセット
let lastPfnw=performance.now();
let myPos={x:0,y:0};

//まず始めにここが実行される
window.addEventListener('load', init); //ロード完了後にinitが実行されるように、ロードイベントを登録
window.addEventListener('DOMContentLoaded', function(){ ///キー入力イベントを登録
    window.addEventListener("keydown", function(e){
        if (e.key=="ArrowUp" || e.key=="ArrowDown" || e.key=="ArrowLeft" || e.key=="ArrowRight"){ //押されたのが方向キーだったら
            e.preventDefault();//スクロールを防ぐ
            if(mode==1){ //ゲーム画面なら
                moveCharacter(e.key);
            } 
        }
        /*
        Ex.3
            以下の処理を追加しよう
            スペースキーが押されたとき、
                modeが0ならば、startGame関数を呼び出す
                modeが2ならば、modeを0にする
            参考：上記の例の"ArrowUp"や"ArrowDown"などに該当する部分は、押されたキーがスペースキーの場合、" "(半角スペース1文字)となる
        */
    });
});
//ここで最初の実行は終了
//サイトのロード完了したら、initが呼び出される
//この行以降の関数は、最初は実行されない

function drawTitle(){//タイトル画面の描画
    ctx2d.fillStyle=COL_CHARACTER; //塗りつぶしのスタイルを指定（COL_CHARACTERの中身はdata.jsに記述してある）
    ctx2d.fillRect(WIDTH/2-100,HEIGHT/2-100,200,200);　//正方形を描画
    /*
    Ex.1
        まずはcanvasの描画処理に慣れるため、ここに適当な四角形を表示する処理を記述してみよう。
        余裕があれば、座標にtを用いて四角形を動かしてみよう(変数"t"には起動からの経過時間がミリ秒単位で格納されている)
        参考：Math.sin(1)で1ラジアンのsinを計算できる
    */
    ctx2d.fillStyle=COL_TEXT; //塗りつぶしのスタイルを指定
    ctx2d.font="32px sans-serif"; //フォントを設定
    ctx2d.fillText("SQUARE",(WIDTH-ctx2d.measureText("SQUARE").width)/2,HEIGHT/2-20);//ここで文字を描画
    /*
    Ex.2
        ここに、"Press space key"と表示する処理を記述してみよう。
        フォントは14〜18px、位置は"SQUARE"よりも若干下側で左右中央。
        余裕があれば、操作説明（「方向キーで移動」「緑を目指そう」etc...)も追加してみよう。
    */
}

function drawResult(){//リザルト画面の描画
    /*
    Ex.6
        resultTextには"Miss"か"Clear!"が格納されている
        ここまでの内容を参考に、自由にプレイ結果を描画しよう
    */
}

function startGame(){ //ゲームスタートの処理
    myPos.x=START_POS_X;
    myPos.y=START_POS_Y;
    mode=1;
}

function triggerEvent(event){//ゴールやミスなどのイベントを発生させる関数
    if(event==0){//ミス
        mode=2;
        resultText="Miss";
    } else if(event==1){//クリア
        mode=2;
        resultText="Clear!";
    }
}

function checkColisionObj(obj){//オブジェクトとの当たり判定
    for(let i = 0;i < obj.length;i++){
        if(myPos.x < obj[i].x+obj[i].w && myPos.x + CHARACTER_SIZE > obj[i].x){
            if(myPos.y < obj[i].y+obj[i].h && myPos.y + CHARACTER_SIZE > obj[i].y){
                triggerEvent(obj[i].event);
            }
        }
    }    
}

function checkColisionWall(direction,MOVE_SPEED){//壁との当たり判定　0なら衝突なし、1なら衝突あり
    var offsetX=0,offsetY=0;
    if(direction=="ArrowUp") offsetY-=MOVE_SPEED;
    if(direction=="ArrowDown") offsetY+=MOVE_SPEED;
    if(direction=="ArrowLeft") offsetX-=MOVE_SPEED;
    if(direction=="ArrowRight") offsetX+=MOVE_SPEED;
    for(let i = 0;i < WALL.length;i++){
        /*
        Ex.5
            スライドの内容を参考に、ここに当たり判定を行う処理を追加しよう。
            オブジェクトの衝突がある場合は、1を返す("return 1"と記述)
            当たり判定は、offsetXとoffsetYを考慮して行うこと
            壁の座標情報はWALL[i].x (x,y,w,h)として参照できる
        */
    }
    return 0;//衝突がない場合、0を返す
}
function moveCharacter(direction){ //移動の処理
    const MOVE_SPEED=10*(t-lastPfnw)/30;
    if(checkColisionWall(direction,MOVE_SPEED)) return 0;
    /*
    Ex.4
        ここに、以下の処理を追加しよう
            directionが"ArrowUp"なら上に移動する
            directionが"ArrowDown"なら下に移動する
            directionが"ArrowLeft"なら左に移動する
            directionが"ArrowRight"なら右に移動する
    */
}
function drawCharacter(myPos){//キャラクターの描画処理
    ctx2d.fillStyle=COL_CHARACTER;
    ctx2d.fillRect(myPos.x,myPos.y,CHARACTER_SIZE,CHARACTER_SIZE);
}
function drawObj(obj){//オブジェクトの描画処理
    for(let i = 0;i < obj.length;i++){
        ctx2d.fillStyle=obj[i].col;
        ctx2d.fillRect(obj[i].x,obj[i].y,obj[i].w,obj[i].h);
    }
}
function drawWall(){//壁の描画処理
    for(let i = 0;i < WALL.length;i++){
        ctx2d.fillStyle=WALL[i].col;
        ctx2d.fillRect(WALL[i].x,WALL[i].y,WALL[i].w,WALL[i].h);
    }
}

function init() {//ロード完了後に呼び出される関数　最初に一回だけ呼び出す処理を記述
    ctx2d=document.getElementById("myCanvas").getContext("2d"); //ctx2dをセット
    tick(); //ここでループ処理を呼び出し　tick()関数は無限ループする
}

function tick() { //ループ処理
    let obj=[ //オブジェクトのデータ　座標と色、接触時のイベントを格納　event：0 - ミス　1 - クリア
        {x:100,y:50,w:10,h:10,col:COL_ENEMY[0],event:0},
        {x:50,y:100,w:10,h:10,col:COL_ENEMY[1],event:0},
        {x:200,y:200,w:10,h:10,col:COL_GOAL,event:1}
    ];
    /*
    Ex.7
        上の変数objには、ステージデータの情報が格納されている。
        自由に内容を変更して、自分だけのステージを作ろう。
        参考：座標をtで指定すると、動かすことができる
    */

    lastPfnw=t;//前回のループでの経過時間を移す
    t=performance.now()-initialPfnw;    //ゲーム開始からの経過時間をセット
    ctx2d.clearRect(0,0,WIDTH,HEIGHT);  //2次元のリセット処理
    ctx2d.fillStyle=COL_BACK;
    ctx2d.fillRect(0,0,WIDTH,HEIGHT);   //背景を描画

    if(mode==0){
        drawTitle();        //タイトル画面の描画
    } else if(mode==1){
        drawWall();         //壁の描画処理
        drawObj(obj);       //敵の描画処理
        drawCharacter(myPos);//キャラクターの描画処理
        checkColisionObj(obj);    //衝突チェック
    } else if(mode==2){//リザルト画面
        drawResult();
    }

    requestAnimationFrame(tick);//再帰することでループ　このタイミングでcanvasへの描画が行われる
}

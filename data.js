const WIDTH = 720, HEIGHT = 1280;// キャンバスのサイズを指定

const GameArea = {x: 0, y: 1280*4/10, width: WIDTH, height: HEIGHT*6/10, color: "rgba(0,0,0,1)"};
const COLSET = {green: '#116D4E', brown:'#4E3636', gray: '#555756', yellow: '#FAC62C'};
const TIME_MAX = 60; // ゲーム時間（秒）
const COMBO_TILE_SIZE_SCALE = 0.5;

const buttonList = ['start', 'entry', 'retry', 'backToHome']; // img内に'button_XXX.png' のファイルを用意する
const otherImagesList = ['logo', 'howto', 'gauge', 'gauge_full', 
                        'value_tiles', 'all_simples', 'reach', 'double_run', 'three_triples', 'full_straight', 'little_dragons', 'half_flush', '2_double_runs', 'full_flush', 'big_dragons', 'four_triples',
                        'top_back', 'top_back_1', 'top_back_2', 'top_back_3', 'top_back_4', 'scoreboard_back', 'timer', 'game_back', 'role_bar',
                        'reach_1', 'reach_2', 'agari_1', 'agari_2', 'gauge_vertical', 'role_back', 'role_han_back']; // img内に'XX.webp'のファイルを用意する
const animationImagesList = [{id:'explosion', cntW:5, cntH:3, maxCnt:15},
                            {id:'thunder', cntW:7, cntH:9, maxCnt:63},
                            {id:'fire', cntW:5, cntH:5, maxCnt:25},]
const textImageList = ['0','1','2','3','4','5','6','7','8','9','colon', 'combo', 'han', 'plus', 
                        '0_kanji','1_kanji','2_kanji','3_kanji','4_kanji','5_kanji','6_kanji','7_kanji','8_kanji','9_kanji'];
const menuButtonHeight = 110;
const titleLogoHeight = 280;
const tileEffectSize = 120;
const ScoreBoardLoop = 10;
const ComboGaugeLoop = 10;
const COMBO_MAX_TIME = 10;
const ROLE_MARGIN_COEFFICIENT = 1.1;
const ROLE_EFFECT_SIZE_BASE = HEIGHT*0.2;

const score = [100,200,400,800];

/*役スコア
1飜: 立直, タンヤオ, ドラ, 一盃口
2飜: 三暗刻, 小三元, 一気通貫, トイトイ
3飜: 混一色, 二盃口
6飜: 清一色
役満: 大三元, 四暗刻
*/
const role = {"Reach": {han:1, fileName:'reach'}, "All Simples": {han:1, fileName:'all_simples'}, "Double-Run": {han:1, fileName:'double_run'}, "Value Tiles": {han:1, fileName:'value_tiles'}, 
        "Three Triples": {han:2, fileName:'three_triples'}, "Full straight": {han:2, fileName:'full_straight'}, "Little Dragons": {han:2, fileName:'little_dragons'}, "All Triles": {han:2, fileName:'all_triples'},
        "Half Flush": {han:3, fileName:'half_flush'}, "2 Double Runs": {han:3, fileName:'2_double_runs'}, "Full Flush": {han:6, fileName:'full_flush'}, 
        "Big Dragons": {han:13, fileName:'big_dragons'}, "Four Triples": {han:13, fileName:'four_triples'}
    };
const role_score = {1:1000, 2:2000, 3:4000, 4:8000, 5:8000, 6:12000, 7:12000, 8:16000, 9:16000, 10:16000, 11:24000, 12:24000, 13:32000};

//麻雀牌
const TILES_SIZE = {width: 100, height: HEIGHT * 3/5 /6, row:7, column: 6}; // 7*6
//const TILES_SIZE = {width: WIDTH / 6, height: HEIGHT * 3 /5/5, row:6, column: 5}; // 6*5
const widthMargin = GameArea.width - TILES_SIZE.width * TILES_SIZE.row;
const heightMargin = GameArea.height - TILES_SIZE.height * TILES_SIZE.column;
const TILES_HORIZONTAL = Math.floor(GameArea.width / TILES_SIZE.width);
const TILES_VERTICAL = Math.floor(GameArea.height / TILES_SIZE.height);

const FILE_NAME_MAP = {'manzu' : 'p_ms', 'pinzu' : 'p_ps', 'sozu' : 'p_ss', 'jihai' : 'p_ji'};
//const tile_number = 9 + 9 + 7; //manzu, pinzu, jihai
const tile_number = 9 + 9 + 3; //manzu, pinzu, 三元杯

class Tile {
    constructor(kind, value, x, y){
        this.kind = kind;
        this.value = value;
        this.x = x;
        this.y = y;
        this.verticalV = 0;
        this.towardX = x;
        this.towardY = y;
        this.size = 1;
        let imageName = FILE_NAME_MAP[this.kind] + String(this.value) + '_1';
        this.pic = imageFiles.tiles[imageName];
    } 

    draw() {
        if(this.x + 3 < this.towardX){
            this.x+=3;
        } else if(this.x - 3 > this.towardX){
            this.x-=3;
        } else {
            this.x = this.towardX;
        }
        this.x = 0.9 * this.x + 0.1 * this.towardX;
        if(this.x - this.towardX < 3){
            this.x = this.towardX;
        }
        if (this.y + this.verticalV + 1< this.towardY){
            this.y+=this.verticalV;
            if(this.verticalV < -3) {
                this.verticalV = -3;
            }
            this.verticalV++;
        } else if(this.y - this.verticalV - 1 > this.towardY){
            this.y+=this.verticalV;
            this.verticalV--;
            if(this.verticalV > 3) {
                this.verticalV = 3;
            }
        } else {
            this.y = this.towardY;
            this.verticalV = 0;
        }
        ctx2d.drawImage(this.pic, this.x+4 *this.size, this.y+4*this.size, (TILES_SIZE.width-8)*this.size,(TILES_SIZE.height-8)*this.size);
    }
}
class GroupTile extends Tile{
    constructor(kind, value, x, y){
        super(kind, value, x, y);
        this.initialTime = performance.now();
        this.size = COMBO_TILE_SIZE_SCALE;
    }
}

class MyImage{
    constructor (kind, x, y, size){
        this.kind = kind;
        this.x = x;
        this.y = y;
        this.h = size;
        this.w = size / imageFiles[kind].height * imageFiles[kind].width;
        this.wave = false;
        this.scale = 1;
        if(this.x == 'center'){
            this.x = (WIDTH - this.w)/2;
        }
    }
    draw(){
        let drawy = this.y;
        if(this.wave){
            // 振動
            drawy = drawy + 10 * Math.max(0, Math.sin(t * 0.005)-0.3);
        }
        if(this.shadow){
            ctx2d.fillStyle="#00000060";
            ctx2d.fillRect(this.x+5, drawy+5, this.w, this.h);
        }    
        if(this.kind == 'howto'){
            ctx2d.fillStyle="#00000090";
            ctx2d.fillRect(this.x+40, drawy+48, this.w - 58, this.h - 62);
        }
        ctx2d.drawImage(imageFiles[this.kind], this.x + this.w * (1 - this.scale) / 2, drawy + this.h * (1 - this.scale) / 2, this.w * this.scale, this.h * this.scale);
    }
}

class Button extends MyImage{
    constructor (kind, x, y, size){
        super(kind, x, y, size);
        this.wave = true;
        this.shadow = true;
        if(kind == 'backToHome') {
            this.wave = false;
            this.shadow = false;
        }
    }
    checkClicked(clickedX, clickedY){
        if(this.x < clickedX && clickedX < this.x + this.w){
            if(this.y < clickedY && clickedY < this.y + this.h){
                return true;
            }
        }
        return false;
    }
    clicked(){
        if(this.kind == 'start'){
            startGameClick.play();
            setMode(1);
        } else if(this.kind == 'retry'){
            startGameClick.play();
            setMode(1);
        } else if(this.kind == 'entry'){
            setMode(0);
        } else if(this.kind == 'backToHome'){
            mainBGM.stop();
            setMode(0);
        }
    }
}
class Timer extends MyImage{
    constructor(x, y, size){
        super('1', x, y, size);
    }
    draw(){
        var sec = Math.floor((performance.now() - gameData.gameStartTime)/1000);
        var s = [0,0];
        var myRad = this.h * 0.65;
        ctx2d.drawImage(imageFiles['timer'], this.x - (myRad * 2 - this.w) / 2, this.y - (myRad * 2 - this.h) / 2, myRad*2, myRad*2);
        ctx2d.fillStyle = "#666";
        ctx2d.beginPath();
        ctx2d.moveTo(this.x + this.w / 2, this.y + this.h / 2);
        ctx2d.arc(this.x + this.w / 2, this.y + this.h / 2, myRad, -Math.PI * 0.5, -Math.PI * 0.5 - Math.PI * 2 * sec / TIME_MAX, true);
        ctx2d.fill();
        sec = TIME_MAX - sec;
        s[0] = (sec - sec % 10) / 10;
        sec-=s[0]*10;
        s[1] = Math.max(0, sec);
        for(var i = 0; i < 2; i++){
            if(imageFiles[s[i]] == null) {
                s[i] = '0';
            }
            ctx2d.drawImage(imageFiles[s[i]], this.x + this.h/4+ (i-1) * this.w * 0.75, this.y, this.w, this.h);
        }  
    }
}
class ScoreBoard extends MyImage{
    constructor (x, y, size){
        super('1', x, y, size);
        this.score = gameData.score;
        // 常に横幅は5文字分確保しておく
        this.x+=this.w * 0.5;
        this.w*=5;
        this.drawScale = 1;
    }
    freshScore(){
        var scoreTransitionPerIter = Math.max(2, Math.abs(this.score - gameData.score) / ScoreBoardLoop);
        if(this.score > gameData.score + scoreTransitionPerIter){
            this.score-=scoreTransitionPerIter;
        } else if(this.score < gameData.score - scoreTransitionPerIter){
            this.score+=scoreTransitionPerIter;
        } else {
            this.score = gameData.score;
        }
        this.drawScale = (1 + Math.min(0.3, Math.abs(this.score - gameData.score) * 0.05));
    }
    draw(){
        this.freshScore();
        var drawScore = Math.round(Math.min(99999, Math.max(0, this.score)));
        ctx2d.drawImage(imageFiles['scoreboard_back'], (this.x) - 5/2* this.w / 5 * 1.1, this.y - this.h * 0.1 / 2, this.w * 1.1, this.h * 1.1);
        for (var i = 0; i < String(drawScore).length; i++){
            ctx2d.drawImage(imageFiles[String(drawScore)[i]], (this.x) + (i-String(drawScore).length/2) * this.w * 0.7 * this.drawScale / 5, this.y + (1 - this.drawScale) * this.h / 2, this.w * this.drawScale / 5, this.h * this.drawScale - 5);
        }
    }
}

class MyAnimation extends MyImage{
    constructor (kindNum, x, y, size, maxT){
        super(animationImagesList[kindNum].id, x, y, size);
        this.initialT = t;
        this.maxT = maxT;
        this.kindNum = kindNum;
        this.w = this.h * (imageFiles[animationImagesList[kindNum].id].width / animationImagesList[kindNum].cntW) / (imageFiles[animationImagesList[kindNum].id].height / animationImagesList[kindNum].cntH);
    }
    draw(){
        if(this.initialT < t && t < this.initialT + this.maxT){
            var cnt = Math.floor((t - this.initialT) / this.maxT * animationImagesList[this.kindNum].maxCnt);
            var sw = imageFiles[animationImagesList[this.kindNum].id].width / animationImagesList[this.kindNum].cntW;
            var sh = imageFiles[animationImagesList[this.kindNum].id].height / animationImagesList[this.kindNum].cntH;
            var sx = (cnt % animationImagesList[this.kindNum].cntW) * sw;
            var sy = Math.floor(cnt / animationImagesList[this.kindNum].cntW) * sh;
            ctx2d.drawImage(imageFiles[animationImagesList[this.kindNum].id], sx, sy, sw, sh, this.x, this.y, this.w, this.h);   
        }
    }
    isOver(){
        return (t > this.initialT + this.maxT);
    }
}

class MyRichImage extends MyImage{
    constructor (kind, x, y, size, animationKind, time, timeOffset){
        super(kind, x, y, size);
        this.animationKind = animationKind;
        this.time = time;
        this.initialTime = performance.now() + timeOffset;
        if(this.animationKind == 3){
            // 下から上へ登場
            this.towardY = this.y;
            this.y+=100;
        } else if(this.animationKind == 4){
            // 右から左へ登場
            this.towardX = this.x;
            this.x+=100;
        } else if(this.animationKind == 9 || this.animationKind == 10){
            // 左から左へ登場（素早い）
            this.towardX = this.x;
            this.x-=WIDTH * 2;
        } else if(this.animationKind == 5){
            // 上から下へ登場
            this.towardY = this.y;
            this.y-=100;
        } else if(this.animationKind == 7){
            // ふわっと登場
            this.scale = 1.5;
        }
    }
    draw(){
        var myT = ((t - this.initialTime) / this.time); // 0(書き始め)〜1(書き終わり)
        if(this.animationKind == 2){
            this.scale = 2 - myT;
        } else if(this.animationKind == 3 || this.animationKind == 5){
            this.y = 0.9 * this.y + 0.1 * this.towardY;            
        } else if(this.animationKind == 4){
            this.x = 0.9 * this.x + 0.1 * this.towardX;
        } else if(this.animationKind == 9 || this.animationKind == 10){
            this.x = 0.7 * this.x + 0.3 * this.towardX;
        } else if(this.animationKind == 7){
            this.scale = 0.8 * this.scale + 0.2 * 1;
        } else if(this.animationKind == 8){
            // 立直
            this.scale = Math.max(1, 1 + 1 / Math.pow((myT+0.8), 3) - 0.8);
        } else if(this.animationKind == 11){
            this.scale = Math.max(1, 1 + 1 / Math.pow((myT+0.8), 3) - 0.8);
        }
        if(performance.now() > this.initialTime && performance.now() - this.initialTime < this.time){
            if(this.animationKind == 8  || this.animationKind == 9 || this.animationKind == 10){
                if(myT < 0.2){
                    ctx2d.globalAlpha = myT * 5;
                } else if(myT > 0.8){
                    ctx2d.globalAlpha = myT * -5 + 5
                }
            }    
            if(this.animationKind == 9){
                // 背景を表示
                ctx2d.drawImage(imageFiles['role_back'], this.x - 15, this.y - 10, this.w + 40, this.h + 20);
            }        
            super.draw();
            if(this.animationKind == 8 || this.animationKind == 9 || this.animationKind == 10){
                ctx2d.globalAlpha = 1;
            }
        }
    }
}

class ComboGauge extends MyImage{
    constructor (x, y, size){
        super('gauge', x, y, size);
        this.gaugeValue = 0;
    }
    draw(){
        var comboGaugeSpeed = Math.max(0.05, Math.abs(this.gaugeValue - comboLimitTime / COMBO_MAX_TIME) / ComboGaugeLoop);
        if (this.gaugeValue > comboLimitTime / COMBO_MAX_TIME + comboGaugeSpeed) {
            this.gaugeValue -= comboGaugeSpeed;
        } else if(this.gaugeValue < comboLimitTime / COMBO_MAX_TIME - comboGaugeSpeed){
            this.gaugeValue += comboGaugeSpeed;
        } else {
            this.gaugeValue = comboLimitTime / COMBO_MAX_TIME;
        }
        ctx2d.drawImage(imageFiles['gauge'], this.x, this.y, this.w, this.h);   
        ctx2d.drawImage(imageFiles['gauge_full'], 0, 0, imageFiles['gauge_full'].width * this.gaugeValue, imageFiles['gauge_full'].height, this.x, this.y, this.w * this.gaugeValue, this.h);   
    }
}
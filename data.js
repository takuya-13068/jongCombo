const WIDTH = 720, HEIGHT = 1280;// キャンバスのサイズを指定

const GameArea = {x: 0, y: 1280*4/10, width: WIDTH, height: HEIGHT*6/10, color: "rgba(0,0,0,1)"};
const COLSET = {green: '#116D4E', brown:'#4E3636'};
const TIME_MAX = 100; // ゲーム時間（秒）
const COMBO_TILE_SIZE_SCALE = 0.55;

const buttonList = ['start', 'entry', 'retry']; // img内に'button_XXX' のファイルを用意する
const otherImagesList = ['logo', 'howto', 'gauge', 'gauge_full']; // img内に'XX.webp'のファイルを用意する
const animationImagesList = [{id:'explosion', cntW:5, cntH:3, maxCnt:15}]
const textImageList = ['0','1','2','3','4','5','6','7','8','9','colon', 'combo'];
const menuButtonHeight = 90;
const titleLogoHeight = 280;
const tileEffectSize = 120;
const ScoreBoardLoop = 10;
const ComboGaugeLoop = 10;
const COMBO_MAX_TIME = 5;

const score = [100,200,400,800];

/*役スコア
1飜: タンヤオ, ドラ, 一盃口
2飜: トイトイ, 三暗刻, 小三元, 一気通貫
3飜: 混一色, 二盃口
6飜: 清一色
役満: 大三元
*/
const role = {"All Simples": 1, "Double-Run": 1, "Value Tiles": 1, 
        "All Triples": 2, "Full straight": 2, "Little Dragons": 2, 
        "Half Flush": 3, "2 Double Runs": 3, "Full Flush": 6, "Big Dragons": 13
    };

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
        ctx2d.drawImage(imageFiles[this.kind], this.x, drawy, this.w, this.h);
    }
}

class Button extends MyImage{
    constructor (kind, x, y, size){
        super(kind, x, y, size);
        this.wave = true;
        this.shadow = true;
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
            setMode(1);
        } else if(this.kind == 'retry'){
            setMode(1);
        } else if(this.kind == 'entry'){
            setMode(0);
        }
    }
}
class Timer extends MyImage{
    constructor(x, y, size){
        super('1', x, y, size);
        this.w = size / 8 * 5 * 2;
    }
    draw(){
        var sec = Math.floor(TIME_MAX - (performance.now() - gameData.gameStartTime)/1000);
        var s = [0,0];
        s[0] = (sec - sec % 10) / 10;
        sec-=s[0]*10;
        s[1] = Math.max(0, sec);
        for(var i = 0; i < 2; i++){
            if(imageFiles[s[i]] == null) {
                s[i] = '0';
            }
            ctx2d.drawImage(imageFiles[s[i]], this.x + i * this.w / 2, this.y, this.w / 2, this.h);
        }  
    }
}
class ScoreBoard extends MyImage{
    constructor (x, y, size){
        super('1', x, y, size);
        this.score = gameData.score;
        // 常に横幅は4文字分確保しておく
        this.x-=this.w * 1.5;
        this.w*=4;
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
        this.drawScale = 0.9 * this.drawScale + 0.1 * (1 + Math.min(0.2, Math.abs(this.score - gameData.score) * 0.01));
    }
    draw(){
        this.freshScore();
        var drawScore = Math.round(Math.min(9999, Math.max(0, this.score)));
        for (var i = 0; i < String(drawScore).length; i++){
            ctx2d.drawImage(imageFiles[String(drawScore)[i]], (this.x + this.w / 2) + i * this.w * this.drawScale / 4 - String(drawScore).length * this.w * this.drawScale / 8, this.y + (1 - this.drawScale) * this.h / 2, this.w * this.drawScale / 4, this.h * this.drawScale);
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
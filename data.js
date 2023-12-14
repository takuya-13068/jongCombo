const WIDTH = 720, HEIGHT = 1280;// キャンバスのサイズを指定

const GameArea = {x: 0, y: 1280*4/10, width: WIDTH, height: HEIGHT*6/10, color: "rgba(0,0,0,1)"};
const COLSET = {green: '#115D4E'};
const buttonList = ['start', 'entry', 'retry']; // img内に'button_XXX' のファイルを用意する
const otherImagesList = ['logo']; // img内に'XX.webp'のファイルを用意する
const menuButtonHeight = 90;
const titleLogoHeight = 280;

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
const TILES_SIZE = {width: WIDTH/6, height: HEIGHT * 3 /5 / 5};
const FILE_NAME_MAP = {'manzu' : 'p_ms', 'pinzu' : 'p_ps', 'sozu' : 'p_ss', 'jihai' : 'p_ji'};
const tile_number = 9 + 9 + 7; //manzu, pinzu, jihai
class Tile {
    constructor(kind, value){
        this.kind = kind;
        this.value = value;
        this.pic = new Image(); // ❗これだとタイルをnewする度にファイルを読みにいっちゃうから、modeが-1のときにまとめて画像ファイルをimageFiles.tilesの中に読み込んで、描画するときはimageFiles.tilesの中身経由でファイルを読むようにしてくれい　imageFiles.buttonで全く同じ処理やってるから参考に
        this.pic.src = './assets/img/' + FILE_NAME_MAP[this.kind] + String(this.value) + '_1.gif';
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

const WIDTH = 720, HEIGHT = 1280;// キャンバスのサイズを指定

const GameArea = {x: 0, y: 1280*4/10, width: WIDTH, height: HEIGHT*6/10, color: "rgba(0,0,0,1)"};
const COLSET = {green: '#116D6E'};
const buttonList = ['start', 'entry', 'retry']; // img内に'button_XXX' のファイルを用意する
const menuButtonHeight = 120;

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
        this.pic = new Image();
        this.pic.src = './assets/img/' + FILE_NAME_MAP[this.kind] + String(this.value) + '_1.gif';
    }
}
class Button{
    constructor (kind, x, y, size){
        this.kind = kind;
        this.x = x;
        this.y = y;
        this.width = size / 120 * 450;
        this.height = size;
    }
    draw(){
        ctx2d.drawImage(imageFiles.button[this.kind], this.x, this.y, this.width, this.height);
    }
}
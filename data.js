const WIDTH = 720, HEIGHT = 1280;// キャンバスのサイズを指定

const GameArea = {x: 0, y: 1280*4/10, width: WIDTH, height: HEIGHT*6/10, color: "rgba(0,0,0,1)"};

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
const TILES_SIZE = {width: WIDTH/6, height: HEIGHT * 3 /6 / 5};
const tile_number = 9 + 9 + 7; //manzu, pinzu, jihai
class Tile {
    constructor(kind, value){
        this.kind = kind;
        this.value = value;
        this.pic = new Image();
        this.pic.src = './assets/img/' + this.kind + '_' + String(this.value) + '.png';
    }
}





//参考：rgba(r,g,b,t)で、red,green,blueがそれぞれr,g,bで不透明度がt(0〜1)の色を作ることができる
const COL_WALL="rgba(120,120,50,1)";//壁の色
const COL_TEXT="rgba(255,255,255,1)";//テキストの色
const COL_CHARACTER="rgba(200,0,0,1)";//自分の色
const COL_BACK="rgba(30,30,0,1)";//背景の色
const COL_ENEMY=["rgba(255,0,0,1)","rgba(200,100,0,1)"];//敵の色の配列
const COL_GOAL="rgba(100,255,100,1)";//ゴールの色


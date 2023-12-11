const WIDTH = 960, HEIGHT = 540;// キャンバスのサイズを指定
const START_POS_X=50,START_POS_Y=HEIGHT/2;
const CHARACTER_SIZE=30, WALL_WIDTH=30;
//参考：rgba(r,g,b,t)で、red,green,blueがそれぞれr,g,bで不透明度がt(0〜1)の色を作ることができる
const COL_WALL="rgba(120,120,50,1)";//壁の色
const COL_TEXT="rgba(255,255,255,1)";//テキストの色
const COL_CHARACTER="rgba(200,0,0,1)";//自分の色
const COL_BACK="rgba(30,30,0,1)";//背景の色
const COL_ENEMY=["rgba(255,0,0,1)","rgba(200,100,0,1)"];//敵の色の配列
const COL_GOAL="rgba(100,255,100,1)";//ゴールの色
const WALL=[ //eventは0なら何もない　1はミス　2はクリア
    {x:0,y:0,w:WIDTH,h:WALL_WIDTH,col:COL_WALL},
    {x:0,y:0,w:WALL_WIDTH,h:HEIGHT,col:COL_WALL},
    {x:WIDTH-WALL_WIDTH,y:0,w:WALL_WIDTH,h:HEIGHT,col:COL_WALL},
    {x:0,y:HEIGHT-WALL_WIDTH,w:WIDTH,h:WALL_WIDTH,col:COL_WALL}
];

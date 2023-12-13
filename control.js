let tiles = []; // ここにタイルの情報を格納する
let imagesLoaded = 0; // 読み込まれた画像の数

function drawTiles() {
    for (let tile of tiles) {
        let i = tiles.indexOf(tile) % (GameArea.width / TILES_SIZE.width);
        let j = Math.floor(tiles.indexOf(tile) / (GameArea.width / TILES_SIZE.width));
        console.log(tile.pic)
        ctx2d.drawImage(tile.pic, 
                        parseInt(GameArea.x + TILES_SIZE.width * i), 
                        parseInt(GameArea.y + TILES_SIZE.height * j),
                        parseInt(TILES_SIZE.width), 
                        parseInt(TILES_SIZE.height));
    }
}

function CreateField() {
    tiles = [];
    imagesLoaded = 0;
    let totalTiles = (GameArea.width / TILES_SIZE.width) * (GameArea.height / TILES_SIZE.height);

    for (let i = 0; i < GameArea.width / TILES_SIZE.width; i++) {
        for (let j = 0; j < GameArea.height / TILES_SIZE.height; j++) {
            let newtile = CreateTile();
            tiles.push(newtile);

            // 画像の読み込みを設定
            newtile.pic.onload = function() {
                imagesLoaded++;
                if (imagesLoaded === totalTiles) {
                    // すべての画像が読み込まれたら描画
                    console.log("loaded alldata.")
                    drawTiles();
                }
            };
        }
    }
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function CreateTile(){
    let number = getRandomInt(tile_number);

    try{
        if(number < 9) {
            return new Tile("manzu", number + 1);
        }
        else if (number < 18) {
            return new Tile("pinzu", number - 8);
        }
        else if (number < 25) {
            return new Tile("jihai", number - 17);
        }
        else throw new Error("選択された数値が不正です。");
    } catch (e){
        console.error("Error: ", e.message);
    }
    
}

let tiles = []; // ここにタイルの情報を格納する
let imagesLoaded = 0; // 読み込まれた画像の数

function drawTiles() {
    for (let tile of tiles) {
        let i = tiles.indexOf(tile) % (GameArea.width / TILES_SIZE.width);
        let j = Math.floor(tiles.indexOf(tile) / (GameArea.width / TILES_SIZE.width));
        let tileX = parseInt(GameArea.x + TILES_SIZE.width * i);
        let tileY = parseInt(GameArea.y + TILES_SIZE.height * j);
        
        ctx2d.drawImage(tile.pic, tileX, tileY, TILES_SIZE.width, TILES_SIZE.height);


        if (tile === firstSelectedTile || tile === secondSelectedTile || tile === thirdSelectedTile) {
            ctx2d.fillStyle = 'rgba(135, 206, 235, 0.5)';
            ctx2d.fillRect(tileX, tileY, TILES_SIZE.width, TILES_SIZE.height);
        }
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


function ValidateSecondTile(selectedTile, newTile) {
    console.log("Selected Tile:", selectedTile);
    console.log("New Tile:", newTile);

    // ここで隣接判定のロジックを実装（現在は単に情報を出力するだけ）
    // 例: return (条件判定);

    let firstTileIndex = tiles.indexOf(firstSelectedTile);
    let newTileIndex = tiles.indexOf(newTile);
    
    let firstTileRow = Math.floor(firstTileIndex / (GameArea.width / TILES_SIZE.width));
    let firstTileCol = firstTileIndex % (GameArea.width / TILES_SIZE.width);
    let newTileRow = Math.floor(newTileIndex / (GameArea.width / TILES_SIZE.width));
    let newTileCol = newTileIndex % (GameArea.width / TILES_SIZE.width);

    // 隣接するタイルは行または列が最大1つの差であることを確認
    return Math.abs(firstTileRow - newTileRow) <= 1 && Math.abs(firstTileCol - newTileCol) <= 1;
}

function ValidateThirdTile(firstSelectedTile, secondSelectedTile, newTile) {
    console.log("First Selected Tile:", firstSelectedTile);
    console.log("Second Selected Tile:", secondSelectedTile);
    console.log("New Tile:", newTile);

    let newTileIndex = tiles.indexOf(newTile);
    
    let newTileRow = Math.floor(newTileIndex / (GameArea.width / TILES_SIZE.width));
    let newTileCol = newTileIndex % (GameArea.width / TILES_SIZE.width);

    // 3番目のタイルが一つ目または二つ目のタイルの周囲のタイルか確認
    let firstTileIndex = tiles.indexOf(firstSelectedTile);
    let secondTileIndex = tiles.indexOf(secondSelectedTile);
    let firstTileRow = Math.floor(firstTileIndex / (GameArea.width / TILES_SIZE.width));
    let secondTileRow = Math.floor(secondTileIndex / (GameArea.width / TILES_SIZE.width));
    let firstTileCol = firstTileIndex % (GameArea.width / TILES_SIZE.width);
    let secondTileCol = secondTileIndex % (GameArea.width / TILES_SIZE.width);

    if (
        (Math.abs(newTileRow - firstTileRow) <= 1 && Math.abs(newTileCol - firstTileCol) <= 1) ||
        (Math.abs(newTileRow - secondTileRow) <= 1 && Math.abs(newTileCol - secondTileCol) <= 1)
    ) {
        return true;
    }
    
    // 3番目のタイルが一つ目または二つ目のタイルとも隣接していない場合
    return false;
}
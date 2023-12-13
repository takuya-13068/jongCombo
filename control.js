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

    let firstTileIndex = tiles.indexOf(firstSelectedTile);
    let newTileIndex = tiles.indexOf(newTile);
    
    let firstTileRow = Math.floor(firstTileIndex / (GameArea.width / TILES_SIZE.width));
    let firstTileCol = firstTileIndex % (GameArea.width / TILES_SIZE.width);
    let newTileRow = Math.floor(newTileIndex / (GameArea.width / TILES_SIZE.width));
    let newTileCol = newTileIndex % (GameArea.width / TILES_SIZE.width);

    // 隣接するタイルは行または列が最大1つの差であることを確認
    if(!(Math.abs(firstTileRow - newTileRow) <= 1 && Math.abs(firstTileCol - newTileCol) <= 1)) {
        return false;
    } else{
        //1-9:萬子, 10-18: 筒子, 19-25: 字牌
        const firstTileKind = selectedTile.kind;
        const newTileKind = newTile.kind;
        const firstTileNumber = selectedTile.value;
        const newTileNumber = newTile.value;

        if (firstTileKind === newTileKind) {
            if(firstTileKind === "manzu" || firstTileKind === "pinzu"){ //萬子, 筒子
                if(Math.abs(firstTileNumber - newTileNumber) <= 2 ) return true;
                else return false;
            } else{ //字牌
                if (firstTileNumber === newTileNumber) return true;
                else return false;
            }
        } else{
            return false;
        }
    }
}

function compareFunc(a, b) {
    return a - b;
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

    if (!(
        (Math.abs(newTileRow - firstTileRow) <= 1 && Math.abs(newTileCol - firstTileCol) <= 1) ||
        (Math.abs(newTileRow - secondTileRow) <= 1 && Math.abs(newTileCol - secondTileCol) <= 1)
    )) {
        return false;
    } else{
        //1-9:萬子, 10-18: 筒子, 19-25: 字牌
        const firstTileKind = firstSelectedTile.kind;
        const secondTileKind = secondSelectedTile.kind;
        const newTileKind = newTile.kind;
        const firstTileNumber = firstSelectedTile.value;
        const secondTileNumber = secondSelectedTile.value;
        const newTileNumber = newTile.value;

        if (firstTileKind === newTileKind && secondTileKind === newTileKind) {
            if(firstTileKind === "manzu" || firstTileKind === "pinzu"){ 
                //面子
                if (firstTileNumber === newTileNumber && secondTileNumber === newTileNumber) return true;
                //順子
                else{
                    let array = [firstTileNumber, secondTileNumber, newTileNumber];
                    array.sort(compareFunc);
                    if(array[1] - array[0] === 1 && array[2] - array[1] === 1 && !(array[1] === array[2])) return true;
                    else return false;
                }
            } else{
                if (firstTileNumber === newTileNumber && secondTileNumber === newTileNumber) return true;
                else return false;
            }
        } else{
            return false;
        }
    }

}
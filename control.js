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

function removeSelectedTiles() {
    // 選択されたタイルを消すロジック
}

function displayRemovedTiles() {
    // 消えたタイルを上部に表示するロジック
}

function dropTiles() {
    // タイルを下に移動させるロジック
}

function addNewTiles() {
    // 上部に新しいタイルを追加するロジック
}

function dropTiles(firstTileIndex, secondTileIndex, thirdTileIndex) {
    // 消えたタイルの列を特定
    let columnsToDrop = [firstTileIndex % (GameArea.width / TILES_SIZE.width),
                         secondTileIndex % (GameArea.width / TILES_SIZE.width),
                         thirdTileIndex % (GameArea.width / TILES_SIZE.width)];

    tiles.forEach(tile => {
        let tileIndex = tiles.indexOf(tile);
        let columnIndex = tileIndex % (GameArea.width / TILES_SIZE.width);

        if (columnsToDrop.includes(columnIndex)) {
            let j = Math.floor(tileIndex / (GameArea.width / TILES_SIZE.width));
            let newJ = j + 1; // 下に1マス移動
            if (newJ < (GameArea.height / TILES_SIZE.height)) {
                tile.x = parseInt(GameArea.x + TILES_SIZE.width * columnIndex);
                tile.y = parseInt(GameArea.y + TILES_SIZE.height * newJ);
            }
        }
    });

    addNewTiles(columnsToDrop);
}



function addNewTiles(columnsToAdd) {
    columnsToAdd.forEach(columnIndex => {
        for (let j = 0; j < 3; j++) { // 空いた3マス分のタイルを追加
            let newtile = CreateTile();
            newtile.x = parseInt(GameArea.x + TILES_SIZE.width * columnIndex);
            newtile.y = parseInt(GameArea.y + TILES_SIZE.height * j);
            tiles.push(newtile);
        }
    });
}




function removeSelectedTiles() {
    // 選択されたタイルのインデックスを取得
    let firstTileIndex = tiles.indexOf(firstSelectedTile);
    let secondTileIndex = tiles.indexOf(secondSelectedTile);
    let thirdTileIndex = tiles.indexOf(thirdSelectedTile);

    // 選択されたタイルを消す
    tiles = tiles.filter(tile => tile !== firstSelectedTile && tile !== secondSelectedTile && tile !== thirdSelectedTile);

    // 上にあるタイルを移動させるためのインデックスを更新
    dropTiles(firstTileIndex, secondTileIndex, thirdTileIndex);

    // 消されたタイルを記録
    removedTiles.push(firstSelectedTile, secondSelectedTile, thirdSelectedTile);
}


function displayRemovedTiles() {
    // 上部に表示するロジック
    let displayAreaHeight = HEIGHT * 1 / 10; // 上部の表示エリアの高さ
    ctx2d.clearRect(0, 0, WIDTH, displayAreaHeight); // 上部エリアのクリア

    removedTiles.forEach((tile, index) => {
        let displayX = (WIDTH / removedTiles.length) * index;
        let displayY = 0;
        ctx2d.drawImage(tile.pic, displayX, displayY, TILES_SIZE.width / 2, TILES_SIZE.height / 2); // サイズを半分にして表示
    });
}

function resetSelection() {
    firstSelectedTile = null;
    secondSelectedTile = null;
    thirdSelectedTile = null;
}
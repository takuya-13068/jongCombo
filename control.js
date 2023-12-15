


function compareFunc(a, b) {
    return a - b;
}

function drawTiles() {
    ctx2d.fillStyle = COLSET['green'];
    ctx2d.fillRect(0, 0, WIDTH, HEIGHT);

    for (let tile of tiles) {
        let i = tiles.indexOf(tile) % parseInt(GameArea.width / TILES_SIZE.width);
        let j = Math.floor(tiles.indexOf(tile) / parseInt(GameArea.width / TILES_SIZE.width));
        let tileX = parseInt(GameArea.x + TILES_SIZE.width * i);
        let tileY = parseInt(GameArea.y + TILES_SIZE.height * j);
        
        tile.draw(ctx2d, tileX + widthMargin/2, tileY + heightMargin/2); // Tileクラスのdrawメソッドを使ってタイルを描画

        tile.towardX = tileX + widthMargin/2;
        tile.towardY = tileY + heightMargin/2;
        tile.draw(); // Tileクラスのdrawメソッドを使ってタイルを描画

        if (tile === firstSelectedTile || tile === secondSelectedTile || tile === thirdSelectedTile) {
            if(reachMode) ctx2d.fillStyle = 'rgba(195, 60, 60, 0.5)';
            else ctx2d.fillStyle = 'rgba(135, 206, 235, 0.5)';
            ctx2d.fillRect(tileX, tileY, TILES_SIZE.width, TILES_SIZE.height);
        }
    }
}

function createField() {
    tiles = [];
    imagesLoaded = 0;
    
    totalTiles = TILES_VERTICAL*TILES_HORIZONTAL;

    for (var i = 0; i < totalTiles; i++){
        let pos = getTilePosFromIndex(i);
        let newtile = CreateTile(pos[0], pos[1] - TILES_SIZE.height);
        tiles[i] = newtile;

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

function loadButtons(){
    for (var i = 0; i < buttonList.length; i++){
        imageFiles[buttonList[i]] = new Image();
        imageFiles[buttonList[i]].src = './assets/img/button_' + buttonList[i]  + '.png';
        imageFiles[buttonList[i]].onload = function(){
            loadedImgCnt++;
        }
    }
}
function loadOtherImages(){
    for (var i = 0; i < otherImagesList.length; i++){
        imageFiles[otherImagesList[i]] = new Image();
        imageFiles[otherImagesList[i]].src = './assets/img/' + otherImagesList[i]  + '.webp';
        imageFiles[otherImagesList[i]].onload = function(){
            loadedImgCnt++;
        }
    }
}
function loadText(){
    for (var i = 0; i < textImageList.length; i++){
        imageFiles[textImageList[i]] = new Image();
        imageFiles[textImageList[i]].src = './assets/text/' + textImageList[i]  + '.webp';
        imageFiles[textImageList[i]].onload = function(){
            loadedImgCnt++;
        }
    }
}
function loadAnimation(){
    for (var i = 0; i < animationImagesList.length; i++){
        imageFiles[animationImagesList[i].id] = new Image();
        imageFiles[animationImagesList[i].id].src = './assets/animation/' + animationImagesList[i].id  + '.webp';
        imageFiles[animationImagesList[i].id].onload = function(){
            loadedImgCnt++;
        }
    }
}

function loadTileImages() {
    for (let kind in FILE_NAME_MAP) {
        let maxTiles = kind === 'jihai' ? 7 : 9;
        for (let i = 1; i <= maxTiles; i++) {
            let imageName = FILE_NAME_MAP[kind] + i + '_1';
            imageFiles.tiles[imageName] = new Image();
            imageFiles.tiles[imageName].src = './assets/img/' + imageName + '.gif';
            imageFiles.tiles[imageName].onload = function() {
                loadedImgCnt++;
                if (loadedImgCnt === totalTiles) {
                    setMode(0); // すべての画像が読み込まれたら、モードを変更
                }
            };
        }
    }
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function CreateTile(x, y){
    let number = getRandomInt(tile_number);

    try{
        if(number < 9) {
            return new Tile("manzu", number + 1, x, y);
        }
        else if (number < 18) {
            return new Tile("pinzu", number - 8, x, y);
        }
        else if (number < tile_number) {
            return new Tile("jihai", number - 17, x, y);
        }
        else throw new Error("選択された数値が不正です。");
    } catch (e){
        console.error("Error: ", e.message);
    }
}


function ValidateSecondTile(selectedTile, newTile, reachMode) {
    let firstTileIndex = tiles.indexOf(firstSelectedTile);
    let newTileIndex = tiles.indexOf(newTile);
    
    let firstTileRow = Math.floor(firstTileIndex / parseInt(GameArea.width / TILES_SIZE.width));
    let firstTileCol = firstTileIndex % parseInt(GameArea.width / TILES_SIZE.width);
    let newTileRow = Math.floor(newTileIndex / parseInt(GameArea.width / TILES_SIZE.width));
    let newTileCol = newTileIndex % parseInt(GameArea.width / TILES_SIZE.width);

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
            if(!reachMode){ 
                if(firstTileKind === "manzu" || firstTileKind === "pinzu"){ //萬子, 筒子
                    if(Math.abs(firstTileNumber - newTileNumber) <= 2 ) return true;
                    else return false;
                } else{ //字牌
                    if (firstTileNumber === newTileNumber) return true;
                    else return false;
                }
            } else if (firstTileNumber === newTileNumber) return true; //reachModeの時は雀頭判定だけ
            else return false;
        } else{
            return false;
        }
    }
}

function ValidateThirdTile(firstSelectedTile, secondSelectedTile, newTile) {
    let newTileIndex = tiles.indexOf(newTile);
    
    let newTileRow = Math.floor(newTileIndex / (GameArea.width / TILES_SIZE.width));
    let newTileCol = newTileIndex % (GameArea.width / TILES_SIZE.width);

    // 3番目のタイルが一つ目または二つ目のタイルの周囲のタイルか確認
    let firstTileIndex = tiles.indexOf(firstSelectedTile);
    let secondTileIndex = tiles.indexOf(secondSelectedTile);
    let firstTileRow = Math.floor(firstTileIndex / parseInt(GameArea.width / TILES_SIZE.width));
    let secondTileRow = Math.floor(secondTileIndex / parseInt(GameArea.width / TILES_SIZE.width));
    let firstTileCol = firstTileIndex % parseInt(GameArea.width / TILES_SIZE.width);
    let secondTileCol = secondTileIndex % parseInt(GameArea.width / TILES_SIZE.width);

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

function getTilePosFromIndex(tileIndex){
    var pos = [0, 0];
    pos[0] = tileIndex % TILES_HORIZONTAL * TILES_SIZE.width;
    pos[1] = GameArea.y + (tileIndex - tileIndex % TILES_HORIZONTAL) / TILES_VERTICAL;
    return pos;
}

function removeSelectedTiles() {
    // 選択されたタイルの情報を取得, 配列に追加
    let selectedTiles = [firstSelectedTile, secondSelectedTile, thirdSelectedTile];
    selectedTiles.sort((a, b) => a.value - b.value);
    removedTiles.push(...selectedTiles);

    // Score
    updateScore(firstSelectedTile, secondSelectedTile, thirdSelectedTile);

    // 選択されたタイルのインデックスを取得
    let selectedTileIndices = [tiles.indexOf(firstSelectedTile), tiles.indexOf(secondSelectedTile), tiles.indexOf(thirdSelectedTile)];
    selectedTileIndices = selectedTileIndices.sort(compareFunc);
    selectedTileIndices = [...new Set(selectedTileIndices)];

    // タイルを削除し、必要なタイルを移動
    selectedTileIndices.forEach(tileIndex => {
        while (tileIndex >= TILES_SIZE.row) {
            moveTileDown(tileIndex);
            tileIndex -= TILES_SIZE.row;
        }
        // 最上部のタイルを新規生成
        moveTileDown(tileIndex);
    });

    // タイルの再描画
    drawTiles();

    // 選択状態のリセット
    resetSelection();
}

function displayRemovedTiles() {
    let displayAreaHeight = HEIGHT * 1 / 10; // 上部の表示エリアの高さ

    removedTiles.forEach((tile, index) => {
        let displayX = index * TILES_SIZE.width;
        let displayY = GameArea.y - displayAreaHeight - 10; // GameAreaの少し上
        ctx2d.drawImage(tile.pic, displayX, displayY, TILES_SIZE.width / 2, TILES_SIZE.height / 2); // サイズを半分にして表示
    });
}

function resetSelection() {
    firstSelectedTile = null;
    secondSelectedTile = null;
    thirdSelectedTile = null;
}

function moveTileDown(tileIndex) {
    if (tileIndex < TILES_SIZE.row) {
        // 上のタイルがない場合は、新しいタイルを生成
        let pos = getTilePosFromIndex(tileIndex);
        tiles[tileIndex] = CreateTile(pos[0], pos[1]);
    } else {
        // 上のタイルを現在の位置に移動
        tiles[tileIndex] = tiles[tileIndex - TILES_SIZE.row];
    }
}

function updateScore(firstSelectedTile, secondSelectedTile, thirdSelectedTile){
    // combo score
    if(combo < 4) {
        combo += 1;
        gameData.score += 100 * (2 ** (combo - 1));
        combostart = performance.now() - initialPfnw;
        comboLimitTime = 5.0;
        if(combo === 4) reachMode = true;
    }

    // calculate role point

}
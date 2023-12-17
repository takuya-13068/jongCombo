function compareFunc(a, b) {
    return a - b;
}

function drawTiles() {
    ctx2d.fillStyle = COLSET['gray'];
    ctx2d.fillRect(0, GameArea.y - 20, WIDTH, HEIGHT);
    ctx2d.fillStyle = COLSET['yellow'];
    var myHeight = (HEIGHT - GameArea.y) * (comboLimitTime / COMBO_MAX_TIME);
    var myWidth = 10;
    if(myHeight > 1){
        ctx2d.drawImage(imageFiles['gauge_vertical'], 0, HEIGHT - myHeight, myWidth, myHeight);
        ctx2d.drawImage(imageFiles['gauge_vertical'], WIDTH - myWidth, HEIGHT - myHeight, myWidth, myHeight);    
    }

    for (let tile of tiles) {
        let i = tiles.indexOf(tile) % parseInt(GameArea.width / TILES_SIZE.width);
        let j = Math.floor(tiles.indexOf(tile) / parseInt(GameArea.width / TILES_SIZE.width));
        let tileX = parseInt(GameArea.x + TILES_SIZE.width * i);
        let tileY = parseInt(GameArea.y + TILES_SIZE.height * j);
        
        tile.towardX = tileX + widthMargin/2;
        tile.towardY = tileY + heightMargin/2;
        tile.draw(); // Tileクラスのdrawメソッドを使ってタイルを描画

        if (tile === firstSelectedTile || tile === secondSelectedTile || tile === thirdSelectedTile) {
            if(reachMode) ctx2d.fillStyle = 'rgba(195, 60, 60, 0.5)';
            else ctx2d.fillStyle = 'rgba(135, 206, 235, 0.5)';
            ctx2d.fillRect(tileX + widthMargin/2, tileY + heightMargin/2, TILES_SIZE.width, TILES_SIZE.height);
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
    
    let newTileRow = Math.floor(newTileIndex / parseInt(GameArea.width / TILES_SIZE.width));
    let newTileCol = newTileIndex % parseInt(GameArea.width / TILES_SIZE.width);

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
    pos[1] = GameArea.y + (tileIndex - tileIndex % TILES_HORIZONTAL) / TILES_HORIZONTAL * TILES_SIZE.height;
    return pos;
}

function removeSelectedTiles() {
    // 選択されたタイルの情報を取得, 配列に追加
    let selectedTiles;
    if(!reachMode) selectedTiles = [firstSelectedTile, secondSelectedTile, thirdSelectedTile];
    else selectedTiles = [firstSelectedTile, secondSelectedTile];

    selectedTiles.sort((a, b) => a.value - b.value);
    
    for(var i = 0; i < selectedTiles.length; i++){
        let displayX = removedTiles.length * TILES_SIZE.width * COMBO_TILE_SIZE_SCALE + 2;
        let displayY = GameArea.y - 87; // GameAreaの少し上
        tile = selectedTiles[i];
        gameObjList.push(new GroupTile(tile.kind, tile.value, displayX, displayY));
        gameObjList[gameObjList.length-1].x = tile.x;
        gameObjList[gameObjList.length-1].y = tile.y;
        removedTiles.push(selectedTiles[selectedTiles.length-3+i]);
    }

    // 選択されたタイルのインデックスを取得
    let selectedTileIndices;
    if(!reachMode) selectedTileIndices = [tiles.indexOf(firstSelectedTile), tiles.indexOf(secondSelectedTile), tiles.indexOf(thirdSelectedTile)];
    else selectedTileIndices = [tiles.indexOf(firstSelectedTile), tiles.indexOf(secondSelectedTile)];
    selectedTileIndices = selectedTileIndices.sort(compareFunc);
    selectedTileIndices = [...new Set(selectedTileIndices)];

    // Score
    updateScore();

    // タイルを削除し、必要なタイルを移動
    console.log(selectedTileIndices);
    selectedTileIndices.forEach(tileIndex => {
        // アニメーションの追加
        pos = getTilePosFromIndex(tileIndex);
        gameObjList.push(new MyAnimation(0, pos[0] + (TILES_SIZE.width - tileEffectSize)/2, pos[1] + (TILES_SIZE.height - tileEffectSize)/2, tileEffectSize, 30 * 15));

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

    deleteTileCnt = -1;
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

function updateScore(){
    // combo score
    if(combo < 4) {
        combo += 1;
        gameData.score += 100 * (2 ** (combo - 1));
        combostart = performance.now() - initialPfnw;
        comboLimitTime = COMBO_MAX_TIME;
        if(combo === 4) {
            reach.play();
            reachMode = true;
            gameObjList.push(new MyRichImage('reach_1', WIDTH /2 - 80 - 120, HEIGHT/2+100, 200, 8, 1000, 0));
            gameObjList.push(new MyRichImage('reach_2', WIDTH /2 + 80 - 120, HEIGHT/2+100, 200, 8, 1000, 300));
        }
        averagedX = (firstSelectedTile.x + secondSelectedTile.x + thirdSelectedTile.x)/3
        averagedY = (firstSelectedTile.y + secondSelectedTile.y + thirdSelectedTile.y)/3
        console.log(averagedX, averagedY);
        gameObjList.push(new MyRichImage(combo + '_kanji', averagedX - 30, averagedY, 60, 8, 500, 0));
        gameObjList.push(new MyRichImage('combo', averagedX+0, averagedY, 60, 8, 500, 0));
    } else if(reachMode){ // calculate role point
        // 役成立
        removedTiles.push(firstSelectedTile, secondSelectedTile);
        let displayX = removedTiles.length * TILES_SIZE.width * COMBO_TILE_SIZE_SCALE;
        let displayY = GameArea.y - 100; // GameAreaの少し上
        gameObjList.push(new GroupTile(firstSelectedTile.kind, firstSelectedTile.value, displayX, displayY));
        displayX = removedTiles.length * TILES_SIZE.width * COMBO_TILE_SIZE_SCALE;
        gameObjList.push(new GroupTile(secondSelectedTile.kind, firstSelectedTile.value, displayX, displayY));

        gameObjList.push(new MyAnimation(1, -WIDTH * 0.4, HEIGHT/2 - 100, WIDTH, 3000));
        gameObjList.push(new MyAnimation(1, -WIDTH * 0.1, HEIGHT/2 - 300, WIDTH * 1.8, 2000));
    
        gameObjList.push(new MyRichImage('agari_1', WIDTH /2 - 100 - 120, HEIGHT/2-20, 250, 8, 1000, 0));
        gameObjList.push(new MyRichImage('agari_2', WIDTH /2 + 100 - 120, HEIGHT/2-20, 250, 8, 1000, 300));

        calculateRole();

        // reset
        combo = 0;
        removedTiles = []; // Reset removedtile
        reachMode = false;
        gameObjList = gameObjList.filter(function(v){
            return v.constructor.name != 'GroupTile';
        })
        resetSelection();
    }
}

function validateOneNine(index){
    if (index == 1 || index == 9) return true;
    else return false;
}

function validateDragon(kind, value){
    if (kind == "jihai") return value
    else return -1
}

function calculateRole(){
    var role_set = [];
    var han = 0;
    var tile_set = []; // 牌情報
    var tiles_kind = []; //種類
    var tiles_style = []; //面子、順子判定
    var val = true;

    // 牌登録
    for(let i=0; i< 4; i++){
        tile_set[i] = [removedTiles[i*3], removedTiles[i*3+1], removedTiles[i*3+2]];
        tiles_kind[i] = tile_set[i][0].kind;
        if(tile_set[i][0].value === tile_set[i][1].value) tiles_style[i] = true; // 面子
        else tiles_style[i] = false; // 順子
    } 
    tile_set[4] = [firstSelectedTile, secondSelectedTile]; //雀頭
    tiles_kind[4] = tile_set[4][0].kind;

    //立直
    role_set.push("Reach");
    
    //タンヤオ
    val = true;
    if(!tiles_kind.includes("jihai") && !validateOneNine(tile_set[4][0].value)){
        for (const tiles_s of tile_set){
            if(validateOneNine(tiles_s[0].value) || validateOneNine(tiles_s[1].value) || validateOneNine(tiles_s[1].value)) {
                val = false;
                break
            }
        } if(val) role_set.push("All Simples");
    }

    //一盃口、二盃口
    var cnt = 0;
    var m=-1; n=-1;
    for (let i=0; i<4; i++){
        for(let j=i+1; j<4; j++){
            if(cnt == 0 && !tiles_style[i] && !tiles_style[j] && tiles_kind[i] == tiles_kind[j]){ //順子で種類が同じ
                if(tile_set[i][0] == tile_set[j][0] && tile_set[i][1] == tile_set[j][1] && tile_set[i][2] == tile_set[j][2]){
                    cnt += 1;
                    m=i;n=j;
                }
            } else if(i!=m && j!=n && !tiles_style[i] && !tiles_style[j] && tiles_kind[i] == tiles_kind[j]){
                if(tile_set[i][0] == tile_set[j][0] && tile_set[i][1] == tile_set[j][1] && tile_set[i][2] == tile_set[j][2]) cnt +=1;
            }
        }
    }
    if(cnt == 1)role_set.push("Double-Run");
    else if (cnt == 2) role_set.push("2 Double-Run");

    //一気通貫
    var cnt = 0;
    for(let i=0; i<4;i++){
        if (tile_set[i][0] == cnt*3+1 && tile_set[i][1] == cnt*3+2 && tile_set[i][2] == cnt*3+3)cnt += 1;
    } if(cnt >=3) role_set.push("Full Straight");

    //混一色、清一色
    var set_kind = Array.from(new Set(tiles_kind));
    if(set_kind.length == 1) role_set.push("Full Flush");
    else if(set_kind.length == 2 && set_kind.includes("jihai")) role_set.push("Half Flush");

    //三暗刻、四暗刻
    cnt_type = tiles_style.filter(value => value === true).length;
    if(cnt_type === 4) {
        if(!deleteflg) role_set.push("Four Triples");
        else role_set.push("All Triples");
    } else if(cnt_type === 3 && !deleteflg) role_set.push("Three Triples");

    // 小三元、大三元
    var little = [false, false, false];
    var big = [false, false, false];
    const jud_dragon = [{kind: tiles_kind[0], value: tile_set[0][0].value}, 
                        {kind: tiles_kind[1], value: tile_set[1][0].value},
                        {kind: tiles_kind[2], value: tile_set[2][0].value},
                        {kind: tiles_kind[3], value: tile_set[3][0].value},
                        {kind: tiles_kind[4], value: tile_set[4][0].value}]
    for (let i=0; i<5; i++){
        out = validateDragon(jud_dragon[i].kind, jud_dragon[i].value);
        if(out != -1){
            console.log(out);
            if(i != 4){
                big[out-1] = true;
                little[out-1] = true;
            } else{
                little[out-1] = true;
            }
        } 
    }
    if(!big.includes(false)) role_set.push("Big Dragons");
    else if(!little.includes(false)) role_set.push("Little Dragons");


    // 名称から飜計算
    console.log(role_set);
    console.log(han);
    for (const name of role_set){
        console.log(name);
        han += role[name].han;
    } 
    console.log(han);
    if(han > 13) gameData.score += 32000;
    else gameData.score+= role_score[han];

    // エフェクトここから
    console.log(role_set);
    var roleEffectSize = ROLE_EFFECT_SIZE_BASE / Math.max(4, role_set.length + 1);
    for(var i = 0; i < role_set.length; i++){
        console.log(role_set[i], role[role_set[i]]);
        gameObjList.push(new MyRichImage(role[role_set[i]].fileName, WIDTH/2 - roleEffectSize * 300 / 120 / 2, HEIGHT*0.66 + i * roleEffectSize * ROLE_MARGIN_COEFFICIENT, roleEffectSize, 9, 1500, i * 400));
    }
    var displayHan = han;
    roleEffectSize*=1.4;
    if(displayHan <= 9){
        // 役満・数え役満は何も出さない
        gameObjList.push(new MyRichImage('role_han_back', WIDTH/2 - 105, HEIGHT*0.66 + role_set.length * roleEffectSize * ROLE_MARGIN_COEFFICIENT * 0.8, roleEffectSize, 11, 750, role_set.length * 300));
        gameObjList.push(new MyRichImage(displayHan, WIDTH/2 - 55, HEIGHT*0.66 + role_set.length * roleEffectSize * ROLE_MARGIN_COEFFICIENT * 0.8, roleEffectSize, 11, 750, role_set.length * 300));
        gameObjList.push(new MyRichImage('han', WIDTH/2 + 0, HEIGHT*0.66 + role_set.length * roleEffectSize * ROLE_MARGIN_COEFFICIENT * 0.8, roleEffectSize, 11, 750, role_set.length * 300));    
    }
    for(var i = 0; i < Math.min(5, displayHan); i++){
        myX = Math.random();
        myY = Math.random();
        myTime = 100 + 200 * Math.random();
        gameObjList.push(new MyAnimation(2, -100 + WIDTH * myX, HEIGHT * 0.4 + 0.6 * HEIGHT * myY - 150, 300, myTime));
    }
}
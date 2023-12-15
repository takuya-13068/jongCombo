function getTileAtPosition(x, y) { // x, y 座標にあるタイルを見つけて返す
    for (let tile of tiles) {
        let i = tiles.indexOf(tile) % parseInt(GameArea.width / TILES_SIZE.width);
        let j = Math.floor(tiles.indexOf(tile) / parseInt(GameArea.width / TILES_SIZE.width));
        let tileX = parseInt(GameArea.x + TILES_SIZE.width * i);
        let tileY = parseInt(GameArea.y + TILES_SIZE.height * j);

        if (x >= tileX && x < tileX + TILES_SIZE.width && y >= tileY && y < tileY + TILES_SIZE.height) {
            return tile;
        }
    }
    return null;
}

function touchStartEvent(){
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        let touch = e.touches[0];
        const touchStartX = touch.clientX - rect.left;
        const touchStartY = touch.clientY - rect.top;
        const   scaleWidth =  canvas.clientWidth / canvas.width,
                scaleHeight =  canvas.clientHeight / canvas.height;
        const   x = Math.floor( touchStartX / scaleWidth),
                y = Math.floor( touchStartY / scaleHeight);
        if (mode === 0){
            checkClickOfTitleObj(x, y);
        } else if(mode === 2){
            checkClickOfResultObj(x, y);
        } else if(mode === 1){
            checkClickOfGameObj(x, y);
            firstSelectedTile = getTileAtPosition(x, y);
        }

    }, { passive: false });
}

function touchMoveEvent(){
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        let touch = e.touches[0];
        const touchStartX = touch.clientX - rect.left;
        const touchStartY = touch.clientY - rect.top;
        const   scaleWidth =  canvas.clientWidth / canvas.width,
                scaleHeight =  canvas.clientHeight / canvas.height;
        const   x = Math.floor( touchStartX / scaleWidth),
                y = Math.floor( touchStartY / scaleHeight);
    
        let currentTile = getTileAtPosition(x, y);
        if (currentTile) {
            if (!firstSelectedTile) {
                firstSelectedTile = currentTile;
                select.play();
            } else if (!secondSelectedTile && currentTile !== firstSelectedTile && ValidateSecondTile(firstSelectedTile, currentTile, reachMode)) {
                secondSelectedTile = currentTile;
                select.play();
            } else if (secondSelectedTile && currentTile !== firstSelectedTile && currentTile !== secondSelectedTile && ValidateThirdTile(firstSelectedTile, secondSelectedTile, currentTile)) {
                thirdSelectedTile = currentTile;
                select.play();
            }
            drawTiles(); // タイルを再描画
        }
        
    }, { passive: false });
}

function touchEndEvent(){
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        resetSelection();
    }, { passive: false });
}

function clickEvent(){
    // ❗デバッグ用で残してるだけ　内容はtouchと被りあり❗
    canvas.addEventListener('click', function(event) {
        // クリックされた座標を取得
        const rect = canvas.getBoundingClientRect();
        const   viewX = event.clientX - rect.left,
                viewY = event.clientY - rect.top;
        const   scaleWidth =  canvas.clientWidth / canvas.width,
                scaleHeight =  canvas.clientHeight / canvas.height;
        const   x = Math.floor( viewX / scaleWidth),
                y = Math.floor( viewY / scaleHeight);

        if (mode == 0){
            checkClickOfTitleObj(x, y);
        } else if(mode == 2){
            checkClickOfResultObj(x, y);
        } else if (mode == 1) {
            let clickedTile = null;
            let canSelect = true; // タイルが選択可能かどうかのフラグ
            checkClickOfGameObj (x, y);
        
            for (let tile of tiles) { //選択されたタイルの情報をとる
                let i = tiles.indexOf(tile) % parseInt(GameArea.width / TILES_SIZE.width);
                let j = Math.floor(tiles.indexOf(tile) / parseInt(GameArea.width / TILES_SIZE.width));
                let tileX = parseInt(GameArea.x + TILES_SIZE.width * i);
                let tileY = parseInt(GameArea.y + TILES_SIZE.height * j);
        
                if (x >= tileX && x < tileX + TILES_SIZE.width && y >= tileY && y < tileY + TILES_SIZE.height) {
                    clickedTile = tile;
                    break; // タイルがクリックされたらループを抜ける
                }
            }
        
            if (clickedTile) { // 選択できるか条件
                console.log("clikced!");
                // 選択解除
                if (clickedTile === firstSelectedTile) {
                    firstSelectedTile = null;
                } else if (clickedTile === secondSelectedTile) {
                    secondSelectedTile = null;
                } else if (clickedTile === thirdSelectedTile) {
                    thirdSelectedTile = null;
                } 
                //何個目の選択タイルか判定
                else if (!firstSelectedTile) { // 1番目のタイルを選択
                    firstSelectedTile = clickedTile; 
                } else if (!secondSelectedTile && ValidateSecondTile(firstSelectedTile, clickedTile, reachMode)) { // 2番目のタイルを選択
                    secondSelectedTile = clickedTile; 
                } else if (secondSelectedTile && ValidateThirdTile(firstSelectedTile, secondSelectedTile, clickedTile)) { // 3番目のタイルを選択
                    thirdSelectedTile = clickedTile; 
                } else {
                    canSelect = false; // タイルが選択できない場合
                }
        
                console.log("Selected Tile:", clickedTile); // 選択したタイルの情報を出力
                drawTiles(); // タイルを再描画
            }
        } 
    });
}

function checkClickOfTitleObj(x, y){
    for(var i = 0; i < titleObjList.length; i++){
        if(titleObjList[i].constructor.name == 'Button'){
            if(titleObjList[i].checkClicked(x, y)){
                titleObjList[i].clicked();
            }
        }
    }
}
function checkClickOfResultObj(x, y){
    for(i = 0; i < resultObjList.length; i++){
        if(resultObjList[i].constructor.name == 'Button'){
            if(resultObjList[i].checkClicked(x, y)){
                resultObjList[i].clicked();
            }
        }
    }
}
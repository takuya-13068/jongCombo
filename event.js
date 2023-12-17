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
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
        if (mode === 0){
            checkClickOfTitleObj(x, y);
        } else if(mode === 2){
            checkClickOfResultObj(x, y);
        } else if(mode === 1){
            checkClickOfGameObj(x, y);
            firstSelectedTile = getTileAtPosition(x, y);
            select.play();
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
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
            
    
        let currentTile = getTileAtPosition(x, y);
        if (currentTile) {
            if (!firstSelectedTile) {
                firstSelectedTile = currentTile;
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
        if(mode ===1 && !secondSelectedTile){
            if(deleteTileCnt != -1){
                const rect = canvas.getBoundingClientRect();
                let touch = e.touches[0];
                const touchStartX = lastTouchX - rect.left;
                const touchStartY = lastTouchY - rect.top;
                const   scaleWidth =  canvas.clientWidth / canvas.width,
                        scaleHeight =  canvas.clientHeight / canvas.height;
                const   x = Math.floor( touchStartX / scaleWidth),
                        y = Math.floor( touchStartY / scaleHeight);
                
                let currentTile = getTileAtPosition(x, y);
                deleteIndex = tiles.indexOf(currentTile);
                while (deleteIndex >= TILES_SIZE.row) {
                    moveTileDown(deleteIndex);
                    deleteIndex -= TILES_SIZE.row;
                }
                // 最上部のタイルを新規生成
                moveTileDown(deleteIndex);

                //スコアを少し減らす
                if(currentTile != null){
                    deleteTileCnt += 1;
                    deleteflg = true;
                    gameData.score = Math.max(0, gameData.score - 50*deleteTileCnt);
                }
            } else{
                deleteTileCnt += 1;
                deleteflg = true;
            }
        }
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
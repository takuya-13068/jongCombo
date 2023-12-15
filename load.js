
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
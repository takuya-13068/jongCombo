function fadeInBlackout(callback) {
    const blackout = document.getElementById('blackout');
    blackout.style.display = 'block';
    setTimeout(function() {
        blackout.style.opacity = 1;
        setTimeout(callback, 500); // 0.5秒後にコールバック
    }, 10); // レンダリング後に透明度を変更
}

function fadeOutBlackout() {
    const blackout = document.getElementById('blackout');
    blackout.style.opacity = 0;
    setTimeout(function() {
        blackout.style.display = 'none';
    }, 500); // 0.5秒後に非表示
}
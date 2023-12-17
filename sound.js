const mainBGM = new Howl({
    //複数のファイル形式を指定可能。配列順に評価しそのブラウザが対応するファイル形式を再生します。
    src      : ['./assets/sound/mainGame2.mp3', './assets/sound/mainGame.mp3'],
    //自動再生
    autoplay : false,
    //ループ再生
    loop     : true,
    //音量 0〜1.0
    volume   : 0.2,
    //再生速度 0.5〜4.0 （1.0がデフォルト）
    rate     : 1.0,
    //再生開始位置と終了位置の秒数をミリ秒で指定
    sprite   : {
      /*
      * offset Number 再生開始位置（ミリ秒）
      * duration Number 終了位置（ミリ秒）
      * loop Boolean ループするかどうか。デフォルトはfalse。省略可
      */
    },
    //再生終了時のコールバック
    onend    : () => {
      console.log('Finished!');
    }
});
  
  //spriteを再生
//sound.play('key1');
  
const fallSet = new Howl({
    src      : ['./assets/sound/fallSetTile.mp3'],
    autoplay : false,
    loop     : false,
    volume   : 0.5,
    rate     : 1.0,
    
});

const select = new Howl({
    src      : ['./assets/sound/selectTile.mp3'],
    autoplay : false,
    loop     : false,
    volume   : 0.5,
    rate     : 1.0,
});
  
const reach = new Howl({
    src      : ['./assets/sound/reach.mp3', './assets/sound/reach.m4a'],
    autoplay : false,
    loop     : false,
    volume   : 0.5,
    rate     : 1.0,
});

const startGameClick = new Howl({
    src      : ['./assets/sound/click.mp3'],
    autoplay : false,
    loop     : false,
    volume   : 0.8,
    rate     : 1.0,
    onend: function(){
        mainBGM.play();
        mainBGM.fade(0,1,2000);
    }
});
  
const miss = new Howl({
    src      : ['./assets/sound/miss.mp3'],
    autoplay : false,
    loop     : false,
    volume   : 0.5,
    rate     : 1.0,
});

const getSet = new Howl({
    src      : ['./assets/sound/set.mp3'],
    autoplay : false,
    loop     : false,
    volume   : 1.0,
    rate     : 1.0,
});

const getRole = new Howl({
    src      : ['./assets/sound/role.mp3'],
    autoplay : false,
    loop     : false,
    volume   : 1.0,
    rate     : 1.0,
});

const gameStop = new Howl({
    src      : ['./assets/sound/stop.mp3'],
    autoplay : false,
    loop     : false,
    volume   : 0.4,
    rate     : 1.0,
});

const mainBGM = new Howl({
    //複数のファイル形式を指定可能。配列順に評価しそのブラウザが対応するファイル形式を再生します。
    src      : ['./assets/sound/mainGame.mp3'],
    //自動再生
    autoplay : false,
    //ループ再生
    loop     : true,
    //音量 0〜1.0
    volume   : 0.5,
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
    //複数のファイル形式を指定可能。配列順に評価しそのブラウザが対応するファイル形式を再生します。
    src      : ['./assets/sound/fallSetTile.mp3'],
    //自動再生
    autoplay : false,
    //ループ再生
    loop     : false,
    //音量 0〜1.0
    volume   : 0.5,
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

const select = new Howl({
    //複数のファイル形式を指定可能。配列順に評価しそのブラウザが対応するファイル形式を再生します。
    src      : ['./assets/sound/selectTile.mp3'],
    //自動再生
    autoplay : false,
    //ループ再生
    loop     : false,
    //音量 0〜1.0
    volume   : 0.5,
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
  
  
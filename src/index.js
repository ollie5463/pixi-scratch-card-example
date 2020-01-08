let app;

// let spritesOnScreen = [];
let gameContainer;

const resources = [
    'resources/win_up_to_1k.png',
    'resources/play_button.png',
    'resources/play_button_active.png',
    'resources/game_panel_01.png',
    'resources/coin_spin/coin0001.png',
    'resources/coin_spin/coin0002.png',
    'resources/coin_spin/coin0003.png',
    'resources/coin_spin/coin0004.png',
    'resources/coin_spin/coin0005.png',
    'resources/coin_spin/coin0006.png',
    'resources/coin_spin/coin0007.png',
    'resources/coin_spin/coin0008.png',
    'resources/coin_spin/coin0009.png',
    'resources/coin_spin/coin00010.png',
    'resources/coin_spin/coin00011.png',
    'resources/coin_spin/coin00012.png',
    'resources/coin_spin/coin00013.png',
    'resources/coin_spin/coin00014.png',
    'resources/coin_spin/coin00015.png',
    'resources/coin_spin/coin00016.png',
    'resources/coin_spin/coin00017.png',
    'resources/coin_spin/coin00018.png',
    'resources/coin_spin/coin00019.png',
    'resources/coin_spin/coin00020.png',
    'resources/coin_spin/coin00021.png',
    'resources/coin_spin/coin00022.png',
    'resources/coin_spin/coin00023.png'
];

window.onload = function () {
    app = new PIXI.Application({
        width: 800,
        height: 600,
        backgroundColor: 0xAAAAAA
    });
    document.body.appendChild(app.view);

    app.loader.add(resources).load(handleLoadComplete);

    function handleLoadComplete() {
        createGame();
        app.ticker.add(animate);
    }

    function animate() {
    }
}

const createGame = () => {
    app.stage.addChild(createHomeScreen());
};


const createHomeScreen = () => {
    gameContainer = new PIXI.Container();

    const winUpToTexture = app.loader.resources['resources/win_up_to_1k.png'].texture;
    const winUpToTextureSprite = new PIXI.Sprite(winUpToTexture);
    winUpToTextureSprite.anchor.set(0.5);
    winUpToTextureSprite.x = app.renderer.screen.width / 2;
    winUpToTextureSprite.y = 100;
    TweenMax.fromTo(winUpToTextureSprite, 1, { alpha: 0 }, { alpha: 1 });

    const playTexture = app.loader.resources['resources/play_button.png'].texture;
    const playSprite = new PIXI.Sprite(playTexture);
    playSprite.interactive = true;
    playSprite.mouseover = () => {
        playSprite.texture = app.loader.resources['resources/play_button_active.png'].texture;
    };
    playSprite.mouseout = () => {
        playSprite.texture = app.loader.resources['resources/play_button.png'].texture;
    };
    playSprite.on('click', () => {
        cleanGameContainer().then(() => {
            createBonusPage();
        });
    });
    playSprite.anchor.set(0.5);
    playSprite.x = app.renderer.screen.width / 2;
    playSprite.y = 300;
    TweenMax.fromTo(playSprite, 1, { alpha: 0 }, { alpha: 1 });

    gameContainer.addChild(winUpToTextureSprite);
    gameContainer.addChild(playSprite);
    return gameContainer;
};

const createBonusPage = () => {
    gameContainer = new PIXI.Container();
    const texture = app.loader.resources['resources/game_panel_01.png'].texture;
    const sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.x = app.renderer.screen.width / 2;
    sprite.y = 300;
    gameContainer.addChild(sprite);
    app.stage.addChild(gameContainer);
};

const cleanGameContainer = () => {
    return new Promise((resolve) => {
        TweenMax.fromTo(gameContainer, 1, { alpha: 1 }, { alpha: 0, onComplete: () => { 
            app.stage.removeChild(gameContainer);
            gameContainer.destroy();
            resolve();
        }});
    });
}

import * as PIXI from 'pixi.js';
import * as eventEmitter from 'events';
import gsap from 'gsap';

var app;
var eventController;

let gameContainer;

const resources = [
    'resources/win_up_to_1k.png',
    'resources/play_button.png',
    'resources/play_button_active.png',
    'resources/game_panel_01.png',
    'resources/coin_spin/coin_spin.json'
];

window.onload = function () {
    eventController = new eventEmitter.EventEmitter();
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

    eventController.on('playClicked', () => {
        cleanGameContainer().then(() => {
            createBonusPage();
        });
    });
    eventController.on('coinClicked', () => {
        gameContainer.removeChild(sprite);
        animateCoin(23);
    });


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
    gsap.fromTo(winUpToTextureSprite, 1, { alpha: 0 }, { alpha: 1 });

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
        eventController.emit('playClicked');
        cleanGameContainer().then(() => {
            createBonusPage();
        });
    });
    playSprite.anchor.set(0.5);
    playSprite.x = app.renderer.screen.width / 2;
    playSprite.y = 300;
    gsap.fromTo(playSprite, 1, { alpha: 0 }, { alpha: 1 });

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
    createStaticCoin();
    gsap.fromTo(gameContainer, 1, { alpha: 0 }, { alpha: 1 });
    app.stage.addChild(gameContainer);
};

const createStaticCoin = () => {
    const texture = PIXI.Texture.fromFrame(0);
    const sprite = new PIXI.Sprite(texture);
    sprite.x = app.renderer.screen.width / 2;
    sprite.y = app.renderer.screen.height / 2;
    sprite.anchor.set(0.5);
    sprite.interactive = true;
    sprite.on('click', () => {
        eventController.emit('coinClicked');
    });
    gameContainer.addChild(sprite);
};

const animateCoin = (numberOfFrames) => {
    const animatedCoinTextures = [];
    for (let i = 0; i < numberOfFrames; i++){
        const texture = PIXI.Texture.fromFrame(`${i}`);
        animatedCoinTextures.push(texture);
    }

    const animatedCoin = new PIXI.extras.AnimatedSprite(animatedCoinTextures);
    animatedCoin.x = app.renderer.screen.width / 2;
    animatedCoin.y = app.renderer.screen.height / 2;
    animatedCoin.anchor.set(0.5);
    animatedCoin.gotoAndPlay(0);
    gsap.fromTo(animatedCoin, 1, { scale: 1 }, { scale: 0 }).delay(2);
    gameContainer.addChild(animatedCoin);
};

const cleanGameContainer = () => {
    return new Promise((resolve) => {
        gsap.fromTo(gameContainer, 1, { alpha: 1 }, { alpha: 0, onComplete: () => { 
            app.stage.removeChild(gameContainer);
            gameContainer.destroy();
            resolve();
        }});
    });
}

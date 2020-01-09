import * as PIXI from 'pixi.js';
import * as eventEmitter from 'events';
import { Bounce } from 'gsap';
import { TweenMax } from 'gsap';

var app;
var eventController;

let gameContainer;
let listOfPrizes = [1, 2, 3, 5, 10, 20, 100, 1000];

const resources = [
    'resources/spritesheet.json'
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
        handleSpritesheetCreation();
        createGame();
        app.ticker.add(animate);
    }

    eventController.once('playClicked', () => {
        cleanGameContainer().then(() => {
            createBonusPage();
        });
    });
    eventController.once('coinClicked', () => {
        animateCoin(24);
    });
    eventController.once('coinDisappeared', () => {
        const randomWinAmount = getRandomWinAmount();
        createWinAmount(randomWinAmount);
        if (randomWinAmount >= 100) {
            createCongratulationsMessage(randomWinAmount);     
        }
    });


    function animate() {
    }
}
const handleSpritesheetCreation = () => {
    app.loader.resources['resources/spritesheet.json'].data.frames.forEach((texture) => {
        const frameOrig = new PIXI.Rectangle(0, 0, texture.sourceSize.w, texture.sourceSize.h);
        const frameRect = new PIXI.Rectangle(texture.frame.x, texture.frame.y, texture.frame.w, texture.frame.h);
        const newTexture = new PIXI.Texture(app.loader.resources['resources/spritesheet.json_image'].texture, frameRect, frameOrig, null);
        app.loader.resources[texture.filename] = {
            texture: newTexture,
            url: texture.filename
        }
        PIXI.utils.TextureCache[texture.filename] = texture;
    })
}

const createGame = () => {
    app.stage.addChild(createHomeScreen());
};


const createHomeScreen = () => {
    gameContainer = new PIXI.Container();
    const winUpToTexture = app.loader.resources['win_up_to_1k.png'].texture;
    const winUpToTextureSprite = new PIXI.Sprite(winUpToTexture);
    winUpToTextureSprite.anchor.set(0.5);
    winUpToTextureSprite.x = app.renderer.screen.width / 2;
    winUpToTextureSprite.y = 100;
    TweenMax.fromTo(winUpToTextureSprite, 1, { alpha: 0 }, { alpha: 1 });

    const playTexture = app.loader.resources['play_button.png'].texture;
    const playSprite = new PIXI.Sprite(playTexture);
    playSprite.interactive = true;
    playSprite.mouseover = () => {
        playSprite.texture = app.loader.resources['play_button_active.png'].texture;
    };
    playSprite.mouseout = () => {
        playSprite.texture = app.loader.resources['play_button.png'].texture;
    };
    playSprite.on('click', () => {
        eventController.emit('playClicked');
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
    const texture = app.loader.resources['game_panel_01.png'].texture;
    const sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.x = app.renderer.screen.width / 2;
    sprite.y = 300;
    gameContainer.addChild(sprite);
    createStaticCoin();
    TweenMax.fromTo(gameContainer, 1, { alpha: 0 }, { alpha: 1 });
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
        gameContainer.removeChild(sprite);
        sprite.destroy();
        eventController.emit('coinClicked');
    });
    gameContainer.addChild(sprite);
};

const getRandomWinAmount = () => listOfPrizes[Math.round((listOfPrizes.length * Math.random()) - 1)];


const createWinAmount = (winAmount) => {
    const texture = app.loader.resources[`prize_${winAmount}.png`].texture;
    const sprite = new PIXI.Sprite(texture);
    sprite.x = app.renderer.screen.width / 2;
    sprite.y = app.renderer.screen.height / 2;
    sprite.anchor.set(0.5);
    sprite.tint = Math.random() * 0xFFFFFF;
    TweenMax.fromTo(sprite, 1, { width: 0, height: 0 },
        { width: sprite.width, height: sprite.height, ease: Bounce.easeIn}); 
    gameContainer.addChild(sprite);
}

const createCongratulationsMessage = () => {
    const texture = app.loader.resources['win_txt.png'].texture;
    const sprite = new PIXI.Sprite(texture);
    sprite.x = app.renderer.screen.width / 2;
    sprite.y = 100;
    sprite.scale.set(0.4);
    sprite.anchor.set(0.5);
    TweenMax.fromTo(sprite, 1, { width: 0, height: 0 },
        { width: sprite.width, height: sprite.height, ease: Bounce.easeIn})
    gameContainer.addChild(sprite);
}

const animateCoin = (numberOfFrames) => {
    const animatedCoinTextures = [];
    for (let i = 1; i < numberOfFrames; i++){
        const texture = app.loader.resources[`coin${i}.png`].texture;
        animatedCoinTextures.push(texture);
    }

    const animatedCoin = new PIXI.extras.AnimatedSprite(animatedCoinTextures);
    animatedCoin.x = app.renderer.screen.width / 2;
    animatedCoin.y = app.renderer.screen.height / 2;
    animatedCoin.anchor.set(0.5);
    animatedCoin.gotoAndPlay(0);
    TweenMax.to(animatedCoin, 1, {
        width: 0, height: 0, onComplete: () => {
            eventController.emit('coinDisappeared');
        }
    });
    gameContainer.addChild(animatedCoin);
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

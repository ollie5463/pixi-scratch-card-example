let app;

window.onload = function () {
    app = new PIXI.Application({
        width: 800,
        height: 600,
        backgroundColor: 0xAAAAAA
    });
    document.body.appendChild(app.view);

    app.loader.add('src/sprite.png').load(handleLoadComplete);
    console.log(PIXI.utils.TextureCache);

    let img;

    function handleLoadComplete() {
        let texture = app.loader.resources['src/sprite.png'].texture;
        img = new PIXI.Sprite(texture);
        img.anchor.x = 0.5;
        img.anchor.y = 0.5;
        app.stage.addChild(img);

        app.ticker.add(animate);
    }

    function animate() {
        img.x = app.renderer.screen.width / 2;
        img.y = app.renderer.screen.height / 2;
        img.rotation += 0.1;
    }
}

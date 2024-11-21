import k from "./kaplayCtx";
import game from "./scenes/game";
import mainMenu from "./scenes/mainMenu";

// We use loadAseprite to load a visual

k.loadSprite("chemical-bg", "graphics/chemical-bg.png");
k.loadSprite("platforms", "graphics/platforms.png");
k.loadSprite("sonic", "graphics/sonic.png", {
    sliceX: 8, // How many frames per rows
    sliceY: 2, // How many frames per coloumns
    anims: {
        run: { from: 0, to: 7, loop: true, speed: 30 },
        jump: { from: 8, to: 15, loop: true, speed: 100 },
    },
});
k.loadSprite("ring", "graphics/ring.png", {
    sliceX: 16,
    sliceY: 1,
    anims: {
        spin: { from: 0, to: 15, loop: true, speed: 30 },
    },
});
k.loadSprite("motobug", "graphics/motobug.png", {
    sliceX: 5,
    sliceY: 1,
    anims: {
        run: { from: 0, to: 4, loop: true, speed: 8 },
    },
});

// Now we load the font

k.loadFont("mania", "fonts/mania.ttf");

// Then we load the sounds assets

k.loadSound("destroy", "sounds/Destroy.wav");
k.loadSound("hurt", "sounds/Hurt.wav");
k.loadSound("hyper-ring", "sounds/HyperRing.wav");
k.loadSound("jump", "sounds/Jump.wav");
k.loadSound("ring", "sounds/Ring.wav");
k.loadSound("city", "sounds/city.mp3");

k.scene("main-menu", mainMenu);

k.scene("game", game);

k.scene("game-over", () => { });

k.go("main-menu");

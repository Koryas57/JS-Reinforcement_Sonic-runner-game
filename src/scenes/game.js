import { makeSonic } from "../entities/sonic";
import k from "../kaplayCtx";

export default function game() {
    k.setGravity(3100); // Gravity is useless whitout body component to interact with

    const bgPieceWidth = 1920;
    const bgPieces = [
        k.add([k.sprite("chemical-bg"), k.pos(0, 0), k.scale(2), k.opacity(0.8),]),
        k.add([
            k.sprite("chemical-bg"),
            k.pos(bgPieceWidth * 2, 0),
            k.scale(2),
            k.opacity(0.8),
        ]),
    ];

    const platformsWidth = 1280;
    const platforms = [
        k.add([k.sprite("platforms"), k.pos(0, 450), k.scale(4)]),
        k.add([k.sprite("platforms"), k.pos(platformsWidth, 450), k.scale(4)]),
    ];

    // Spawning entity
    const sonic = makeSonic(k.vec2(200, 745));

    // Controls settings
    sonic.setControls();
    sonic.setEvents();

    // Speed settings
    let gameSpeed = 300;
    k.loop(1, () => { // In seconds
        gameSpeed += 50;
        console.log("Higher Speed")
    });

    // Setting up the "plateform" where the entitie stand to not be affected by physics
    k.add([
        k.rect(1920, 300),
        k.opacity(0),
        k.area(),
        k.pos(0, 832),
        k.body({ isStatic: true }),
        // tags are really usefull in case of using collisions
    ]);

    // Refreshing method explained in mainMenu.js
    k.onUpdate(() => {

        if (bgPieces[1].pos.x < 0) {
            bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
            bgPieces.push(bgPieces.shift());
        }

        bgPieces[0].move(-100, 0);
        bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

        if (platforms[1].pos.x < 0) {
            platforms[0].moveTo(platforms[1].pos.x + platformsWidth * 4, 450);
            platforms.push(platforms.shift());
        }

        // As gameSpeed value increase, the platform[0] will speed up it translation giving an illusion of progressive running speed
        platforms[0].move(-gameSpeed, 0);
        platforms[1].moveTo(platforms[0].pos.x + platformsWidth * 4, 450);

        // Bakcground moving in reversed according to sonic vertical position
        bgPieces[0].moveTo(bgPieces[0].pos.x, -sonic.pos.y / 20 - 50);
        bgPieces[1].moveTo(bgPieces[1].pos.x, -sonic.pos.y / 20 - 50);
    });
}
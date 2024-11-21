import k from "../kaplayCtx";
import { makeSonic } from "../entities/sonic";

export default function mainMenu() {

    // First, we set the high score logic
    if (!k.getData("best-score")) k.setData("best-score", 0);
    // onButtonPress is an event handler, it take as 1st parameter the key we want to listen on, then, when the key is pressed, it is going to run the function that is passed as the second parameter. Here we call the .go function with "game" key to change the scene to the one where the actual game is.
    k.onButtonPress("jump", () => k.go("game"));

    const bgPieceWidth = 1920;
    const bgPieces = [
        // We create and position a game object with the sprite selected. k.area() to see hit-boxes
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
        k.add([k.sprite("platforms"), k.pos(platformsWidth * 4, 450), k.scale(4)]),
    ];


    k.add([
        k.text("SONIC RUSH ADVENTURES", { font: "mania", size: 96 }),
        k.pos(k.center().x, 200), // .center return a Vec2 that we can use to specify a position
        k.anchor("center"), // Set the origin from the top left corner to the center
    ]);


    k.add([
        k.text("Press Space/Click/Touch to Play", { font: "mania", size: 32 }),
        k.anchor("center"),
        k.pos(k.center().x, k.center().y - 200),
    ]);


    makeSonic(k.vec2(200, 745)); // vec2 let us positioning our entities with 2D Vector

    // The function that is going to run every frame
    k.onUpdate(() => {
        // Background infinite animation
        if (bgPieces[1].pos.x < 0) {
            bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0); // 0 for the y axis
            bgPieces.push(bgPieces.shift()); // Switching positions
        }

        // Velocity settings
        bgPieces[0].move(-100, 0);
        // The second background piece moveTo the footsteps of the first bgPiece x position to create an infinte scrolling animation of the background
        bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

        // Platforms infinite animation
        if (platforms[1].pos.x < 0) {
            platforms[0].moveTo(platforms[1].pos.x + platforms[1].width * 4, 450);
            platforms.push(platforms.shift());
        }

        // Speed difference with the background for a parallax scrolling effect
        platforms[0].move(-2800, 0);
        platforms[1].moveTo(platforms[0].pos.x + platforms[1].width * 4, 450);
    })
}
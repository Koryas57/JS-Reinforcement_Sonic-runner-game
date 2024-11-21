import { makeMotobug } from "../entities/motobug";
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

    // On collision with "enemy" key, onCollide give the game object related to as a parameter for the function that we gonna execute
    sonic.onCollide("enemy", (enemy) => {
        if (!sonic.isGrounded()) {
            k.play("destroy", { volume: 0.5 });
            k.play("hyper-ring", { volume: 0.5 });
            k.destroy(enemy);
            sonic.play("jump");
            sonic.jump();
            // TODO
            return;
        }

        // If a collision occure on the ground, sonic is hurt and so we play the sound and redirect the player to game-over
        k.play("hurt", { volume: 0.5 });
        // TODO
        k.go("game-over");

    })


    // Speed settings
    let gameSpeed = 300;
    k.loop(1, () => { // In seconds
        gameSpeed += 50;
        console.log("Speed = ", gameSpeed);
    });

    // Arrow function get the same context as the parent function until they not create their own scope
    const spawnMotoBug = () => {
        // Positioning the entity with vec2, out of the screen
        const motobug = makeMotobug(k.vec2(1950, 773));
        console.log("Enemy n°" + motobug.id + " created");
        // Specific update loop, so when the object will be destroyed, the loop will be too, avoiding us performances issues
        motobug.onUpdate(() => {
            // Speed settings until 3000
            if (gameSpeed < 3000) {
                // Negative x-velocity to create a move to the left
                motobug.move(-(gameSpeed + 300), 0);
                return;
            }

            // When the gameSpeed increase a lot, for gameplay reason, we will define the motobug as the same speed as the platform
            motobug.move(-gameSpeed, 0);
        });

        // With the offscreen component we get access to onExitScreen method who run a function when object goes out of view, we will use it to destroy motobugs object
        motobug.onExitScreen(() => {
            if (motobug.pos.x < 0) k.destroy(motobug);
        })

        // Recursive function for infinite enemies spawner
        // We use .rand method from Kaplay, to get a random value that we will give to .wait, who will wait random seconds to run itself, generating a new random delay and spawning motobug entities infinitely
        const waitTime = k.rand(0.5, 2.5);
        k.wait(waitTime, spawnMotoBug);

    };

    // Spawning enemy entities
    spawnMotoBug();

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
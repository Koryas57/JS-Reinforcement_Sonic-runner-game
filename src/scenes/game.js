import { makeMotobug } from "../entities/motobug";
import { makeRing } from "../entities/ring";
import { makeSonic } from "../entities/sonic";
import k from "../kaplayCtx";

export default function game() {
    k.setGravity(3100); // Gravity is useless whitout body component to interact with
    // If not in a const, it will loop outside of the scene
    const citySfx = k.play("city", { volume: 0.2, loop: true });

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

    // Score handling
    let score = 0;
    let scoreMultiplier = 0;
    // Score displaying text will be updated in onCollide("ring")
    const scoreText = k.add([
        k.text("SCORE : 0", { font: "mania", size: 72 }),
        k.pos(20, 20),
    ]);

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
            scoreMultiplier += 1;
            // Player get a 10x multi for bumping an enemy
            score += 10 * scoreMultiplier
            scoreText.text = `SCORE : ${score}`;
            if (scoreMultiplier === 1) sonic.ringCollectUI.text = "+10";
            if (scoreMultiplier > 1) sonic.ringCollectUI.text = `x${scoreMultiplier}`;
            k.wait(2, () => (sonic.ringCollectUI.text = ""));
            return;
        }

        // If a collision occure on the ground, sonic is hurt and so we play the sound and redirect the player to game-over
        k.play("hurt", { volume: 0.5 });
        k.setData("current-score", score);
        k.go("game-over", citySfx);

    });


    sonic.onCollide("ring", (ring) => {
        k.play("ring", { volume: 0.5 });
        k.destroy(ring);
        score++;
        console.log("Current score = ", score);
        scoreText.text = `SCORE : ${score}`;
        // Ring collected +1 animation
        sonic.ringCollectUI.text = "+1"
        k.wait(1, () => (sonic.ringCollectUI.text = ""));
    });

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


    // Spawning rings entities
    const spawnRing = () => {
        const ring = makeRing(k.vec2(1950, 745));
        console.log("Rings created");
        ring.onUpdate(() => {
            ring.move(-gameSpeed, 0);
        });
        ring.onExitScreen(() => {
            if (ring.pos.x < 0) k.destroy(ring);
        })

        // Recusrsive function for infinite spawning
        const waitTime = k.rand(0.5, 3);
        k.wait(waitTime, spawnRing);
    };

    spawnRing();

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

        if (sonic.isGrounded()) scoreMultiplier = 0;

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
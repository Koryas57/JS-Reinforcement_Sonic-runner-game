import k from "../kaplayCtx";


// We create a game object and then render it
export function makeMotobug(pos) {
    return k.add([
        k.sprite("motobug", { anim: "run" }),
        k.scale(4),
        // We modify the default hitbox, first parameter is the offset, then the Rect size
        k.area({
            shape: new k.Rect(k.vec2(-5, 0), 32, 32),
        }),
        k.anchor("center"),
        k.pos(pos),
        // Allow us to use methods for checking out of the screen enemies
        k.offscreen(),
        "enemy",
    ]);
}
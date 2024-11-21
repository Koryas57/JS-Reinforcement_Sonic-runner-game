import k from "../kaplayCtx";


// We create a game object and then render it
export function makeRing(pos) {
    return k.add([
        k.sprite("ring", { anim: "spin" }),
        k.scale(4),
        // We modify the default hitbox, first parameter is the offset, then the Rect size
        k.area(),
        k.anchor("center"),
        k.pos(pos),
        k.offscreen(),
        "ring",
    ]);
}
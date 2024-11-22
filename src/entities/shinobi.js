import k from "../kaplayCtx";

export function makeShinobi(pos) {
    const shinobi = k.add([
        k.sprite("shinobi_run", { anim: "run" }),
        k.scale(3),
        k.area({
            shape: new k.Rect(k.vec2(-15, 20), 30, 80),
        }),
        k.anchor("center"),
        k.pos(pos),
        k.body({ jumpForce: 1500 }), // Offers the isGrounded method
        {
            ringCollectUI: null,
            setControls() {
                k.onButtonPress("jump", () => {
                    if (this.isGrounded()) {
                        this.use(k.sprite("shinobi_jump"));
                        this.play("jump"); // If grounded we can play the animation "jump" onButtonPress
                        this.jump();
                        k.play("jump", { volume: 0.1 }) // Play the selected sound with 0->1 Volume parameter
                    }
                });
            },
            // We define an arbitrary method to run the function we pass when the object is grounded
            setEvents() {
                this.onGround(() => {
                    this.use(k.sprite("shinobi_run"));
                    this.play("run");
                });
            },
        },
    ]);

    // .add on a game object will create a child game object
    shinobi.ringCollectUI = shinobi.add([
        k.text("", { font: "mania", size: 24 }),
        k.color(255, 255, 0),
        k.anchor("center"),
        k.pos(30, -10), // Relative to sonic value
    ]);

    return shinobi;
}
import k from "../kaplayCtx";

export function makeSonic(pos) {
    const sonic = k.add([
        k.sprite("sonic", { anim: "run" }),
        k.scale(4),
        k.area(),
        k.anchor("center"),
        k.pos(pos),
        k.body({ jumpForce: 1700 }), // Offers the isGrounded method
        {
            setControls() {
                k.onButtonPress("jump", () => {
                    if (this.isGrounded()) {
                        this.play("jump"); // If grounded we can play the animation "jump" onButtonPress
                        this.jump()
                        k.play("jump", { volume: 0.1 }) // Play the selected sound with 0->1 Volume parameter
                    }
                });
            },
            // We define an arbitrary method to run the function we pass when the object is grounded
            setEvents() {
                this.onGround(() => {
                    this.play("run");
                });
            },
        },
    ]);

    return sonic;
}
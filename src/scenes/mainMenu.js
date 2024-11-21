import k from "../kaplayCtx";

export default function mainMenu() {
    // First, we set the high score logic
    if (!k.getData("best-score")) k.setData("best-score", 0);
    // onButtonPress is an event handler, it take as 1st parameter the key we want to listen on, then, when the key is pressed, it is going to run the function that is passed as the second parameter. Here we call the .go function with "game" key to change the scene to the one where the actual game is.
    k.onButtonPress("jump", () => k.go("game"));

    const bgPieceWidth = 1920;
    const bgPieces = [
        // We create and position a game object with the sprite selected
        k.add([k.sprite("chemical-bg"), k.pos(0, 0), k.scale(2), k.opacity(0.8)]),
        k.add([
            k.sprite("chemical-bg"),
            k.pos(bgPieceWidth, 0),
            k.scale(2),
            k.opacity(0.8),
        ]),
    ];
}
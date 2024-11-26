import kaplay from "kaplay";

const k = kaplay({
    width: 1920,
    height: 1080,
    stretch: true,
    background: [0, 0, 0],
    global: false, // Not imported globally
    touchToMouse: true,
    buttons: {
        jump: {
            keyboard: ["space"],
            mouse: "left",
        },
    },
    debugKey: "d",
    debug: true,
});

export default k;
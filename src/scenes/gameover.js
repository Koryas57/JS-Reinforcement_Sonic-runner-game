import k from "../kaplayCtx";

// Better to improve in the future with state management for best practices
export default function gameover(citySfx) {
    citySfx.paused = true;

    // Récupération des scores
    let bestScore = k.getData("best-score");
    const currentScore = k.getData("current-score");

    // Gestion des grades de rang
    const rankGrades = [
        "Fais un effort !",
        "Tu commences à piger le truc",
        "Bravo, belle série",
        "Tu y étais presque !!",
        "Bienvenu dans les 5% !",
        "Tu es une machine",
        "Acharné(e)."
    ];
    const rankValues = [50, 80, 100, 200, 300, 400, 500];

    let currentRank = "Fais un effort !";
    let bestRank = "Fais un effort !";

    for (let i = 0; i < rankValues.length; i++) {
        if (rankValues[i] < currentScore) {
            currentRank = rankGrades[i];
        }

        if (rankValues[i] < bestScore) {
            bestRank = rankGrades[i];
        }
    }

    // Mise à jour du meilleur score
    if (bestScore < currentScore) {
        k.setData("best-score", currentScore);
        bestScore = currentScore;
        bestRank = currentRank;
    }

    // Texte principal "GAME OVER"
    k.add([
        k.text("GAME OVER", { font: "mania", size: 96 }),
        k.anchor("center"),
        k.pos(k.center().x, k.center().y - 400),
    ]);

    // Dimensions des conteneurs
    const boxWidth = 600;
    const boxHeight = 400;

    // Position des conteneurs
    const bestBoxPos = k.vec2(k.center().x - 500, k.center().y + 50);
    const lastBoxPos = k.vec2(k.center().x + 500, k.center().y + 50);

    // Texte pour "BEST SCORE"
    k.add([
        k.text(`BEST SCORE : ${bestScore}`, { font: "mania", size: 64 }),
        k.anchor("center"),
        k.pos(bestBoxPos.x, bestBoxPos.y - boxHeight / 2 - 50), // Position au-dessus de la boîte
    ]);

    // Texte pour "LAST SCORE"
    k.add([
        k.text(`LAST SCORE : ${currentScore}`, { font: "mania", size: 64 }),
        k.anchor("center"),
        k.pos(lastBoxPos.x, lastBoxPos.y - boxHeight / 2 - 50), // Position au-dessus de la boîte
    ]);

    // Conteneur pour "Best Rank"
    const bestRankBox = k.add([
        k.rect(boxWidth, boxHeight, { radius: 4 }),
        k.color(0, 0, 0),
        k.area(),
        k.anchor("center"),
        k.outline(6, k.Color.fromArray([255, 255, 255])), // Bordure blanche
        k.pos(bestBoxPos.x, bestBoxPos.y),
    ]);

    bestRankBox.add([
        k.text(bestRank, { font: "mania", size: 50 }),
        k.anchor("center"),
    ]);

    // Conteneur pour "Last Rank"
    const currentRankBox = k.add([
        k.rect(boxWidth, boxHeight, { radius: 4 }),
        k.color(0, 0, 0),
        k.area(),
        k.anchor("center"),
        k.outline(6, k.Color.fromArray([255, 255, 255])),
        k.pos(lastBoxPos.x, lastBoxPos.y),
    ]);

    currentRankBox.add([
        k.text(currentRank, { font: "mania", size: 50 }),
        k.anchor("center"),
    ]);

    // Texte pour rejouer
    k.wait(0.5, () => {
        const tryAgainText = k.add([
            k.text("Press Space/Click/Touch to Try Again", {
                font: "mania",
                size: 64,
            }),
            k.anchor("center"),
            k.pos(k.center().x, k.center().y + 350),
        ]);

        // Effet de clignotement
        k.loop(0.5, () => {
            tryAgainText.hidden = !tryAgainText.hidden; // Alterne entre visible et caché
        });

        k.onButtonPress("jump", () => k.go("game"));
    });

}

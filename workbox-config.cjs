// Module pour la gestion du cache pour l'utilisation de l'application hors ligne
module.exports = {
    globDirectory: "dist/",
    globPatterns: ["**/*.{html,js,png,jpg,mp3,css}"],
    swDest: "dist/service-worker.js",
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Limite augmentée à 5 Mo
};

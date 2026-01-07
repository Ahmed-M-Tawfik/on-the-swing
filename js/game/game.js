console.log("Loaded game.js");
window.g = window.g || {};

window.g.SWING_STABILITY_MAX = 100;
window.g.SWING_STABILITY_MIN = 0;

window.g.SWING_SEAT_STYLES = ["basic", "plain", "fancy", "extravagant"];
window.g.SWING_SEAT_MATERIALS = ["rubber", "leather", "old tyre", "plastic", "metal", "rope", "wooden"];
window.g.SWING_STYLES = ["basic", "plain", "fancy", "extravagant"];
window.g.SWING_COLOURS = ["red", "blue", "yellow", "green", "black", "white", "rusted", "metallic", "wooden"];
window.g.SWING_PAINT_STATE = ["unpainted", "gleaming", "somewhat chipped", "heavily chipped", "bare metal"];

window.g.initializeGameState = function (gameState) {
  gameState.swing = {
    seat: {
      style: "basic",
      material: "wooden",
      colour: "brown",

      inertia: 0, // kg*m^2
      lateralTumble: 0, // degrees
    },

    style: "basic",
    paintState: "unpainted",
    colour: "wooden",

    weight: 400, // kg
    stability: window.g.SWING_STABILITY_MAX,
  };
};

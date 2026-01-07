console.log("Loaded controller.js");
/* Controller. Provides the link between the Twee and logic and ui scripts */
window.c = window.c || {};

window.c.setupGame = function () {
  g.initializeGameState(v);

  window.ui.passage.goTo("Game");
};

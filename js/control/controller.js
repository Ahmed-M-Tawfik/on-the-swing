console.log("Loaded controller.js");
/* Controller. Provides the link between the Twee and logic and ui scripts */
window.c = window.c || {};

window.c.setupGame = function () {
  g.initializeGameState(v);

  window.ui.passage.goTo("Game");
};

window.c.swing_kickLegs = function () {
  g.swing_kickLegs(v);

  window.ui.passage.goTo("Game");
};

window.c.swing_counterKick = function () {
  g.swing_counterKick(v);

  window.ui.passage.goTo("Game");
};

window.c.swingStart_pushOff = function () {
  g.swingStart_pushOff(v);

  window.ui.passage.goTo("Game");
};

window.c.swing_wait = function () {
  g.swing_wait(v);

  window.ui.passage.goTo("Game");
};

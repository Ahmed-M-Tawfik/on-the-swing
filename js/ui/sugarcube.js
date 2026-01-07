console.log("Loaded sugarcube.js");
/* SugarCube-specific functionality */
window.ui = window.ui || {};

/* Passage movement */
window.ui.passage = window.ui.passage || {};
window.ui.passage.goTo = function (passageName) {
  window.e.play(passageName);
};

window.ui.passage.back = function () {
  window.e.backward();
};

/* Repaint without persisting data - will wipe changes, up to initial passage load */
window.ui.passage.refresh = function () {
  window.e.show();
};

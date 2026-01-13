console.log("Loaded format.js");

window.ui = window.ui || {};

/* Text formatting utilities */
window.ui.format = window.ui.format || {};

window.ui.format.playerAction = function (text) {
  return '<div class="player-action">' + text + "</div>";
};

window.ui.format.valueUpdate = function (text) {
  return '<div class="value-update">' + text + "</div>";
};

window.ui.format.formatValueUpdateIfDiff = function (oldValue, newValue) {
  if (oldValue !== newValue) {
    return window.ui.format.valueUpdate(newValue);
  } else {
    return newValue;
  }
};

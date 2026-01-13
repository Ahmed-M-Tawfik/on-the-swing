console.log("Loaded game.js");
window.g = window.g || {};

window.g.SWING_STABILITY_MAX = 100;
window.g.SWING_STABILITY_MIN = 0;

window.g.SWING_PUSH_OFF_FORCE_MAX = 5;
window.g.SWING_PUSH_OFF_FORCE_MIN = 2;

window.g.SWING_KICK_LEGS_FUMBLE_CHANCE = 0.1;

window.g.SWING_KICK_LEGS_FORCE_MAX = 4;
window.g.SWING_KICK_LEGS_FORCE_MIN = 1;
window.g.SWING_KICK_LEGS_FORCE_FUMBLE_MIN = -2;
window.g.SWING_KICK_LEGS_FORCE_FUMBLE_MAX = 1;

window.g.SWING_NATURAL_DAMPING = 0.5; // per round
window.g.SWING_STATIONARY_LIMIT = 0.5;

window.g.SWING_SEAT_STYLES = ["basic", "plain", "fancy", "extravagant"];
window.g.SWING_SEAT_MATERIALS = ["rubber", "leather", "old tyre", "plastic", "metal", "rope", "wooden"];
window.g.SWING_STYLES = ["basic", "plain", "fancy", "extravagant"];
window.g.SWING_COLOURS = ["red", "blue", "yellow", "green", "black", "white", "rusted", "metallic", "wooden"];
window.g.SWING_PAINT_STATE = ["unpainted", "gleaming", "somewhat chipped", "heavily chipped", "bare metal"];

window.g.PLAYER_ACTIONS = {
  none: "none",
  pushOff: "pushOff",
  kickLegs: "kickLegs",
  counterKick: "counterKick",
  coast: "coast",
  wait: "wait",
};

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
  gameState.lastRound = {
    isFumble: false,
    inertiaDelta: 0,
    oldInertia: 0,
    newInertia: 0,
    action: window.g.PLAYER_ACTIONS.none,
  };
};

let calcKick = function () {
  let isFumble = Math.random() < window.g.SWING_KICK_LEGS_FUMBLE_CHANCE ? true : false;
  let inertiaDelta = 0;
  if (isFumble) {
    inertiaDelta =
      Math.random() * (window.g.SWING_KICK_LEGS_FORCE_FUMBLE_MAX - window.g.SWING_KICK_LEGS_FORCE_FUMBLE_MIN) +
      window.g.SWING_KICK_LEGS_FORCE_FUMBLE_MIN;
  }
  inertiaDelta = Math.random() * window.g.SWING_KICK_LEGS_FORCE_MAX + window.g.SWING_KICK_LEGS_FORCE_MIN;

  return {
    isFumble: isFumble,
    inertiaDelta: inertiaDelta,
  };
};

window.g.swing_kickLegs = function (gameState) {
  let oldInertia = gameState.swing.seat.inertia;

  let { isFumble, inertiaDelta } = calcKick();

  gameState.swing.seat.inertia += inertiaDelta;

  gameState.lastRound = {
    isFumble: isFumble,
    inertiaDelta: inertiaDelta,
    oldInertia: oldInertia,
    newInertia: gameState.swing.seat.inertia,
    action: g.PLAYER_ACTIONS.kickLegs,
  };
};

window.g.swing_counterKick = function (gameState) {
  let oldInertia = gameState.swing.seat.inertia;

  let { isFumble, inertiaDelta } = calcKick();

  // calculate appropriate delta so that it can't go below zero
  if (inertiaDelta > gameState.swing.seat.inertia) {
    inertiaDelta = gameState.swing.seat.inertia;
  }

  gameState.swing.seat.inertia -= inertiaDelta;

  gameState.lastRound = {
    isFumble: isFumble,
    inertiaDelta: inertiaDelta,
    oldInertia: oldInertia,
    newInertia: gameState.swing.seat.inertia,
    action: g.PLAYER_ACTIONS.counterKick,
  };
};

window.g.swingStart_pushOff = function (gameState) {
  gameState.swing.seat.inertia = Math.random() * window.g.SWING_PUSH_OFF_FORCE_MAX + window.g.SWING_PUSH_OFF_FORCE_MIN;

  gameState.lastRound = {
    isFumble: false,
    inertiaDelta: gameState.swing.seat.inertia,
    oldInertia: 0,
    newInertia: gameState.swing.seat.inertia,
    action: g.PLAYER_ACTIONS.pushOff,
  };
};

window.g.swing_wait = function (gameState) {
  let oldInertia = gameState.swing.seat.inertia;
  let inertiaDelta = Math.max(0, gameState.swing.seat.inertia - window.g.SWING_NATURAL_DAMPING);
  gameState.swing.seat.inertia = inertiaDelta;
  let action = oldInertia >= g.SWING_STATIONARY_LIMIT ? g.PLAYER_ACTIONS.coast : g.PLAYER_ACTIONS.wait;

  gameState.lastRound = {
    isFumble: false,
    inertiaDelta: inertiaDelta,
    oldInertia: oldInertia,
    newInertia: gameState.swing.seat.inertia,
    action: action,
  };
};

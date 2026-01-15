console.log("Loaded game.js");
window.g = window.g || {};

window.g.SWING_STABILITY_MAX = 100;
window.g.SWING_STABILITY_MIN = 0;

window.g.SWING_PUSH_OFF_FORCE_MAX = 5;
window.g.SWING_PUSH_OFF_FORCE_MIN = 2;

window.g.SWING_KICK_LEGS_FUMBLE_CHANCE = 0.1;

window.g.SWING_KICK_LEGS_FORCE_MAX = 4;
window.g.SWING_KICK_LEGS_FORCE_MIN = 1;
window.g.SWING_KICK_LEGS_TUMBLE_MAX = 1;
window.g.SWING_KICK_LEGS_TUMBLE_MIN = 0;
window.g.SWING_KICK_LEGS_FORCE_FUMBLE_MIN = -2;
window.g.SWING_KICK_LEGS_FORCE_FUMBLE_MAX = 1;
window.g.SWING_KICK_LEGS_TUMBLE_FUMBLE_MIN = 1;
window.g.SWING_KICK_LEGS_TUMBLE_FUMBLE_MAX = 3;

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

      inertia: 0,
      lateralTumble: 0,
    },

    style: "basic",
    paintState: "unpainted",
    colour: "wooden",

    weight: 400,
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
  let isFumble = Math.random() < window.g.SWING_KICK_LEGS_FUMBLE_CHANCE;

  let inertiaDeltaInitial = 0;
  let tumbleDeltaInitial = 0;
  if (isFumble) {
    inertiaDeltaInitial =
      Math.random() * (window.g.SWING_KICK_LEGS_FORCE_FUMBLE_MAX - window.g.SWING_KICK_LEGS_FORCE_FUMBLE_MIN) +
      window.g.SWING_KICK_LEGS_FORCE_FUMBLE_MIN;
    tumbleDeltaInitial =
      Math.random() * (window.g.SWING_KICK_LEGS_TUMBLE_FUMBLE_MAX - window.g.SWING_KICK_LEGS_TUMBLE_FUMBLE_MIN) +
      window.g.SWING_KICK_LEGS_TUMBLE_FUMBLE_MIN;
  }
  inertiaDeltaInitial =
    Math.random() * (window.g.SWING_KICK_LEGS_FORCE_MAX - window.g.SWING_KICK_LEGS_FORCE_MIN) +
    window.g.SWING_KICK_LEGS_FORCE_MIN;
  tumbleDeltaInitial =
    Math.random() * (window.g.SWING_KICK_LEGS_TUMBLE_MAX - window.g.SWING_KICK_LEGS_TUMBLE_MIN) +
    window.g.SWING_KICK_LEGS_TUMBLE_MIN;

  return {
    isFumble: isFumble,
    inertiaDeltaInitial: inertiaDeltaInitial,
    tumbleDeltaInitial: tumbleDeltaInitial,
  };
};

/**
 * Change forces (inertia, optionally tumble) by delta amount (positive to increase, negative to decrease).
 * Clamps to prevent inertia from going below zero.
 * Returns actual change applied.
 * */
let changeForcesWithTumbleDampening = function (gameState, inertiaDelta, tumbleDelta) {
  let oldInertia = gameState.swing.seat.inertia;
  let oldTumble = gameState.swing.seat.lateralTumble;

  // When decreasing, clamp to prevent going below zero
  if (inertiaDelta < 0) {
    inertiaDelta = Math.max(inertiaDelta, -gameState.swing.seat.inertia);
  }
  if (tumbleDelta === undefined) {
    // engage tumble dampening inversely proportional to current inertia
    let currentInertia = oldInertia;
    let dampeningAmount;

    if (currentInertia >= 20) {
      dampeningAmount = 1;
    } else if (currentInertia <= 5) {
      dampeningAmount = 5;
    } else {
      // Linear interpolation between 5 and 1 for inertia between 5 and 20
      dampeningAmount = 5 - ((currentInertia - 5) / 15) * 4;
    }

    tumbleDelta = -dampeningAmount;
  }
  if (tumbleDelta < 0) {
    tumbleDelta = Math.max(tumbleDelta, -gameState.swing.seat.lateralTumble);
  }

  gameState.swing.seat.inertia += inertiaDelta;
  gameState.swing.seat.lateralTumble += tumbleDelta;

  return {
    inertiaDelta: inertiaDelta,
    oldInertia: oldInertia,
    newInertia: gameState.swing.seat.inertia,

    tumbleDelta: tumbleDelta,
    oldTumble: oldTumble,
    newTumble: gameState.swing.seat.lateralTumble,
  };
};

/**
 * Change tumble by delta amount (positive to increase, negative to decrease).
 * Clamps to prevent tumble from going below zero.
 * Returns actual change applied.
 * */
let changeTumble = function (gameState, delta) {
  let oldTumble = gameState.swing.seat.lateralTumble;

  // When decreasing, clamp to prevent going below zero
  if (delta < 0) {
    delta = Math.max(delta, -gameState.swing.seat.lateralTumble);
  }

  gameState.swing.seat.lateralTumble += delta;

  return {
    tumbleDelta: delta,
    oldTumble: oldTumble,
    newTumble: gameState.swing.seat.lateralTumble,
  };
};

window.g.swing_kickLegs = function (gameState) {
  let { isFumble, inertiaDeltaInitial, tumbleDeltaInitial } = calcKick();

  let { inertiaDelta, oldInertia, newInertia, tumbleDelta, oldTumble, newTumble } = changeForcesWithTumbleDampening(
    gameState,
    inertiaDeltaInitial,
    tumbleDeltaInitial
  );

  gameState.lastRound = {
    isFumble: isFumble,

    tumbleDelta: tumbleDelta,
    oldTumble: oldTumble,
    newTumble: newTumble,

    inertiaDelta: inertiaDelta,
    oldInertia: oldInertia,
    newInertia: newInertia,

    action: g.PLAYER_ACTIONS.kickLegs,
  };
};

window.g.swing_counterKick = function (gameState) {
  let { isFumble, inertiaDeltaInitial, tumbleDeltaInitial } = calcKick();

  let { inertiaDelta, oldInertia, newInertia, tumbleDelta, oldTumble, newTumble } = changeForcesWithTumbleDampening(
    gameState,
    -inertiaDeltaInitial,
    tumbleDeltaInitial
  );

  gameState.lastRound = {
    isFumble: isFumble,

    tumbleDelta: tumbleDelta,
    oldTumble: oldTumble,
    newTumble: newTumble,

    inertiaDelta: inertiaDelta,
    oldInertia: oldInertia,
    newInertia: newInertia,

    action: g.PLAYER_ACTIONS.counterKick,
  };
};

window.g.swingStart_pushOff = function (gameState) {
  let { inertiaDelta, oldInertia, newInertia, tumbleDelta, oldTumble, newTumble } = changeForcesWithTumbleDampening(
    gameState,
    Math.random() * (window.g.SWING_PUSH_OFF_FORCE_MAX - window.g.SWING_PUSH_OFF_FORCE_MIN) +
      window.g.SWING_PUSH_OFF_FORCE_MIN
  );

  gameState.lastRound = {
    isFumble: false,

    tumbleDelta: tumbleDelta,
    oldTumble: oldTumble,
    newTumble: newTumble,

    inertiaDelta: inertiaDelta,
    oldInertia: oldInertia,
    newInertia: newInertia,

    action: g.PLAYER_ACTIONS.pushOff,
  };
};

window.g.swing_wait = function (gameState) {
  let { inertiaDelta, oldInertia, newInertia, tumbleDelta, oldTumble, newTumble } = changeForcesWithTumbleDampening(
    gameState,
    -window.g.SWING_NATURAL_DAMPING,
    window.g.SWING_NATURAL_DAMPING * 3
  );

  let action = oldInertia >= g.SWING_STATIONARY_LIMIT ? g.PLAYER_ACTIONS.coast : g.PLAYER_ACTIONS.wait;

  gameState.lastRound = {
    isFumble: false,

    tumbleDelta: tumbleDelta,
    oldTumble: oldTumble,
    newTumble: newTumble,

    inertiaDelta: inertiaDelta,
    oldInertia: oldInertia,
    newInertia: newInertia,

    action: action,
  };
};

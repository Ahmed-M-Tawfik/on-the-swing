console.log("Loaded content.js");

window.ui = window.ui || {};

/* Text formatting utilities */
window.ui.content = window.ui.content || {};

window.ui.content.swingDescription = function (gameState) {
  return `You sit on a ${gameState.swing.seat.style} ${gameState.swing.seat.colour} ${gameState.swing.seat.material} seat, attached to a ${gameState.swing.style} ${gameState.swing.paintState} ${gameState.swing.colour} swing.`;
};

window.ui.content.seatInertiaDescription = function (seatInertia) {
  var inertiaText = "";
  if (seatInertia <= g.SWING_STATIONARY_LIMIT) inertiaText = "The seat is very still, as if frozen in time.";
  else if (seatInertia <= 5)
    if (!v.swing.seat.startedSwingingSignificantlyForTheFirstTime)
      inertiaText = "The seat rocks back and forth slowly, with the rhythm of a story waiting to be told.";
    else inertiaText = "The seat rocks back and forth slowly, as if the world were holding its breath.";
  else if (seatInertia <= 10) inertiaText = "The seat swings to and fro, with a steady, purposeful cadence.";
  else if (seatInertia <= 20)
    inertiaText = "The seat moves with real energy, the world blurring slightly at the edges of each swing.";
  else inertiaText = "The seat moves with wild abandon, the world spinning and swirling in a dizzying dance.";

  return inertiaText;
};

window.ui.content.seatTumbleDescription = function (seatTumble) {
  var tumbleText = "";
  if (seatTumble <= g.SWING_STATIONARY_LIMIT)
    tumbleText = "It hangs perfectly straight, aligned with the chains above.";
  else if (seatTumble <= 5) tumbleText = "It tilts slightly to one side, twisting gently on its chains.";
  else if (seatTumble <= 10)
    tumbleText = "It rocks and tilts unpredictably, swaying from side to side as the chains twist.";
  else if (seatTumble <= 20)
    tumbleText = "It spins and tumbles chaotically, the chains tangled and rotating with disorienting momentum.";

  return tumbleText;
};

window.ui.content.actionDescription = function (action, isFumble) {
  switch (action) {
    case g.PLAYER_ACTIONS.kickLegs: {
      if (isFumble)
        return "You attempt to kick your legs, but you mistime it, causing you to slow down and lose a bit of balance.";
      else return "You kick the air in sync with the swing, propelling the swing higher into the air.";
    }
    case g.PLAYER_ACTIONS.counterKick: {
      if (isFumble)
        return "You try to counter your swing with a kick, but you misjudge the timing, causing an awkward wobble.";
      else return "You kick against the motion of the swing, skillfully reducing its speed and stabilizing your ride.";
    }
    case g.PLAYER_ACTIONS.pushOff: {
      if (isFumble) return "You try to push off the ground, but you slip, resulting in a weak but jarring motion.";
      else return "You push off with strength, sending the swing soaring.";
    }
    case g.PLAYER_ACTIONS.coast: {
      return "You rest your legs, letting the swing carry you on its momentum.";
    }
    case g.PLAYER_ACTIONS.wait: {
      return "You sit still, your ears picking up the gentlest of sounds around you.";
    }
    default:
      return "";
  }
};

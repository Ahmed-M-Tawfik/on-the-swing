console.log("Loaded init.js");

/* Aliases for access to SugarCube functions/variables, as they aren't available normally in pure js */
window.s = window.s || {};
window.s.setup = function (engine, state) {
  // Create a getter for v that always references the current State.variables
  Object.defineProperty(window, "v", {
    get: function () {
      return state.variables;
    },
  });

  Object.defineProperty(window, "s", {
    get: function () {
      return state;
    },
  });

  Object.defineProperty(window, "e", {
    get: function () {
      return engine;
    },
  });
};

console.log("Loaded activityService.js");
window.g = window.g || {}

window.g.activityService = window.g.activityService || {}

window.g.activityService.proposeActivityResult = function (ship) {
    var results = {
        'human_consumable_water': 10,
        'human_consumable_food': 10
    };
    if(ship.resources['human_consumable_water'].count >= 5) {
        results['human_consumable_water'] = 15;
    }
    return results;
}

window.g.activityService.applyResult = function (result, ship) {
    ship.resources['human_consumable_water'].count += result['human_consumable_water'];
    ship.resources['human_consumable_food'].count += result['human_consumable_food'];
}
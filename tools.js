/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random number between min and max
 */
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Attach Event CrossPlatform
 */
function addEvent(obj, event, fct) {
    if (obj === null) {
        throw "obj is null";
    }

    if (obj.attachEvent) {
        obj.attachEvent("on" + event, fct);
    }
    else {
        obj.addEventListener(event, fct, false);
    }
}
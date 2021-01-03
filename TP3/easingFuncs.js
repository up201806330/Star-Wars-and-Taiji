function easeOutCirc(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
}

function easeInCirc(x) {
    return 1 - Math.sqrt(1 - Math.pow(x, 2));
}
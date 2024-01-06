export function remplaceSpaceToDash(value) {
    // Remplacer les espaces par des tirets
    let result = value.replace(/(%20| |:|')/g, "-").replace(/---/g, "-")
    result = result.replace(/  /g, "")
    return result;
}

export function remplaceDashToSpace(value) {
    let returnValue = value.replace(/-/g, " ");
    return returnValue;
}


module.exports = function splitCanvasString(ctx, string) {
    let splitStrings = [];
    let newString = "";
    let stringArray = string.split(' ');

    stringArray.forEach(i => {
        if (ctx.measureText(newString).width >= 800) {
            splitStrings.push(newString.slice(0, -1));
            newString = `${i} `;
        } 
        else newString+=`${i} `;
    });

    splitStrings.push(newString.slice(0, -1));

    return splitStrings;
};
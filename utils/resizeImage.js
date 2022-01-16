module.exports = function resizeImage(image) {
    let dimensions = {
        width: image.naturalWidth,
        height: image.naturalHeight
    };

    while (dimensions.width > 750 || dimensions.height > 500) {
        dimensions.width *= 0.95;
        dimensions.height *= 0.95;
    };

    return dimensions;
};